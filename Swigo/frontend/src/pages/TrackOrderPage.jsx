import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; 
import { FiLoader } from "react-icons/fi"; 
import { motion } from 'framer-motion';
import { ChevronLeft, Phone, ShieldCheck, MapPin, Package, Banknote, CreditCard, Navigation, Store } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// ✅ Server URL (Production)
const serverurl = "https://zyngo.onrender.com";

const shopIcon = new L.Icon({ 
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png',
    iconSize: [40, 40], iconAnchor: [20, 40]
});
const homeIcon = new L.Icon({ 
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1239/1239525.png',
    iconSize: [35, 35], iconAnchor: [17, 35]
});
const scooterIcon = new L.Icon({ 
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
    iconSize: [45, 45], iconAnchor: [22, 45]
});

// 🛰️ Map Updater Component
function MapUpdater({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center && center[0] && center[1]) {
            map.flyTo(center, map.getZoom(), { duration: 1 });
        }
    }, [center, map]);
    return null;
}

const TrackOrderPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [currentOrder, setCurrentOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeShopIndex, setActiveShopIndex] = useState(0);
    const [error, setError] = useState(null);

    // 🔄 Fetch Logic
    const fetchOrder = async (isInitial = false) => {
        // ✅ Check if orderId exists
        if (!orderId) {
            setError("No order ID provided");
            if(isInitial) setLoading(false);
            return;
        }

        try {
            const { data } = await axios.get(`${serverurl}/api/order/get-order-by-id/${orderId}`, { 
                withCredentials: true 
            });
            const orderData = data.order || data;
            if (orderData) {
                setCurrentOrder(orderData);
                setError(null);
            }
            if(isInitial) setLoading(false);
        } catch (err) {
            console.error("Fetch Order Error:", err);
            if (err.response?.status === 404) {
                setError("Order not found");
            } else {
                setError("Failed to fetch order details");
            }
            if(isInitial) setLoading(false);
        }
    };

    // 🔥 Polling with cleanup
    useEffect(() => {
        if (!orderId) return;

        let pollInterval;
        let isMounted = true;

        const startPolling = async () => {
            await fetchOrder(true);
            if (isMounted) {
                pollInterval = setInterval(() => {
                    if (isMounted) fetchOrder(false);
                }, 3000);
            }
        };

        startPolling();

        return () => {
            isMounted = false;
            if (pollInterval) clearInterval(pollInterval);
        };
    }, [orderId]);

    // Loading State
    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-white">
                <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mb-4" 
                />
                <p className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 italic">Live Syncing Location...</p>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-white p-6">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="text-red-500" size={32} />
                </div>
                <h2 className="text-xl font-black text-gray-800 text-center">{error}</h2>
                <p className="text-sm text-gray-500 text-center mt-2">Order ID: {orderId?.slice(-6).toUpperCase()}</p>
                <button 
                    onClick={() => navigate(-1)}
                    className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-xl font-black text-xs"
                >
                    Go Back
                </button>
            </div>
        );
    }

    if (!currentOrder) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-white">
                <p className="text-gray-500">No order data available</p>
                <button onClick={() => navigate(-1)} className="mt-4 text-orange-500">Go Back</button>
            </div>
        );
    }

    const activeShopOrder = currentOrder?.shopOrders?.[activeShopIndex];
    const deliveryBoy = activeShopOrder?.assignedDeliveryBoy;
    const dbName = deliveryBoy?.fullname || deliveryBoy?.name || "Rider";

    const userPos = [currentOrder?.delevryAddress?.latitude || 0, currentOrder?.delevryAddress?.longitude || 0];
    const shopPos = activeShopOrder?.shop?.location?.coordinates 
        ? [activeShopOrder.shop.location.coordinates[1], activeShopOrder.shop.location.coordinates[0]] 
        : null;
    
    const dboyPos = deliveryBoy?.location?.coordinates 
        ? [deliveryBoy.location.coordinates[1], deliveryBoy.location.coordinates[0]] 
        : (shopPos || userPos);

    return (
        <div className="flex flex-col h-screen bg-white overflow-hidden font-sans">
            <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-[2000] shadow-sm">
                <div className="flex items-center gap-3">
                    <motion.button 
                        whileTap={{ scale: 0.8 }} 
                        onClick={() => navigate(-1)} 
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-800"
                    >
                        <ChevronLeft size={24} />
                    </motion.button>
                    <div>
                        <h1 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">Live Delivery Tracker</h1>
                        <p className="text-xs font-bold text-gray-900 leading-none">ID: {orderId?.slice(-6).toUpperCase()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                    <span className="text-[9px] font-black text-green-700 uppercase tracking-widest">Active</span>
                </div>
            </header>

            <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
                <div className="w-full h-[40vh] md:h-full md:flex-1 relative order-1 md:order-2 bg-gray-100">
                    <MapContainer 
                        center={dboyPos} 
                        zoom={15} 
                        style={{ height: '100%', width: '100%', zIndex: 1 }} 
                        zoomControl={false}
                    >
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                        {shopPos && (
                            <Marker position={shopPos} icon={shopIcon}>
                                <Popup><b className="text-xs font-bold">{activeShopOrder?.shop?.name}</b></Popup>
                            </Marker>
                        )}
                        <Marker position={userPos} icon={homeIcon}>
                            <Popup><b>Your Delivery Location</b></Popup>
                        </Marker>
                        <Marker position={dboyPos} icon={scooterIcon}>
                            <Popup><span className="font-bold">{dbName} is on the way!</span></Popup>
                        </Marker>
                        <Polyline 
                            positions={shopPos ? [shopPos, dboyPos, userPos] : [dboyPos, userPos]} 
                            color="#f97316" 
                            weight={3} 
                            dashArray="5, 10" 
                            opacity={0.6} 
                        />
                        <MapUpdater center={dboyPos} />
                    </MapContainer>
                </div>

                <aside className="w-full md:w-[380px] h-[60vh] md:h-full bg-white order-2 md:order-1 z-50 shadow-[0_-15px_30px_rgba(0,0,0,0.1)] overflow-y-auto border-t md:border-t-0 md:border-r border-gray-100">
                    <div className="p-6 space-y-6">
                        {/* Shop Tabs */}
                        {currentOrder?.shopOrders?.length > 1 && (
                            <div className="space-y-3">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Items from different shops</p>
                                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                    {currentOrder?.shopOrders?.map((so, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => setActiveShopIndex(idx)}
                                            className={`flex-shrink-0 px-4 py-3 rounded-2xl border-2 transition-all flex items-center gap-2 ${
                                                activeShopIndex === idx 
                                                    ? 'border-orange-500 bg-orange-50 text-orange-600 shadow-md shadow-orange-100' 
                                                    : 'border-gray-100 text-gray-400 bg-white'
                                            }`}
                                        >
                                            <Store size={14} />
                                            <span className="text-[10px] font-black uppercase whitespace-nowrap">{so.shop?.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Payment Card */}
                        <div className={`p-5 rounded-3xl border-2 flex items-center justify-between shadow-sm ${
                            currentOrder?.paymentMethod === 'cod' 
                                ? 'bg-orange-50 border-orange-200' 
                                : 'bg-green-50 border-green-200'
                        }`}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2.5 rounded-2xl ${
                                    currentOrder?.paymentMethod === 'cod' 
                                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' 
                                        : 'bg-green-600 text-white shadow-lg shadow-green-100'
                                }`}>
                                    {currentOrder?.paymentMethod === 'cod' ? <Banknote size={24}/> : <CreditCard size={24}/>}
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Bill Amount</p>
                                    <h3 className={`text-sm font-black uppercase tracking-tight ${
                                        currentOrder?.paymentMethod === 'cod' ? 'text-orange-600' : 'text-green-700'
                                    }`}>
                                        {currentOrder?.paymentMethod === 'cod' ? 'Pay Cash' : 'Paid Online'}
                                    </h3>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-black text-gray-900 tracking-tighter">₹{activeShopOrder?.subtotal || 0}</p>
                            </div>
                        </div>

                        {/* Shop Details */}
                        <div className="flex items-center gap-4 border-b border-gray-50 pb-5">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-inner">
                                <Package size={22} className="text-gray-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-gray-900 tracking-tighter uppercase leading-none">{activeShopOrder?.shop?.name}</h2>
                                <p className="text-[10px] text-orange-500 font-black uppercase mt-1 tracking-[2px] italic animate-pulse">{activeShopOrder?.status}</p>
                            </div>
                        </div>

                        {/* Delivery Boy Card */}
                        {deliveryBoy ? (
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-slate-900 p-5 rounded-[2.5rem] text-white shadow-xl shadow-slate-200">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-orange-500/30">
                                        {dbName[0]}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-black tracking-tight leading-none mb-1">{dbName}</h4>
                                        <p className="text-[9px] text-green-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                            <ShieldCheck size={12} /> Verified Rider
                                        </p>
                                    </div>
                                </div>
                                <a href={`tel:${deliveryBoy.mobile}`} className="w-full bg-white text-slate-900 py-4 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-md">
                                    <Phone size={16} className="text-orange-500" /> Call Now
                                </a>
                            </motion.div>
                        ) : (
                            <div className="p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-center">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                                    <FiLoader className="animate-spin text-orange-500" />
                                </div>
                                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Assigning Nearby Partner...</p>
                            </div>
                        )}

                        {/* Address */}
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <MapPin size={18} className="text-orange-600 mt-1 shrink-0" />
                            <div>
                                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Your Address</p>
                                <p className="text-[11px] text-gray-700 font-bold italic line-clamp-2 leading-relaxed">
                                    {currentOrder?.delevryAddress?.text}
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default TrackOrderPage;