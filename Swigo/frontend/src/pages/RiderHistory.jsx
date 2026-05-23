import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiPackage, FiCalendar, FiCheckCircle } from "react-icons/fi";

const RiderHistory = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            const res = await axios.get("http://localhost:8000/api/order/rider-history", { withCredentials: true });
            setHistory(res.data);
        };
        fetchHistory();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 p-6 font-sans">
            <h1 className="text-2xl font-black uppercase italic italic mb-6">Mission Logs</h1>
            <div className="space-y-4">
                {history.map((item) => (
                    <div key={item._id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
                                    <FiPackage />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-slate-800 uppercase">{item.shopOrders[0]?.shop?.name}</h4>
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
        </div>
    );
};

export default RiderHistory;