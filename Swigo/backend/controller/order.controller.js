const Order = require("../models/order/ordermodel");
const User = require("../models/user/usermodel");
const Shop = require("../models/shop/shopmodel");
const DeliveryAssignment = require("../models/delevry/deliveryAssignment");
const { sendDeliveryOtpEmail } = require("../utils/mail");
const { calculateKm } = require("../utils/distance")
const Razorpay = require("razorpay");
const dotenv = require("dotenv");
const crypto = require("crypto");

dotenv.config();

let instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const placeOrder = async (req, res) => {
    try {
        const { cartItems, deliveryAddress, paymentMethod, tip } = req.body;
        const userId = req.user?._id;

        if (!userId) return res.status(401).json({ success: false, message: 'Bhai, login session nahi mila!' });
        if (!cartItems?.length) return res.status(400).json({ success: false, message: 'Bhai cart toh khali hai!' });
        if (!deliveryAddress) return res.status(400).json({ success: false, message: 'Bhai delivery address missing hai!' });

        const groupItemsByShop = {};
        cartItems.forEach(item => {
            const shopId = item.shop?._id || item.shop; 
            if (shopId) {
                if (!groupItemsByShop[shopId]) groupItemsByShop[shopId] = [];
                groupItemsByShop[shopId].push(item);
            }
        });

        let grandItemTotal = 0;
        let totalDeliveryCharge = 0;
        let totalPackagingFee = 0;

        const shopOrders = await Promise.all(Object.keys(groupItemsByShop).map(async (shopId) => {
            const shopData = await Shop.findById(shopId).populate("owner");
            if (!shopData) throw new Error(`Shop ${shopId} not found`);

            const items = groupItemsByShop[shopId];
            const subtotal = items.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 0)), 0);

            let distance = 0;
            if (deliveryAddress.latitude && shopData.location?.coordinates) {
                distance = calculateKm(
                    Number(deliveryAddress.latitude) || 0,
                    Number(deliveryAddress.longitude) || 0,
                    Number(shopData.location.coordinates[1]) || 0,
                    Number(shopData.location.coordinates[0]) || 0
                );
            }

            // 🔥 LOGIC: 10 Rupees per KM
            const deliveryCharge = Math.round(distance * 10);
            const packagingFee = 15;
            
            // 🔥 LOGIC: 20% Admin Commission (Restaurant se)
            const commissionAmount = Math.round(subtotal * 0.20);

            grandItemTotal += subtotal;
            totalDeliveryCharge += deliveryCharge;
            totalPackagingFee += packagingFee;

            return {
                shop: shopData._id,
                owner: shopData.owner?._id,
                subtotal: subtotal, // Pure food total
                items: items.map(item => ({
                    item: item._id || item.id || item.item, 
                    price: Number(item.price) || 0,
                    quantity: Number(item.quantity) || 0,
                    name: item.name || "Item",
                    image: item.image || ""
                })),
                distance: distance,
                deliveryCharge: deliveryCharge,
                commissionAmount: commissionAmount, // 20% Comm.
                packagingFee: packagingFee,
                status: "pending"
            };
        }));

        const platformFee = 7; // 🔥 Updated to ₹7
        const gst = 0; // 🔥 GST Removed
        const riderTip = Number(tip) || 0;

        const finalGrandTotal = grandItemTotal + totalDeliveryCharge + totalPackagingFee + platformFee + gst + riderTip;

        const newOrder = await Order.create({
            user: userId,
            paymentMethod: paymentMethod?.toLowerCase().trim() || "cod",
            delevryAddress: {
                text: deliveryAddress.text || "",
                latitude: Number(deliveryAddress.latitude) || 0,
                longitude: Number(deliveryAddress.longitude) || 0
            },
            shopOrders,
            itemTotal: grandItemTotal,
            totalDeliveryFee: totalDeliveryCharge,
            totalPackagingFee: totalPackagingFee,
            platformFee,
            gst,
            tip: riderTip,
            totalAmount: finalGrandTotal,
            paymentStatus: paymentMethod === 'online' ? "pending" : "unpaid" 
        });

        // 🌐 Real-time Notification logic same rahega...
        const notifyOwners = () => {
            if (req.io) {
                newOrder.shopOrders.forEach(so => {
                    if (so.owner) {
                        req.io.to(so.owner.toString()).emit("newOrderReceived", { message: "Bhai, naya order aaya hai!", order: newOrder });
                    }
                });
            }
        };

        if (paymentMethod === 'online') {
            const options = { amount: Math.round(finalGrandTotal * 100), currency: "INR", receipt: `receipt_${newOrder._id}` };
            try {
                const razorpayOrder = await instance.orders.create(options);
                newOrder.razorpayOrderId = razorpayOrder.id;
                await newOrder.save();
                notifyOwners();
                return res.status(201).json({ success: true, order: newOrder, razorpayOrder });
            } catch (err) {
                return res.status(500).json({ success: false, message: "Razorpay error: " + err.message });
            }
        }

        notifyOwners();
        const populatedOrder = await Order.findById(newOrder._id).populate({ path: "shopOrders.shop", select: "name shopName image address" });
        return res.status(201).json({ success: true, order: populatedOrder });

    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// 2. Verify Payment
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest("hex");

        if (expectedSignature === razorpay_signature) {
            const updatedOrder = await Order.findByIdAndUpdate(orderId, { paymentStatus: "paid", razorpayPaymentId: razorpay_payment_id }, { new: true });
            
            // 🌐 Real-time: Notify User
            if(req.io) req.io.to(orderId.toString()).emit("paymentVerified", { status: "paid" });

            return res.status(200).json({ success: true, message: "Payment Verified Successfully! 🎉" });
        } else {
            return res.status(400).json({ success: false, message: "Signature Mismatch!" });
        }
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// 🚀 FIXED: Update Order Status (Restaurant Side)
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, shopId } = req.params;
        const { status } = req.body;

        const order = await Order.findById(orderId).populate("shopOrders.shop");
        const shopOrder = order?.shopOrders.find(o => o.shop._id.toString() === shopId.toString());

        if (!shopOrder) return res.status(404).json({ message: "Shop order not found" });

        shopOrder.status = status;
        let deliveryBoysPayload = [];

        if (status === "out for delivery") {
            if (!shopOrder.assignment) {
                const { longitude, latitude } = order.delevryAddress;
                
                // 🔥 CHIEF INJECTION: Only fetch delivery boys who are active and online!
                const nearByBoys = await User.find({
                    role: "deliveryboy",
                    isOnline: true, // 👈 OFFLINE RIDERS BAHAR KHALLAS!
                    location: {
                        $near: {
                            $geometry: { type: "Point", coordinates: [Number(longitude), Number(latitude)] },
                            $maxDistance: 50000
                        }
                    }
                }).select("fullname mobile _id");

                if (nearByBoys.length > 0) {
                    const newAssignment = await DeliveryAssignment.create({
                        order: order._id,
                        shop: shopOrder.shop,
                        shopOrderId: shopOrder._id,
                        brodcastedTo: nearByBoys.map(b => b._id),
                        status: "brodcasted",
                    });
                    
                    shopOrder.assignment = newAssignment._id;
                    
                    // Naming keys format normalized for seamless frontend map parsing
                    deliveryBoysPayload = nearByBoys.map(b => ({ 
                        _id: b._id, 
                        fullname: b.fullname, 
                        mobile: b.mobile 
                    }));

                    // 🌐 Real-time: Notify Delivery Boys via socket
                    if (req.io) {
                        nearByBoys.forEach(boy => {
                            req.io.to(boy._id.toString()).emit("newOrderAvailable", { 
                                assignmentId: newAssignment._id,
                                shopName: shopOrder.shop.name 
                            });
                        });
                    }
                }
            }
        }

        order.markModified('shopOrders');
        await order.save();

        // 🌐 Real-time: Notify User (Track Page)
        if (req.io) {
            req.io.to(orderId.toString()).emit("orderStatusChanged", { shopId: shopId, status: status });
        }

        res.status(200).json({ success: true, status: shopOrder.status, availableBoys: deliveryBoysPayload });
    } catch (error) { 
        res.status(500).json({ message: error.message }); 
    }
};


