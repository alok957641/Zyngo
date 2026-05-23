import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiDollarSign, FiCheck, FiLoader, FiUser, FiClock } from "react-icons/fi";

const serverurl = "http://localhost:8000";

const AdminPayouts = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🚀 1. Fetch Payout Requests (Backend Ke Route Se Sync Kiya 🔥)
  const fetchRequests = async () => {
    try {
      // Backend payoutRouter.get("/admin/all", ...) se match kiya hai
      const res = await axios.get(`${serverurl}/api/payout/admin/all`, { withCredentials: true });
      if (res.data.success) {
        setRequests(res.data.requests);
      }
    } catch (err) { 
      console.error("Error fetching payouts:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    fetchRequests(); 
  }, []);

  // 🚀 2. Approve Payout (Backend Put URL Ke Hisaab Se Fix 🔥)
  const handleApprove = async (id, upi) => {
    if (!window.confirm(`Bhai, kya tune is UPI (${upi}) par payment kar di hai? Tabhi click karna!`)) return;
    
    try {
      // Backend payoutRouter.put("/admin/approve/:requestId", ...) se exact connect kiya
      const res = await axios.put(`${serverurl}/api/payout/admin/approve/${id}`, {}, { withCredentials: true });
      if (res.data.success) {
        alert("🎉 Payout processed and deducted from user wallet successfully!");
        fetchRequests(); // Live list refresh karo
      }
    } catch (err) { 
      alert(err.response?.data?.message || "Error processing payout"); 
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <FiLoader className="animate-spin text-4xl text-orange-500 mb-4" />
      <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-500">Syncing Settlement Logs...</p>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="mb-10">
        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Settlement Queue</h2>
        <p className="text-orange-500 text-[10px] font-black tracking-[4px] uppercase">Rider & Vendor Cash Out Requests</p>
      </div>

      {/* REQUESTS LIST CONTAINER */}
      <div className="flex flex-col gap-4">
        {requests.map((req) => (
          <div key={req._id} className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/[0.04] transition-all duration-300">
            
            {/* Left Box: User Info */}
            <div className="flex gap-4 items-center">
              <div className={`p-4 rounded-2xl text-xl ${req.status === "pending" ? "bg-yellow-500/10 text-yellow-500 animate-pulse" : "bg-green-500/10 text-green-500"}`}>
                <FiUser />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-white font-black text-lg uppercase tracking-tight italic">{req.user?.fullname || "Unknown User"}</h4>
                  <span className="text-[8px] text-orange-500 px-2 py-0.5 bg-orange-500/10 rounded font-black uppercase tracking-widest">
                    {req.role}
                  </span>
                </div>
                <p className="text-slate-500 text-xs mt-1 font-bold">UPI/Bank Detail: <span className="text-slate-200 font-mono font-black">{req.paymentMethodInfo}</span></p>
              </div>
            </div>

            {/* Right Box: Amount & Actions Button */}
            <div className="text-left md:text-right flex items-center justify-between md:justify-end w-full md:w-auto gap-6 border-t border-white/5 md:border-none pt-4 md:pt-0">
              <div>
                <p className="text-2xl font-black text-white italic tracking-tight">₹{req.amount}</p>
                <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 md:justify-end ${req.status === "pending" ? "text-yellow-500" : "text-green-500"}`}>
                  <FiClock size={10} /> {req.status}
                </span>
              </div>
              
              {/* Approve Trigger Anchor */}
              {req.status === "pending" && (
                <button 
                  onClick={() => handleApprove(req._id, req.paymentMethodInfo)}
                  className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl shadow-lg shadow-green-600/10 active:scale-95 transition-all"
                  title="Approve Payout"
                >
                  <FiCheck size={18} />
                </button>
              )}
            </div>

          </div>
        ))}

        {/* Empty State Screen */}
        {requests.length === 0 && (
          <div className="text-center py-20 bg-white/[0.01] rounded-[2.5rem] border border-dashed border-white/5">
            <FiDollarSign className="mx-auto text-slate-700 mb-4" size={40} />
            <p className="text-slate-500 font-black text-[10px] uppercase tracking-[4px]">No active payout settlement requests found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayouts;