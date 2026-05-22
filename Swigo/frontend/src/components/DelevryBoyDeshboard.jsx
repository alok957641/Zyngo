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
import { setUserData } from "../redux/userSlice";

const serverurl = "https://zyngo.onrender.com";

// --- Custom Icons ---
const riderIcon = new L.Icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png', iconSize: [36, 36], iconAnchor: [18, 36] });
const shopIcon = new L.Icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/610/610365.png', iconSize: [30, 30], iconAnchor: [15, 30] });
const customerIcon = new L.Icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/1277/1277337.png', iconSize: [30, 30], iconAnchor: [15, 30] });

function RecenterMap({ position }) {
    const map = useMap();
    useEffect(() => { if (position) map.flyTo(position, 15, { duration: 1.2 }); }, [position, map]);
    return null;
}

function MapLines({ riderPos, activeOrder }) {
    const shop = activeOrder?.shopDetails;
    const cust = activeOrder?.customerDetails;
    return (
        <>
            {riderPos?.lat && shop?.lat && (
                <Polyline positions={[[riderPos.lat, riderPos.lng], [shop.lat, shop.lon]]} pathOptions={{ color: "#f97316", weight: 4, dashArray: "6, 8" }} />
            )}
            {shop?.lat && cust?.lat && (
                <Polyline positions={[[shop.lat, shop.lon], [cust.lat, cust.lon]]} pathOptions={{ color: "#3b82f6", weight: 4 }} />
            )}
        </>
    );
}

function DelevryBoyDeshboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch(); 
    const { userData } = useSelector((state) => state.user);
    
    const [realStats, setRealStats] = useState({ earnings: 0, delivered: 0, cash: 0 });
    const [availableMissions, setAvailableMissions] = useState([]);
    const [activeOrder, setActiveOrder] = useState(null);
    const [riderPos, setRiderPos] = useState(null);
    const [isOnline, setIsOnline] = useState(true);
    const [otp, setOtp] = useState("");
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [loading, setLoading] = useState({ btn: false, toggle: false });
    const [statusMessage, setStatusMessage] = useState({ text: "", isError: false });

    const triggerMessage = (text, isError = false) => {
        setStatusMessage({ text, isError });
        setTimeout(() => setStatusMessage({ text: "", isError: false }), 4000);
    };

    const fetchEverything = async () => {
        if (!isOnline || !userData) return;
        try {
            const [statsRes, missionRes, activeRes] = await Promise.all([
                axios.get(`${serverurl}/api/order/rider-stats`, { withCredentials: true }),
                axios.get(`${serverurl}/api/order/get-delivery-assignments`, { withCredentials: true }),
                axios.get(`${serverurl}/api/order/get-current-order`, { withCredentials: true })
            ]);
            if (statsRes.data.success) setRealStats(statsRes.data.stats);
            const rawMissions = missionRes.data || [];
            const uniqueMap = {};
            rawMissions.forEach(m => { const id = m.order?._id || m.order; if(id) uniqueMap[id] = m; });
            setAvailableMissions(Object.values(uniqueMap));
            setActiveOrder(activeRes.data?.success ? activeRes.data : null);
        } catch (err) { console.error("Sync error"); }
    };

    useEffect(() => {
        if (!userData) return;
        setIsOnline(userData.isOnline !== false);
        let watchId;
        if (isOnline) {
            watchId = navigator.geolocation.watchPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setRiderPos({ lat: latitude, lng: longitude });
                    axios.post(`${serverurl}/api/user/update-location`, { latitude, longitude }, { withCredentials: true });
                },
                (err) => console.error("GPS Error", err),
                { enableHighAccuracy: true }
            );
            fetchEverything();
        }
        const poll = setInterval(() => { if (isOnline) fetchEverything(); }, 5000);
        return () => { clearInterval(poll); if (watchId) navigator.geolocation.clearWatch(watchId); };
    }, [isOnline, userData]);

    const handleLogout = async () => {
        try { await axios.get(`${serverurl}/api/auth/signout`, { withCredentials: true }); } 
        catch (err) { console.error("Signout failed"); } 
        finally {
            dispatch(setUserData(null));
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = "/signin";
        }
    };

    const handleAccept = async (id) => {
        setLoading(p => ({ ...p, btn: true }));
        try {
            const res = await axios.post(`${serverurl}/api/order/accept-order/${id}`, {}, { withCredentials: true });
            if (res.data.success) {
                triggerMessage("Mission assigned successfully.");
                fetchEverything();
            }
        } catch (e) { triggerMessage("Order already taken by another node.", true); }
        finally { setLoading(p => ({ ...p, btn: false })); }
    };

    return (
        <div className="min-h-screen bg-[#020617] font-sans pb-32 text-slate-200">
            {/* Header */}
            <header className="bg-[#090d1f]/60 border-b border-white/[0.03] pt-12 pb-4 px-6 backdrop-blur-md sticky top-0 z-40">
                <div className="flex justify-between items-center max-w-5xl mx-auto">
                    <div>
                        <p className="text-[8px] font-black text-orange-500 uppercase tracking-[2px]">Rider Node</p>
                        <h2 className="text-sm font-black text-white uppercase">{userData?.fullname || "R-NODE"}</h2>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleLogout} className="h-8 w-8 flex items-center justify-center bg-white/[0.03] rounded-lg hover:text-red-500"><FiLogOut size={14}/></button>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 mt-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl">
                        <p className="text-[8px] uppercase text-slate-500 font-bold">Earnings</p>
                        <h3 className="text-xl font-black text-orange-500">₹{realStats.earnings}</h3>
                    </div>
                    <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl">
                        <p className="text-[8px] uppercase text-slate-500 font-bold">Delivered</p>
                        <h3 className="text-xl font-black text-blue-400">{realStats.delivered}</h3>
                    </div>
                </div>

                {/* Radar Content */}
                <AnimatePresence mode="wait">
                    {activeOrder ? (
                        /* Active Order Logic */
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/[0.01] border border-white/5 rounded-3xl p-6">
                            <h3 className="text-xs font-black text-white uppercase mb-4">Current Active Mission</h3>
                            {/* ...Map Logic here... */}
                        </motion.div>
                    ) : (
                        /* Available Missions */
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Available Missions</h3>
                            {availableMissions.map(m => (
                                <motion.div key={m._id} className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex justify-between items-center">
                                    <div>
                                        <h4 className="font-bold text-white">{m.shop?.name}</h4>
                                        <p className="text-[10px] text-slate-500">{m.order?.delevryAddress?.text?.slice(0, 30)}</p>
                                    </div>
                                    <button onClick={() => handleAccept(m._id)} className="bg-orange-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase">Accept</button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </main>

            {/* Dock */}
            <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#020617]/90 backdrop-blur-md border-t border-white/[0.05] flex items-center justify-around z-50">
                <button onClick={() => navigate("/rider/dashboard")} className="text-orange-500 flex flex-col items-center"><FiHome size={18}/><span className="text-[8px] font-black uppercase">Radar</span></button>
                <button onClick={() => navigate("/rider/history")} className="text-slate-500 flex flex-col items-center"><FiPieChart size={18}/><span className="text-[8px] font-black uppercase">Logs</span></button>
            </nav>
        </div>
    );
}

export default DelevryBoyDeshboard;