// 4. Accept Mission (Delivery Boy Side) - FIXED FOR PARAMS 🏍️
const acceptOrder = async (req, res) => {
    try {
        // 🔥 FIX: Agar route mein :id hai ya :assignmentId, dono ko handle karne ke liye fallback lagaya
        const assignmentId = req.params.assignmentId || req.params.id;
        const userId = req.user?._id; 

        if (!assignmentId) {
            return res.status(400).json({ success: false, message: "Bhai, Assignment ID missing hai!" });
        }

        const assignment = await DeliveryAssignment.findById(assignmentId);
        if (!assignment) return res.status(404).json({ message: "Mission signal lost!" });

        assignment.assignedTo = userId;
        assignment.status = 'assigned';
        await assignment.save();

        const order = await Order.findById(assignment.order).populate("shopOrders.shop");
        if (!order) return res.status(404).json({ message: "Order nahi mila bhai!" });

        const shopOrder = order.shopOrders.id(assignment.shopOrderId);
        
        if (shopOrder) {
            shopOrder.assignedDeliveryBoy = userId;
            shopOrder.status = "preparing"; 
            order.markModified('shopOrders');
            await order.save();

            // 🌐 Real-time: Notify ALL in Order Room (User & Owner)
            if (req.io) {
                req.io.to(order._id.toString()).emit("driverAssigned", { 
                    driverId: userId, 
                    shopId: shopOrder.shop._id,
                    status: "preparing" 
                });
            }
        }
        res.status(200).json({ success: true, message: 'Mission Accepted! 🏍️' });
    } catch (error) { 
        console.error("❌ Accept Order Error:", error);
        res.status(500).json({ success: false, message: error.message }); 
    }
};

