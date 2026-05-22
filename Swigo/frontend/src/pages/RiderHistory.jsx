import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiPackage, FiCalendar, FiArrowLeft } from "react-icons/fi"; 
import { useNavigate } from "react-router-dom"; 

const RiderHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchHistory = async () => {
            try {
               
                const res = await axios.get("/api/order/rider-history", { withCredentials: true });
                setHistory(res.data);
            } catch (err) {
                console.error("History fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 p-6 font-sans">
            {/* 🔝 FIXED: Back Button added */}
            <div className="flex items-center gap-4 mb-6">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-3 bg-white rounded-full shadow-sm border border-slate-200 hover:bg-orange-50 transition-all"
                >
                    <FiArrowLeft size={20} className="text-slate-700" />
                </button>
                <h1 className="text-2xl font-black uppercase italic">Mission Logs</h1>
            </div>

            {loading ? (
                <div className="text-center mt-20 text-slate-400 font-bold">Loading logs...</div>
            ) : history.length === 0 ? (
                <div className="text-center mt-20 text-slate-400 font-bold">No missions completed yet!</div>
            ) : (
                <div className="space-y-4">
                    {history.map((item) => (
                        <div key={item._id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
                                        <FiPackage />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-800 uppercase">
                                            {item.shopOrders?.[0]?.shop?.name || "Restaurant"}
                                        </h4>
                                        <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                                            <FiCalendar /> {new Date(item.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[9px] font-black uppercase border border-green-100">
                                    Delivered
                                </span>
                            </div>
                            <div className="border-t border-dashed pt-3 mt-3 flex justify-between items-center">
                                <p className="text-xs font-bold text-slate-400 uppercase">Bill Amount</p>
                                <p className="font-black text-slate-800 tracking-tighter">₹{item.totalAmount}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RiderHistory;