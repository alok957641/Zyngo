import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
    FiArrowLeft, FiDollarSign, FiZap, FiActivity, 
    FiTrendingUp, FiCheckCircle, FiUser, FiX, FiAlertOctagon, FiCreditCard 
} from "react-icons/fi";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const serverurl = "https://zyngo.onrender.com";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const RiderEarnings = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  
  const [stats, setStats] = useState({ earnings: 0, delivered: 0, cash: 0, incentive: 0, graphData: [] });
  const [history, setHistory] = useState([]); 
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [formError, setFormError] = useState("");

  const fetchStatsAndHistory = async () => {
    try {
      const statsRes = await axios.get(`${serverurl}/api/order/rider-stats`, { withCredentials: true });
      if (statsRes.data.success) setStats(statsRes.data.stats);

      const historyRes = await axios.get(`${serverurl}/api/payout/my-requests`, { withCredentials: true });
      if (historyRes.data.success) setHistory(historyRes.data.requests);
    } catch (err) { 
      console.error("Data sync failed:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchStatsAndHistory();
    const interval = setInterval(fetchStatsAndHistory, 8000);
    return () => clearInterval(interval);
  }, []);

  const isWalletLocked = stats.cash > 0;

  const handleAdminSettlementPay = async () => {
     try {
       const resScript = await loadRazorpayScript();
       if (!resScript) {
         alert("Payment gateway failed to load.");
         return;
       }

       const orderRes = await axios.get(`${serverurl}/api/order/rider-pay-debt`, { withCredentials: true });
       if (!orderRes.data.success) {
         alert(orderRes.data.message || "Payment session failed");
         return;
       }

       const { razorpayOrder } = orderRes.data;
       const options = {
         key: "rzp_test_SoP0awKZdS5zFG", 
         amount: razorpayOrder.amount,
         currency: "INR",
         name: "Ai-Buzz Media Net",
         description: "Debt clearance settlement",
         order_id: razorpayOrder.id,
         handler: async function (response) {
           try {
             const verifyRes = await axios.post(`${serverurl}/api/order/verify-rider-debt`, {
               razorpay_order_id: response.razorpay_order_id,
               razorpay_payment_id: response.razorpay_payment_id,
               razorpay_signature: response.razorpay_signature
             }, { withCredentials: true });

             if (verifyRes.data.success) {
               alert("Payment successful. Wallet unlocked.");
               fetchStatsAndHistory(); 
             }
           } catch (err) {
              alert("Verification failed: " + (err.response?.data?.message || err.message));
           }
         },
         prefill: {
           name: userData?.fullname || "Rider",
           email: userData?.email || "rider@aibuzz.media",
           contact: userData?.mobile || ""
         },
         theme: { color: "#f97316" }
       };

       const paymentObject = new window.Razorpay(options);
       paymentObject.open();
     } catch (error) {
       alert("Error: " + error.message);
     }
  };

  const handlePayoutSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const amountNum = Number(withdrawAmount);

    if (isWalletLocked) {
      setFormError("Action blocked! Clear pending dues first.");
      return;
    }
    if (!upiId.trim()) {
      setFormError("UPI ID is required.");
      return;
    }
    if (!withdrawAmount || amountNum <= 0) {
      setFormError("Please enter a valid amount.");
      return;
    }
    if (amountNum > stats.earnings) {
      setFormError(`Insufficient funds! Available balance: ₹${stats.earnings}.`);
      return;
    }

    try {
      const res = await axios.post(
        `${serverurl}/api/payout/request`,
        { amount: amountNum, paymentMethodInfo: upiId },
        { withCredentials: true }
      );
      if (res.data.success) {
        alert("Payout request submitted successfully.");
        setIsModalOpen(false); 
        setUpiId("");
        setWithdrawAmount("");
        fetchStatsAndHistory(); 
      }
    } catch (err) {
      setFormError(err.response?.data?.message || "Transaction failed.");
    }
  };

  if (loading) return (
    <div className="h-screen bg-[#020617] flex items-center justify-center px-4">
        <p className="text-[10px] font-black uppercase tracking-[6px] text-orange-500 animate-pulse font-mono text-center">Syncing Vault...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] font-sans pb-36 text-slate-200">
      <header className="bg-[#090d1f]/40 border-b border-white/[0.02] py-5 px-4 md:px-6 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <button onClick={() => navigate(-1)} className="h-9 w-9 bg-white/[0.02] border border-white/5 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all rounded-xl active:scale-95">
            <FiArrowLeft size={16} />
          </button>
          <div className="text-right">
              <h1 className="text-[9px] font-black uppercase tracking-[3px] text-orange-500">Earnings</h1>
              <p className="text-[9px] font-bold text-slate-500 tracking-wide font-mono">{userData?.fullname || "RIDER"}</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-6 space-y-6">
        <div className={`border p-6 md:p-8 rounded-[2rem] relative overflow-hidden shadow-2xl transition-all duration-300 ${isWalletLocked ? 'bg-red-500/[0.01] border-red-500/10' : 'bg-gradient-to-br from-white/[0.01] to-white/[0.03] border-white/5'}`}>
          <div className="relative z-10 space-y-4">
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[3px] flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isWalletLocked ? 'bg-red-500 animate-ping' : 'bg-green-500 animate-pulse'}`}></span> 
                {isWalletLocked ? "Wallet Frozen" : "Available Balance"}
            </p>
            <h2 className={`text-4xl md:text-7xl font-black tracking-tighter flex items-baseline font-mono ${isWalletLocked ? 'text-red-400 line-through opacity-60' : 'text-white'}`}>
                <span className="text-lg md:text-xl font-bold text-orange-500 mr-2">₹</span>
                {stats.earnings}
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md">
                {!isWalletLocked ? (
                  <button 
                    onClick={() => { setIsModalOpen(true); setFormError(""); }}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[2px] transition-all active:scale-95 shadow-lg"
                  >
                    Request Payout
                  </button>
                ) : (
                  <button 
                    onClick={handleAdminSettlementPay}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[2px] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 animate-bounce"
                  >
                    <FiCreditCard size={14}/> Pay Outstanding Dues
                  </button>
                )}
            </div>
          </div>
        </div>

        <section className="bg-[#05091e]/50 border border-white/[0.03] rounded-[2rem] p-5 md:p-6 shadow-xl">
            <div className="mb-6">
                <p className="text-[9px] font-black uppercase tracking-[3px] text-slate-500 mb-0.5">Performance</p>
                <h3 className="text-base font-black text-white tracking-tight uppercase italic font-mono">Weekly Earnings</h3>
            </div>
            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.graphData || []}>
                        <defs>
                            <linearGradient id="neonGlow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.25}/>
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 4" stroke="rgba(255,255,255,0.02)" vertical={false} />
                        <XAxis dataKey="day" stroke="#475569" fontSize={9} fontWeight="900" axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#090d1f', border: '1px solid #ffffff05' }} />
                        <Area type="monotone" dataKey="amount" stroke="#f97316" fill="url(#neonGlow)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 md:p-6 bg-white/[0.01] border border-white/5 rounded-2xl">
            <FiAlertOctagon className="text-slate-500 text-lg mb-3" />
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-0.5">Cash on Delivery</p>
            <h3 className="text-2xl font-black text-white font-mono">₹{stats.cash}</h3>
          </div>
          <div className="p-5 md:p-6 bg-white/[0.01] border border-white/5 rounded-2xl">
            <FiZap className="text-blue-400 text-lg mb-3" />
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-0.5">Delivered</p>
            <h3 className="text-2xl font-black text-white font-mono">{stats.delivered}</h3>
          </div>
          <div className="p-5 md:p-6 bg-white/[0.01] border border-white/5 rounded-2xl">
            <FiCheckCircle className="text-emerald-500 text-lg mb-3" />
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-0.5">Incentives</p>
            <h3 className="text-2xl font-black text-white font-mono">₹{stats.incentive}</h3>
          </div>
          <div className="p-5 md:p-6 border border-orange-500/10 rounded-2xl">
            <FiTrendingUp className="text-orange-400 text-lg mb-3" />
            <p className="text-[9px] font-black text-orange-400/70 uppercase tracking-wider mb-0.5">Total Revenue</p>
            <h3 className="text-2xl font-black text-orange-400 font-mono">₹{stats.earnings}</h3>
          </div>
        </div>
      </main>

      {/* Settlement History */}
      <section className="max-w-5xl mx-auto px-4 mt-6 mb-20">
         <div className="bg-white/[0.01] border border-white/5 rounded-[2rem] p-5 md:p-6">
            <h3 className="text-[9px] font-black uppercase tracking-[3px] text-slate-500 mb-4">Transaction Logs</h3>
            {history.map(req => (
                <div key={req._id} className="py-4 border-b border-white/5 flex justify-between">
                    <div>
                        <p className="text-xs font-bold text-white">{req.status === 'pending' ? 'Pending' : 'Completed'}</p>
                        <p className="text-[9px] text-slate-500">{new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className="font-bold text-white">₹{req.amount}</p>
                </div>
            ))}
         </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-white/10 w-full max-w-sm rounded-[2rem] p-6 shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-slate-400"><FiX /></button>
            <h3 className="text-lg font-black text-white uppercase italic mb-4">Payout Request</h3>
            <form onSubmit={handlePayoutSubmit} className="flex flex-col gap-4">
              <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="Enter UPI ID" className="w-full bg-slate-800 p-3 rounded-xl text-white outline-none" />
              <input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="Amount" className="w-full bg-slate-800 p-3 rounded-xl text-white outline-none" />
              {formError && <p className="text-red-400 text-[10px] font-bold">{formError}</p>}
              <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderEarnings;