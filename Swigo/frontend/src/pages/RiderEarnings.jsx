import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
    FiArrowLeft, FiDollarSign, FiZap, FiActivity, 
    FiTrendingUp, FiCheckCircle, FiUser, FiX, FiAlertOctagon, FiCreditCard
} from "react-icons/fi";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const serverurl = "http://localhost:8000";

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
  
  const [stats, setStats] = useState({ 
    earnings: 0, delivered: 0, cash: 0, incentive: 0, graphData: [] 
  });
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
      console.error("Sync Error with Core Node"); 
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
         alert("Razorpay SDK failed to load. Check your network!");
         return;
       }

       const orderRes = await axios.get(`${serverurl}/api/order/rider-pay-debt`, { withCredentials: true });
       if (!orderRes.data.success) {
         alert(orderRes.data.message || "Order token failure");
         return;
       }

       const { razorpayOrder } = orderRes.data;

       const options = {
         key: "rzp_test_SoP0awKZdS5zFG", // 🚨 CHIEF WARNING: APNI ASLI RAZORPAY KEY_ID YAHA DALO BHAI!
         amount: razorpayOrder.amount,
         currency: "INR",
         name: "Ai-Buzz Media Net",
         description: "Rider collected COD cash clearance settlement",
         order_id: razorpayOrder.id,
         handler: async function (response) {
           try {
             const verifyRes = await axios.post(`${serverurl}/api/order/verify-rider-debt`, {
               razorpay_order_id: response.razorpay_order_id,
               razorpay_payment_id: response.razorpay_payment_id,
               razorpay_signature: response.razorpay_signature
             }, { withCredentials: true });

             if (verifyRes.data.success) {
               alert("🎉 Payment Success! Debt Cleared and Payout Unlocked.");
               fetchStatsAndHistory(); 
             }
           } catch (err) {
              alert("Verification fail: " + (err.response?.data?.message || err.message));
           }
         },
         prefill: {
           name: userData?.fullname || "Rider Node",
           email: userData?.email || "rider@aibuzz.media",
           contact: userData?.mobile || ""
         },
         theme: { color: "#f97316" }
       };

       const paymentObject = new window.Razorpay(options);
       paymentObject.open();

     } catch (error) {
       alert("Gateway Error: " + error.message);
     }
  };

  const handlePayoutSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const amountNum = Number(withdrawAmount);

    if (isWalletLocked) {
      setFormError("Bhai action blocked! Pehle admin ka cash clear karo.");
      return;
    }
    if (!upiId.trim()) {
      setFormError("Bhai UPI ID daalna zaroori hai!");
      return;
    }
    if (!withdrawAmount || amountNum <= 0) {
      setFormError("Bhai sahi amount daalo!");
      return;
    }
    if (amountNum > stats.earnings) {
      setFormError(`Bhai limit se zyada daal rahe ho! Available Balance sirf ₹${stats.earnings} hai.`);
      return;
    }

    try {
      const res = await axios.post(
        `${serverurl}/api/payout/request`,
        { amount: amountNum, paymentMethodInfo: upiId },
        { withCredentials: true }
      );
      if (res.data.success) {
        alert("🎉 Request Admin ko bhej di gayi hai!");
        setIsModalOpen(false); 
        setUpiId("");
        setWithdrawAmount("");
        fetchStatsAndHistory(); 
      }
    } catch (err) {
      setFormError(err.response?.data?.message || "Deduction validation fail!");
    }
  };

  if (loading) return (
    <div className="h-screen bg-[#020617] flex items-center justify-center px-4">
        <p className="text-[10px] font-black uppercase tracking-[6px] text-orange-500 animate-pulse font-mono text-center">Syncing Vault.Node...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] font-sans pb-36 text-slate-200 relative overflow-x-hidden selection:bg-orange-500/20">
      
      <header className="bg-[#090d1f]/40 border-b border-white/[0.02] py-5 px-4 md:px-6 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
          <button onClick={() => navigate(-1)} className="h-9 w-9 bg-white/[0.02] border border-white/5 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all rounded-xl active:scale-95">
            <FiArrowLeft size={16} />
          </button>
          <div className="text-right">
             <h1 className="text-[9px] font-black uppercase tracking-[3px] text-orange-500">Vault System</h1>
             <p className="text-[9px] font-bold text-slate-500 tracking-wide mt-0.5 font-mono">{userData?.fullname || "RIDER_NODE"}</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-6 space-y-6">
        
        {/* BANNER SYSTEM */}
        <div className={`border p-6 md:p-8 rounded-[2rem] relative overflow-hidden shadow-2xl transition-all duration-300 ${isWalletLocked ? 'bg-red-500/[0.01] border-red-500/10' : 'bg-gradient-to-br from-white/[0.01] to-white/[0.03] border-white/5'}`}>
          <div className="relative z-10 space-y-4">
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[3px] flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isWalletLocked ? 'bg-red-500 animate-ping' : 'bg-green-500 animate-pulse'}`}></span> 
                {isWalletLocked ? "Wallet Frozen (Security Lock Out)" : "Bacha Paisa (Available Balance)"}
            </p>
            <h2 className={`text-4xl md:text-7xl font-black tracking-tighter flex items-baseline font-mono ${isWalletLocked ? 'text-red-400 line-through opacity-60' : 'text-white'}`}>
                <span className="text-lg md:text-xl font-bold text-orange-500 mr-2">₹</span>
                {stats.earnings}
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md">
                {!isWalletLocked ? (
                  <button 
                    onClick={() => { setIsModalOpen(true); setFormError(""); }}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[2px] transition-all active:scale-95 shadow-lg shadow-orange-600/10"
                  >
                    Request Cash Out
                  </button>
                ) : (
                  <button 
                    onClick={handleAdminSettlementPay}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[2px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/10 active:scale-95 animate-bounce"
                  >
                    <FiCreditCard size={14}/> Pay Debt To Admin Live
                  </button>
                )}
            </div>
          </div>
          <FiDollarSign className="absolute -bottom-10 -right-10 text-[150px] md:text-[220px] text-white/[0.01] pointer-events-none" />
        </div>

        {/* 📊 FIXED RESPONSIVE NEON GRAPH */}
        <section className="bg-[#05091e]/50 border border-white/[0.03] rounded-[2rem] p-5 md:p-6 min-w-0 overflow-hidden shadow-xl">
            <div className="mb-6">
                <p className="text-[9px] font-black uppercase tracking-[3px] text-slate-500 mb-0.5">Velocity Matrix</p>
                <h3 className="text-base font-black text-white tracking-tight uppercase italic font-mono">Weekly Cycles</h3>
            </div>
            
            {/* Height limits strictly added to prevent recharts breakdown warnings */}
            <div className="h-[200px] min-h-[200px] w-full relative">
                <ResponsiveContainer width="100%" height="200">
                    <AreaChart data={stats.graphData || []} margin={{ top: 10, right: 5, left: -32, bottom: 0 }}>
                        <defs>
                            <linearGradient id="neonGlow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.25}/>
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0.005}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 4" stroke="rgba(255,255,255,0.02)" vertical={false} />
                        <XAxis dataKey="day" stroke="#475569" fontSize={9} fontWeight="900" axisLine={false} tickLine={false} dy={10} className="font-mono" />
                        <YAxis hide domain={[0, 'auto']} />
                        <Tooltip contentStyle={{ backgroundColor: '#090d1f', border: '1px solid #ffffff05', borderRadius: '12px' }} itemStyle={{ color: '#f97316', fontWeight: '800' }} />
                        <Area 
                          type="monotone" 
                          dataKey="amount" 
                          stroke="#f97316" 
                          strokeWidth={2.5} 
                          fillOpacity={1} 
                          fill="url(#neonGlow)"
                          dot={{ stroke: '#f97316', strokeWidth: 2, r: 3, fill: '#020617' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </section>

        {/* DATA CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-5 md:p-6 border rounded-2xl transition-all duration-300 ${isWalletLocked ? 'bg-red-500/5 border-red-500/20' : 'bg-white/[0.01] border-white/5'}`}>
            <FiAlertOctagon className={`text-lg mb-3 ${isWalletLocked ? 'text-red-400 animate-bounce' : 'text-slate-500'}`} />
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-0.5">Company Cash (COD)</p>
            <h3 className={`text-2xl font-black tracking-tight font-mono ${isWalletLocked ? 'text-red-400' : 'text-white'}`}>₹{stats.cash}</h3>
          </div>
          
          <div className="p-5 md:p-6 bg-white/[0.01] border border-white/5 rounded-2xl">
            <FiZap className="text-blue-400 text-lg mb-3" />
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-0.5">Delivered</p>
            <h3 className="text-2xl font-black text-white tracking-tight font-mono">{stats.delivered} <span className="text-[10px] text-slate-600 font-bold">PKTS</span></h3>
          </div>

          <div className="p-5 md:p-6 bg-white/[0.01] border border-white/5 rounded-2xl">
            <FiCheckCircle className="text-emerald-500 text-lg mb-3" />
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-0.5">Incentive</p>
            <h3 className="text-2xl font-black text-white tracking-tight font-mono">+₹{stats.incentive}</h3>
          </div>

          <div className="p-5 md:p-6 bg-gradient-to-br from-orange-500/[0.02] to-transparent border border-orange-500/10 rounded-2xl">
            <FiTrendingUp className="text-orange-400 text-lg mb-3" />
            <p className="text-[9px] font-black text-orange-500/70 uppercase tracking-wider mb-0.5">Total Profit (Lifetime)</p>
            <h3 className="text-2xl font-black text-orange-400 tracking-tight font-mono">
              ₹{(stats.graphData?.reduce((s, d) => s + (d.amount || 0), 0) || 0) + stats.incentive}
            </h3>
          </div>
        </div>

        {/* HISTORY */}
        <div className="bg-white/[0.01] border border-white/5 rounded-[2rem] p-5 md:p-6 overflow-hidden">
            <h3 className="text-[9px] font-black uppercase tracking-[3px] text-slate-500 mb-4">Settlement History</h3>
            <div className="divide-y divide-white/[0.02] overflow-x-auto">
                {history.map((item) => (
                    <div key={item._id} className="py-4 flex items-center justify-between hover:bg-white/[0.01] px-2 rounded-xl transition-all min-w-[300px]">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 border border-white/5 flex flex-col items-center justify-center bg-white/[0.02] rounded-xl shrink-0 font-mono">
                                <span className="text-[8px] font-black text-slate-500 uppercase">{new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short' })}</span>
                                <span className="text-sm font-black text-slate-300 -mt-0.5">{new Date(item.createdAt).toLocaleDateString('en-US', { day: '2-digit' })}</span>
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs md:text-sm font-black text-white uppercase tracking-wide truncate">{item.status === 'pending' ? 'Processing Cashout' : 'Payout Disbursed'}</p>
                                <p className={`text-[8px] font-black uppercase tracking-wider flex items-center gap-1 mt-0.5 ${item.status === 'pending' ? 'text-yellow-500' : 'text-green-500'}`}>
                                    <FiCheckCircle size={10} /> {item.status === 'pending' ? 'Awaiting Admin' : 'Finalized'}
                                </p>
                            </div>
                        </div>
                        <div className="text-right shrink-0 font-mono">
                            <p className="text-sm md:text-base font-black text-white">₹{item.amount}</p>
                            <span className="text-[8px] text-slate-600 block uppercase max-w-[90px] truncate">{item.paymentMethodInfo}</span>
                        </div>
                    </div>
                ))}
                {history.length === 0 && (
                  <p className="text-slate-600 font-mono text-[10px] uppercase text-center py-8 tracking-wider">No transactional logs captured yet.</p>
                )}
            </div>
        </div>

      </main>

      {/* POPUP CASHOUT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0f172a] border border-white/10 w-full max-w-md rounded-[2rem] p-5 md:p-6 relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-lg bg-white/5 border border-white/5"><FiX size={16} /></button>
            <div className="mb-6">
              <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Secure Cashout</h3>
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-0.5">Transfer request to Node</p>
            </div>
            <form onSubmit={handlePayoutSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-slate-400 text-[9px] font-black uppercase tracking-wider block mb-1.5">UPI ID / Bank Detail</label>
                <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="e.g., alok@ybl" className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-all font-medium" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-slate-400 text-[9px] font-black uppercase tracking-wider">Amount (₹)</label>
                  <span className="text-[9px] font-black text-orange-500 tracking-wider uppercase font-mono">Max: ₹{stats.earnings}</span>
                </div>
                <input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder={`Max ₹${stats.earnings}`} className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-all font-mono font-bold" />
              </div>
              {formError && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-[10px] font-bold uppercase tracking-wide">⚠️ {formError}</div>}
              <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[3px] transition-all mt-2">Submit Request</button>
            </form>
          </div>
        </div>
      )}

      {/* DOCK BAR */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-[#020617]/90 backdrop-blur-lg border-t border-white/[0.03] flex items-center justify-around z-50 px-2">
        <button onClick={() => navigate("/rider/dashboard")} className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300 transition-all"><FiTrendingUp size={20} /><span className="text-[8px] font-black uppercase tracking-wider">Radar</span></button>
        <button onClick={() => navigate("/rider/history")} className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300 transition-all"><FiActivity size={20} /><span className="text-[8px] font-black uppercase tracking-wider">Logs</span></button>
        <button onClick={() => navigate("/rider/earnings")} className="flex flex-col items-center gap-1 text-orange-500"><FiDollarSign size={20} /><span className="text-[8px] font-black uppercase tracking-wider">Vault</span></button>
        <button onClick={() => navigate("/rider/profile")} className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300 transition-all"><FiUser size={20} /><span className="text-[8px] font-black uppercase tracking-wider">Node</span></button>
      </nav>
    </div>
  );
};

export default RiderEarnings;