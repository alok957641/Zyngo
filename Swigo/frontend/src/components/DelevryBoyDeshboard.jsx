import React, { useState, useEffect } from "react";
import axios from "axios"; 
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMap, Polyline } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";
import { 
    FiTrendingUp, FiCheckCircle, FiHome, FiPieChart, 
    FiPackage, FiZap, FiLoader, FiPhoneCall, 
    FiMapPin, FiUser, FiNavigation, FiLogOut, FiInfo, FiActivity
} from "react-icons/fi";
import { RiMotorbikeFill, RiWallet3Fill } from "react-icons/ri";
import { setUserData } from "../redux/userSlice"; // Check if imported correctly

const serverurl = "import.meta.env.VITE_API_URL";

// --- Custom Icons (Sharp Style) ---
const riderIcon = new L.Icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png', iconSize: [36, 36], iconAnchor: [18, 36] });
const shopIcon = new L.Icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/610/610365.png', iconSize: [30, 30], iconAnchor: [15, 30] });
const customerIcon = new L.Icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/1277/1277337.png', iconSize: [30, 30], iconAnchor: [15, 30] });

function RecenterMap({ position }) {
    const map = useMap();
    useEffect(() => { if (position) map.flyTo(position, 15, { duration: 1.2 }); }, [position, map]);
    return null;
}

function MapLines({ riderPos, activeOrder }) {
    const shopLat = activeOrder?.shopDetails?.lat;
    const shopLon = activeOrder?.shopDetails?.lon;
    const custLat = activeOrder?.customerDetails?.lat;
    const custLon = activeOrder?.customerDetails?.lon;

    return (
        <>
            {riderPos?.lat && riderPos?.lng && shopLat && shopLon && (
                <Polyline 
                    positions={[[riderPos.lat, riderPos.lng], [shopLat, shopLon]]} 
                    pathOptions={{ color: "#f97316", weight: 4, dashArray: "6, 8", opacity: 0.8 }} 
                />
            )}
            {shopLat && shopLon && custLat && custLon && (
                <Polyline 
                    positions={[[shopLat, shopLon], [custLat, custLon]]} 
                    pathOptions={{ color: "#3b82f6", weight: 4, opacity: 0.6 }} 
                />
            )}
        </>
    );
}

function DelevryBoyDeshboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch(); 
    const { userData } = useSelector((state) => state.user);
    
    const [realStats, setRealStats] = useState({ earnings: 0, delivered: 0, rating: 5.0, cash: 0 });
    const [availableMissions, setAvailableMissions] = useState([]);
    const [activeOrder, setActiveOrder] = useState(null);
    const [riderPos, setRiderPos] = useState(null);
    const [isOnline, setIsOnline] = useState(true);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otp, setOtp] = useState("");
    const [btnLoading, setBtnLoading] = useState(false);
    const [statusToggleLoading, setStatusToggleLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ text: "", isError: false });

    const triggerMessage = (text, isError = false) => {
        setStatusMessage({ text, isError });
        setTimeout(() => setStatusMessage({ text: "", isError: false }), 4000);
    };

    // 📡 ASLI DATA SYNC (Polling)
    const fetchEverything = async () => {
        if (!isOnline || !userData) return;
        try {
            const [statsRes, missionRes, activeRes] = await Promise.all([
                axios.get(`${serverurl}/api/order/rider-stats`, { withCredentials: true }),
                axios.get(`${serverurl}/api/order/get-delivery-assignments`, { withCredentials: true }),
                axios.get(`${serverurl}/api/order/get-current-order`, { withCredentials: true })
            ]);

            if (statsRes.data.success) setRealStats(statsRes.data.stats);
            
            // Backend raw array response wrapper
            const rawMissions = missionRes.data || [];
            
            // 🔥 UNIQUE LOGIC FILTER LAYER: Duplicate orders ko render block karne ke liye Map logic lagaya
            const uniqueMissionsMap = {};
            rawMissions.forEach((mission) => {
                // Agar assignment ke andar order string metadata unique h toh use map me store karo
                const orderIdKey = mission.order?._id || mission.order;
                if (orderIdKey && !uniqueMissionsMap[orderIdKey]) {
                    uniqueMissionsMap[orderIdKey] = mission; 
                }
            });

            // Map data ko wapas simple clean filter list array me unpack kiya
            setAvailableMissions(Object.values(uniqueMissionsMap));
            setActiveOrder(activeRes.data?.success ? activeRes.data : null);
        } catch (err) { 
            console.error("Syncing Error..."); 
        }
    };

    useEffect(() => {
        if (userData) {
            setIsOnline(userData.isOnline !== false);
        }
    }, [userData]);

    useEffect(() => {
        if(!userData) return;

        let watchId;
        if (isOnline) {
            watchId = navigator.geolocation.watchPosition((pos) => {
                const { latitude, longitude } = pos.coords;
                setRiderPos({ lat: latitude, lng: longitude });
                axios.post(`${serverurl}/api/user/update-location`, { latitude, longitude }, { withCredentials: true });
            }, (err) => console.log(err), { enableHighAccuracy: true });

            fetchEverything();
        } else {
            setAvailableMissions([]); 
        }

        const poll = setInterval(() => {
            if (isOnline) fetchEverything();
        }, 4000);

        return () => { 
            clearInterval(poll); 
            if (watchId) navigator.geolocation.clearWatch(watchId); 
        };
    }, [isOnline, userData]);

    const handleAvailabilityToggle = async () => {
        try {
            setStatusToggleLoading(true);
            const res = await axios.post(`${serverurl}/api/user/toggle-availability`, {}, { withCredentials: true });
            if (res.data.success) {
                setIsOnline(res.data.isOnline);
                triggerMessage(`Node Status Switch: Now ${res.data.isOnline ? "ONLINE" : "IDLE (OFFLINE)"}`);
            }
        } catch (err) {
            console.error(err);
            triggerMessage("Failed to sync radar status with database!", true);
        } finally {
            setStatusToggleLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            localStorage.clear(); 
            dispatch(setUserData(null));
            await axios.get(`${serverurl}/api/user/logout`, { withCredentials: true });
            window.location.href = "/signin"; 
        } catch (err) {
            window.location.href = "/signin"; 
        }
    };

    const handleStartFinish = async () => {
        try {
            if (!activeOrder?.orderId || !activeOrder?.shopOrder?._id) return;
            setBtnLoading(true);
            const res = await axios.post(`${serverurl}/api/order/send-delivery-otp`, {
                orderId: activeOrder.orderId,
                shopOrderId: activeOrder.shopOrder._id
            }, { withCredentials: true });
            if (res.data.success) {
                setShowOtpInput(true);
                triggerMessage("Verification token sent to customer email.");
            }
        } catch (err) { 
            triggerMessage("Authentication signal failed!", true); 
        } finally { 
            setBtnLoading(false); 
        }
    };

    const handleVerifyFinish = async () => {
        try {
            if (!activeOrder?.orderId || !activeOrder?.shopOrder?._id) return;
            setBtnLoading(true);
            const res = await axios.post(`${serverurl}/api/order/verify-otp`, {
                orderId: activeOrder.orderId,
                shopOrderId: activeOrder.shopOrder._id,
                otp
            }, { withCredentials: true });
            if (res.data.success) {
                triggerMessage("Mission successful! Payout dispatched.");
                setActiveOrder(null); 
                setShowOtpInput(false); 
                setOtp(""); 
                fetchEverything();
            }
        } catch (err) { 
            triggerMessage("Security mismatch: Invalid OTP!", true); 
        } finally { 
            setBtnLoading(false); 
        }
    };

    const handleAccept = async (id) => {
        try {
            setBtnLoading(true);
            const res = await axios.post(`${serverurl}/api/order/accept-order/${id}`, {}, { withCredentials: true });
            if (res.data.success) {
                triggerMessage("Mission successfully locked to your node!");
                fetchEverything();
            }
        } catch (e) { 
            triggerMessage(e.response?.data?.message || "Signal lost: Order already hijacked!", true); 
        } finally { 
            setBtnLoading(false); 
        }
    };

    const isCod = activeOrder?.paymentMethod?.toLowerCase() === "cod";

    return (
        <div className="min-h-screen bg-[#020617] font-sans pb-32 text-slate-200 selection:bg-orange-500/20">
            {/* PLATFORM HEADER */}
            <header className="bg-[#090d1f]/60 border-b border-white/[0.03] pt-12 pb-4 px-6 backdrop-blur-md sticky top-0 z-40">
                <div className="flex justify-between items-center mb-4 max-w-5xl mx-auto w-full">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-orange-600 flex items-center justify-center text-xs font-black text-white rounded-lg">
                            {userData?.fullname?.charAt(0)}
                        </div>
                        <div>
                            <p className="text-[8px] font-black text-orange-500 tracking-[1.5px] uppercase">Rider Node</p>
                            <h2 className="text-sm font-black text-white tracking-tight uppercase mt-0.5">{userData?.fullname || "R-NODE"}</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button 
                            onClick={handleAvailabilityToggle} 
                            disabled={statusToggleLoading}
                            className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                isOnline 
                                    ? "bg-green-600/10 text-green-400 border border-green-500/20 hover:bg-green-600/20" 
                                    : "bg-red-600/10 text-red-400 border border-red-500/20 hover:bg-red-600/20 animate-pulse"
                            }`}
                        >
                            {statusToggleLoading ? "● SYNCING..." : isOnline ? "● Live" : "○ Idle"}
                        </button>
                        <button onClick={handleLogout} className="h-7 w-7 bg-white/[0.02] border border-white/5 flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors rounded-lg">
                            <FiLogOut size={12} />
                        </button>
                    </div>
                </div>

                <div className="border-t border-white/[0.03] pt-3 max-w-5xl mx-auto w-full flex justify-between items-center">
                    <div>
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Available Vault</p>
                        <h3 className="text-lg font-black text-orange-500 tracking-tight mt-0.5">₹{realStats.earnings}</h3>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Delivered</p>
                        <h3 className="text-lg font-black text-blue-400 tracking-tight mt-0.5">{realStats.delivered} <span className="text-[8px] text-slate-600 font-bold">PKTS</span></h3>
                    </div>
                </div>
            </header>

            {statusMessage.text && (
                <div className="max-w-5xl mx-auto px-4 mt-2">
                    <div className={`border rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider flex items-center gap-2 ${statusMessage.isError ? 'bg-red-500/5 border-red-500/10 text-red-400' : 'bg-orange-500/5 border-orange-500/10 text-orange-400'}`}>
                        <FiInfo size={12} /> {statusMessage.text}
                    </div>
                </div>
            )}

            <main className="max-w-5xl mx-auto px-4 mt-4 relative z-20">
                <AnimatePresence mode="wait">
                    {activeOrder ? (
                        /* ACTIVE MISSION LAYOUT */
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.01] border border-white/5 rounded-[1.5rem] overflow-hidden shadow-2xl">
                            <div className="h-[220px] w-full relative border-b border-white/5">
                                <MapContainer center={[activeOrder.shopDetails?.lat || 25.2425, activeOrder.shopDetails?.lon || 87.0145]} zoom={15} className="h-full w-full z-10" zoomControl={false}>
                                    <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                                    {activeOrder.shopDetails?.lat && <Marker position={[activeOrder.shopDetails.lat, activeOrder.shopDetails.lon]} icon={shopIcon} />}
                                    {activeOrder.customerDetails?.lat && <Marker position={[activeOrder.customerDetails.lat, activeOrder.customerDetails.lon]} icon={customerIcon} />}
                                    {riderPos && <Marker position={[riderPos.lat, riderPos.lng]} icon={riderIcon} />}
                                    
                                    <MapLines riderPos={riderPos} activeOrder={activeOrder} />
                                    <RecenterMap position={riderPos} />
                                </MapContainer>
                            </div>

                            <div>
                                <div className={`flex flex-col gap-3 p-4 border-b ${isCod ? 'bg-amber-500/[0.03] border-amber-500/20' : 'bg-emerald-500/[0.03] border-emerald-500/20'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <RiWallet3Fill size={18} className={isCod ? 'text-amber-500' : 'text-emerald-500'} />
                                            <div>
                                                <p className="text-[7px] font-black text-slate-500 uppercase tracking-wider">Billing Instruction</p>
                                                <h3 className={`text-xs font-black uppercase tracking-tight ${isCod ? 'text-amber-400' : 'text-emerald-400'}`}>
                                                    {isCod ? "💸 Cash Collection (COD)" : "💳 Already Paid Online"}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[7px] font-black text-slate-500 uppercase tracking-wider">Order Value</p>
                                            <h2 className="text-xl font-black text-white font-mono">₹{activeOrder.totalAmount || 0}</h2>
                                        </div>
                                    </div>

                                    <div className="bg-white/[0.02] border border-white/5 p-2.5 rounded-xl flex justify-between items-center">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1.5"><FiActivity size={12} className="text-orange-500" /> Your Payout For Delivery</p>
                                        <span className="text-[10px] font-black text-green-400 font-mono bg-green-500/10 px-2 py-0.5 rounded border border-green-500/10">
                                            +₹{activeOrder.deliveryCharge || 40}
                                        </span>
                                    </div>
                                </div>

                                <div className="divide-y divide-white/[0.02] bg-white/[0.01]">
                                    <div className="p-3.5 flex items-center justify-between transition-all">
                                        <div className="flex items-center gap-2.5">
                                            <div className="h-8 w-8 bg-white/[0.02] border border-white/5 flex items-center justify-center text-slate-300 rounded-lg"><FiUser size={14}/></div>
                                            <div>
                                                <p className="text-[7px] font-black text-slate-500 uppercase">Customer Node</p>
                                                <h4 className="text-xs font-black text-white uppercase tracking-tight">{activeOrder.customer?.fullname || "Client Node"}</h4>
                                            </div>
                                        </div>
                                        <a href={`tel:${activeOrder.customer?.mobile}`} className="h-8 w-8 bg-white/[0.03] border border-white/10 text-orange-500 flex items-center justify-center rounded-lg active:scale-95 hover:bg-orange-600 hover:text-white transition-all"><FiPhoneCall size={14}/></a>
                                    </div>

                                    <div className="p-3.5 flex items-center gap-2.5">
                                        <div className="h-8 w-8 bg-white/[0.02] border border-white/5 flex items-center justify-center text-orange-500 rounded-lg"><FiPackage size={14}/></div>
                                        <div>
                                            <p className="text-[7px] font-black text-slate-500 uppercase">Hub Node (Store)</p>
                                            <h4 className="text-xs font-black text-white uppercase tracking-tight leading-none">{activeOrder.shopDetails?.name || "Merchant Shop"}</h4>
                                        </div>
                                    </div>

                                    <div className="p-3.5 flex items-start gap-2.5 bg-white/[0.01]">
                                        <FiMapPin className="text-slate-500 mt-0.5 shrink-0" size={14} />
                                        <div>
                                            <p className="text-[7px] font-black text-slate-500 uppercase tracking-wider">Coordinates Address</p>
                                            <p className="text-[11px] font-medium leading-relaxed text-slate-300">{activeOrder.customerDetails?.address || "No address log"}</p>
                                        </div>
                                    </div>
                                </div>

                                {!showOtpInput ? (
                                    <button onClick={handleStartFinish} disabled={btnLoading} className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3.5 font-black uppercase tracking-wider text-[9px] active:scale-98 transition-all flex items-center justify-center gap-1.5">
                                        {btnLoading ? <FiLoader className="animate-spin text-sm" /> : <>Complete Handover</>}
                                    </button>
                                ) : (
                                    <div className="bg-white/[0.01] border-t border-white/5">
                                        <input type="text" maxLength="4" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="0000" className="w-full bg-transparent py-4 text-center text-3xl font-black tracking-[0.4em] text-orange-500 focus:outline-none outline-none border-b border-orange-600/30 font-mono" />
                                        <button onClick={handleVerifyFinish} disabled={btnLoading} className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 font-black uppercase tracking-wider text-[9px]">
                                            {btnLoading ? "Validating Security Auth..." : "Confirm & Unlock Payout"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        /* 📡 RADAR MODE LAYOUT */
                        <div className="w-full">
                            <div className="bg-white/[0.01] border border-white/5 py-10 text-center relative overflow-hidden w-full rounded-[1.5rem] shadow-xl">
                                <div className="absolute inset-0 bg-orange-500/[0.01] animate-pulse" />
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="relative w-20 h-20 mb-3">
                                        <div className="absolute inset-0 bg-orange-500/5 rounded-full animate-ping" />
                                        <RiMotorbikeFill className="text-3xl text-orange-500 absolute inset-0 m-auto animate-bounce" />
                                    </div>
                                    <h3 className="text-lg font-black text-white uppercase tracking-tight">
                                        {isOnline ? "Radar Scanning" : "System Sleeping"}
                                    </h3>
                                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-[2px] mt-1">
                                        {isOnline ? "Bhagalpur Sector Node Active" : "Go Live To Catch Assignments"}
                                    </p>
                                </div>
                            </div>

                            {/* MISSIONS AVAILABLE SECTOR */}
                            <div className="flex flex-col gap-2.5 mt-3">
                                {isOnline && availableMissions.length > 0 ? (
                                    availableMissions.map((m) => (
                                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={m._id} className="p-4 bg-white/[0.01] border border-white/5 rounded-xl flex justify-between items-center group hover:bg-white/[0.03] transition-all w-full">
                                            <div className="space-y-1 flex-1 pr-3">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-1 h-1 bg-orange-500 rounded-full" />
                                                    <h4 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-orange-500 transition-all">{m.shop?.name}</h4>
                                                </div>
                                                <p className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1 tracking-wide"><FiNavigation size={10}/> {m.order?.delevryAddress?.text?.slice(0, 40) || "Address log missing"}...</p>
                                                <div className="flex gap-2.5 mt-1.5">
                                                    <span className="text-[8px] font-black text-green-400 uppercase bg-green-500/5 px-1.5 py-0.5 border border-green-500/10 rounded">Charge: ₹{m.deliveryCharge || 40}</span>
                                                    <span className="text-[8px] font-black text-slate-400 uppercase bg-white/5 px-1.5 py-0.5 border border-white/5 rounded">Value: ₹{m.order?.totalAmount || 0}</span>
                                                </div>
                                            </div>
                                            <button onClick={() => handleAccept(m._id)} className="h-9 w-9 bg-white/[0.02] border border-white/10 text-white rounded-lg flex items-center justify-center shadow-xl hover:bg-orange-600 hover:border-orange-600 transition-all group-hover:scale-105 shrink-0">
                                                <FiZap size={14} />
                                            </button>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="py-14 text-center bg-white/[0.01] border border-white/5 rounded-[1.5rem]">
                                        <p className="text-[8px] font-black uppercase tracking-[5px] text-slate-600 animate-pulse">
                                            {isOnline ? "Awaiting Broadcast Pulse..." : "Radar Powered Off"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </main>

            {/* NAVIGATION DOCK */}
            <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#020617]/90 backdrop-blur-md border-t border-white/[0.03] flex items-center justify-around z-[5000]">
                <button onClick={() => navigate("/rider/dashboard")} className="flex flex-col items-center gap-0.5 text-orange-500"><FiHome size={18} /><span className="text-[8px] font-black uppercase tracking-wider">Radar</span></button>
                <button onClick={() => navigate("/rider/history")} className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-300 transition-all"><FiPieChart size={18} /><span className="text-[8px] font-black uppercase tracking-wider">Logs</span></button>
                <button onClick={() => navigate("/rider/earnings")} className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-300 transition-all"><FiTrendingUp size={18} /><span className="text-[8px] font-black uppercase tracking-wider">Earn</span></button>
                <button onClick={() => navigate("/rider/profile")} className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-300 transition-all"><FiUser size={18} /><span className="text-[8px] font-black uppercase tracking-wider">Self</span></button>
            </nav>
        </div>
    );
}

export default DelevryBoyDeshboard;