// 5. Verify Delivery OTP (COD Block Matrix Enabled 🔥)
const verifyDeliveryOtp = async (req, res) => {
    try {
        const { orderId, shopOrderId, otp } = req.body;
        const order = await Order.findById(orderId);
        const shopOrder = order?.shopOrders.id(shopOrderId);

        if (!shopOrder || shopOrder.deliveryOtp !== otp.toString()) {
            return res.status(400).json({ success: false, message: "Wrong OTP!" });
        }

        shopOrder.status = "delivered";
        shopOrder.deliveryOtp = undefined;
        order.markModified('shopOrders');
        await order.save();

        await DeliveryAssignment.findOneAndUpdate(
            { order: orderId, shopOrderId: shopOrderId },
            { status: "delivered", deliveredAt: Date.now() }
        );

        // 🚀 LIVE FINANCIAL SETTLEMENT GRID
        if (shopOrder.assignedDeliveryBoy) {
            const calculatedCharge = Number(shopOrder.deliveryCharge) || 0;
            const collectedTip = Number(order.tip) || 0;
            const totalPayout = calculatedCharge + collectedTip; // Rider ki real kamai

            // Checking variables
            const isCodOrder = order.paymentMethod?.toLowerCase().trim() === "cod";
            const cashAmountCollected = isCodOrder ? Number(order.totalAmount) : 0;

            await User.findByIdAndUpdate(shopOrder.assignedDeliveryBoy, {
                $inc: { 
                    wallet: totalPayout,           // 💰 Rider ki kamai wallet me plus hui
                    lifetimeEarnings: totalPayout, // 💎 Total life profit tracks
                    cashInHand: cashAmountCollected // 💸 Agar COD hai, toh physical cash rider ke sar par chadh gaya!
                }
            });

            // 🏪 Merchant (Shop Owner) Settlement
            const merchantShare = Number(shopOrder.subtotal) + Number(shopOrder.packagingFee) - Number(shopOrder.commissionAmount);
            await Shop.findByIdAndUpdate(shopOrder.shop, {
                $inc: { 
                    wallet: merchantShare,
                    lifetimeEarnings: merchantShare,
                    totalOrders: 1 // Real order incremental update lock!
                }
            });
        }

        if (req.io) {
            req.io.to(orderId.toString()).emit("orderStatusChanged", { shopId: shopOrderId, status: "delivered" });
        }

        res.status(200).json({ success: true, message: "🎉 Delivered successfully and logs registered!" });
    } catch (error) { 
        res.status(500).json({ message: error.message }); 
    }
};

const getRiderStats = async (req, res) => {
    try {
        const riderId = req.user?._id || req.userId || req.id;
        if (!riderId) {
            return res.status(401).json({ success: false, message: "Session missing bhai!" });
        }

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        // 1. Aaj ke dynamic live delivered orders
        const todayOrders = await Order.find({
            "shopOrders.assignedDeliveryBoy": riderId,
            "shopOrders.status": "delivered",
            updatedAt: { $gte: startOfToday }
        });

        let todayEarnings = 0;
        let todayCash = 0;
        
        todayOrders.forEach(o => {
            const myOrder = o.shopOrders.find(so => so.assignedDeliveryBoy.toString() === riderId.toString());
            if (myOrder) {
                todayEarnings += (myOrder.deliveryCharge || 0) + (o.tip || 0);
                if (o.paymentMethod?.toLowerCase().trim() === 'cod') {
                    todayCash += (o.totalAmount || 0);
                }
            }
        });

        // 2. 🚀 SYNTAX FIX: Pichle 7 din ka pure clean dynamic loop
        let graphData = [];
        for (let i = 6; i >= 0; i--) { // 👈 FIX: Ekdum clean mathematical loop iteration
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() - i);
            
            // X-Axis ke liye custom short day name (e.g., "Mon", "Tue")
            const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'short' });

            const dayStart = new Date(currentDate);
            dayStart.setHours(0, 0, 0, 0);

            const dayEnd = new Date(currentDate);
            dayEnd.setHours(23, 59, 59, 999);

            // Database se strictly usi specific din ke delivered counts fetch karo
            const dayOrders = await Order.find({
                "shopOrders.assignedDeliveryBoy": riderId,
                "shopOrders.status": "delivered",
                updatedAt: { $gte: dayStart, $lte: dayEnd }
            });

            let dayTotal = 0;
            dayOrders.forEach(o => {
                const myOrder = o.shopOrders.find(so => so.assignedDeliveryBoy.toString() === riderId.toString());
                if (myOrder) {
                    dayTotal += (myOrder.deliveryCharge || 0) + (o.tip || 0);
                }
            });

            // Real calculations appended to stats block array
            graphData.push({ day: dayName, amount: dayTotal });
        }

        // Live user (rider) cash values pulling from DB
        const currentRider = await User.findById(riderId);
        if (!currentRider) {
            return res.status(404).json({ success: false, message: "Rider not found in system!" });
        }

        return res.status(200).json({
            success: true,
            stats: {
                earnings: currentRider.wallet || 0,
                delivered: todayOrders.length,
                cash: currentRider.cashInHand || 0, 
                incentive: todayOrders.length >= 10 ? 100 : 0,
                graphData // 100% Real un-duplicated structure data
            }
        });

    } catch (error) {
        console.error("🔥 getRiderStats Real Time Crash:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// --- Helper Functions (No Changes Needed) ---
const getMyOrders = async (req, res) => {
    try {
        const userId = req.user?._id; 
        const user = await User.findById(userId);
        let orders = [];
        if (user.role === "user") orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).populate("shopOrders.shop").lean();
        else if (user.role === "owner") {
            const allOrders = await Order.find({ "shopOrders.owner": userId }).sort({ createdAt: -1 }).populate("user", "fullname mobile").populate("shopOrders.shop").lean();
            orders = allOrders.map(order => ({
                ...order,
                shopOrders: order.shopOrders.filter(so => so.owner?.toString() === userId.toString())
            }));
        } else if (user.role === "deliveryboy") {
            orders = await Order.find({ "shopOrders.assignedDeliveryBoy": userId }).sort({ createdAt: -1 }).populate("shopOrders.shop").populate("user", "fullname mobile").lean();
        }
        res.status(200).json(orders || []);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const getCurrentOrder = async (req, res) => {
    try {
        const userId = req.user?._id; 
        
        const assignment = await DeliveryAssignment.findOne({ 
            assignedTo: userId, 
            status: { $in: ["assigned", "picked", "out for delivery"] } 
        }).populate({ path: "order", populate: { path: "user" } }).populate("shop");
        
        if (!assignment) return res.status(200).json(null);
        
        const shopOrder = assignment.order.shopOrders.id(assignment.shopOrderId);
        
        return res.status(200).json({ 
            success: true, 
            orderId: assignment.order._id, 
            shopOrder, 
            // 🔥 REAL FIX 1: Frontend ke liye deep key mapping ko explicit bheja
            totalAmount: assignment.order.totalAmount || shopOrder?.total || 0,
            deliveryCharge: shopOrder?.deliveryCharge || 40,
            paymentMethod: assignment.order.paymentMethod, 
            customer: assignment.order.user, 
            shopDetails: { 
                lat: assignment.shop?.location?.coordinates[1], 
                lon: assignment.shop?.location?.coordinates[0], 
                name: assignment.shop?.name, 
                address: assignment.shop?.address 
            }, 
            customerDetails: { 
                lat: assignment.order.delevryAddress.latitude, 
                lon: assignment.order.delevryAddress.longitude, 
                address: assignment.order.delevryAddress.text 
            } 
        });
    } catch (error) { 
        console.error("❌ Get Current Order Error:", error);
        res.status(500).json({ message: error.message }); 
    }
};

const sendDeliveryOtp = async (req, res) => {
    try {
        const { orderId, shopOrderId } = req.body;
        
        // 1. User email ke saath populate karo
        const order = await Order.findById(orderId).populate("user", "email");
        
        // 2. Check karo ki user aur email exist karte hain
        if (!order || !order.user || !order.user.email) {
            console.error("Order or User Email missing for OrderId:", orderId);
            return res.status(404).json({ message: "Order ya User ki email nahi mili!" });
        }

        const shopOrder = order.shopOrders.id(shopOrderId);
        if (!shopOrder) return res.status(400).json({ message: "Bhai IDs galat hain!" });

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        shopOrder.deliveryOtp = otp;
        shopOrder.otpExpires = Date.now() + 10 * 60 * 1000;
        
        order.markModified('shopOrders'); 
        await order.save();

        // 3. Email send karo
        await sendDeliveryOtpEmail(order.user.email, otp); 

        res.status(200).json({ success: true, message: "OTP Sent Successfully!" });
    } catch (error) { 
        console.error("OTP Controller Error:", error);
        res.status(500).json({ message: "Server error, check logs" }); 
    }
};


const getDeliveryBoyAssignment = async (req, res) => {
    try {
        const userId = req.user?._id; 
        const assignments = await DeliveryAssignment.find({ brodcastedTo: userId, status: "brodcasted" }).populate("order").populate("shop");
        res.status(200).json(assignments);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate("user shopOrders.shop").lean();
        res.status(200).json(order);
    } catch (error) { res.status(500).json({ message: error.message }); }
};




// 2. Rider ki poori history
const getRiderHistory = async (req, res) => {
    try {
        const riderId = req.user._id;
        const history = await Order.find({ "shopOrders.assignedDeliveryBoy": riderId })
            .populate("shopOrders.shop", "name image")
            .sort({ createdAt: -1 });

        res.status(200).json(history);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// 🚀 RIDER DEBT ORDER CREATION
const riderPayDebtOrder = async (req, res) => {
    try {
        const riderId = req.user?._id || req.userId || req.id;
        if (!riderId) {
            return res.status(401).json({ success: false, message: "Bhai auth session nahi mila!" });
        }

        const rider = await User.findById(riderId);
        if (!rider) {
            return res.status(404).json({ success: false, message: "Rider nahi mila!" });
        }

        const debtAmount = Number(rider.cashInHand) || 0;
        if (debtAmount <= 0) {
            return res.status(400).json({ success: false, message: "Bhai, koi cash debt bacha hi nahi hai!" });
        }

        // 🔥 LENGTH FIX: Idhar hum slice kar rahe hain taaki receipt length hamesha 30-35 characters hi rahe
        const shortId = riderId.toString().slice(-6); 
        const options = {
            amount: Math.round(debtAmount * 100), 
            currency: "INR",
            receipt: `rcpt_debt_${shortId}_${Date.now().toString().slice(-6)}` // Strict under 40 chars!
        };

        const razorpayOrder = await instance.orders.create(options);
        
        return res.status(200).json({ 
            success: true, 
            razorpayOrder, 
            amount: debtAmount 
        });

    } catch (error) {
        console.error("🔥 riderPayDebtOrder Core Crash:", error); 
        return res.status(500).json({ success: false, message: `Server Error` });
    }
};

// 🚀 VERIFY RIDER PAYMENT AND WIPE CASH TO ZERO
const verifyRiderDebtPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const riderId = req.user?._id || req.userId || req.id;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: "Missing parameter tokens!" });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            // Signature matched, resetting cash collection metrics directly in DB
            await User.findByIdAndUpdate(riderId, { $set: { cashInHand: 0 } });
            return res.status(200).json({ success: true, message: "Debt cleared successfully! Wallet unlocked. 🎉" });
        } else {
            return res.status(400).json({ success: false, message: "Security Signature Mismatch!" });
        }
    } catch (error) {
        console.error("🔥 verifyRiderDebtPayment Core Crash:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};


module.exports = { 
    placeOrder, getMyOrders, updateOrderStatus, getDeliveryBoyAssignment, acceptOrder, 
    getCurrentOrder, getOrderById, sendDeliveryOtp, verifyDeliveryOtp, verifyPayment, getRiderStats, getRiderHistory, riderPayDebtOrder, verifyRiderDebtPayment
};