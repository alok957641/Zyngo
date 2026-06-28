import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { serverurl } from "../config/api.js";
import {
  FiArrowLeft,
  FiClock,
  FiCheckCircle,
  FiSend,
  FiAlertCircle,
  FiCreditCard,
} from "react-icons/fi";
const OwnerEarnings = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  // States for Real Data
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [requests, setRequests] = useState([]);

  // 📡 REAL DATA SYNC ENGINE
  const fetchWalletData = async () => {
    try {
      setFetching(true);

      // 1. Fetch REAL Balance & Total Revenue
      // Ye API banani hogi tujhe: /api/order/owner-wallet
      const walletRes = await axios.get(
        `${serverurl}/api/payout/owner-wallet`,
        { withCredentials: true },
      );

      if (walletRes.data.success) {
        // Maan le backend 'netBalance' bhej raha hai
        setBalance(walletRes.data.netBalance || 0);
      }

      // 2. Fetch REAL Transfer Logs
      // Ye API tere paas already payoutRoute mein honi chahiye owner ki
      const historyRes = await axios.get(
        `${serverurl}/api/payout/my-requests`,
        { withCredentials: true },
      );

      if (historyRes.data.success) {
        setRequests(historyRes.data.requests || []);
      }
    } catch (err) {
      console.error("Wallet Sync Error:", err);
      alert("Live data sync fail ho gaya bhai!");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  // 💸 PAYOUT REQUEST LOGIC (REAL)
  const handleRequestPayout = async (e) => {
    e.preventDefault();
    const numAmount = Number(amount);

    if (!numAmount || !upiId)
      return alert("Bhai, Amount aur UPI ID dono zaroori hain!");
    if (numAmount > balance)
      return alert(`Aukaat se bahar! Tere paas sirf ₹${balance} bache hain.`);
    if (numAmount < 500) return alert("Minimum withdrawal ₹500 hai.");

    try {
      setLoading(true);
      const res = await axios.post(
        `${serverurl}/api/payout/request`,
        {
          amount: numAmount,
          paymentMethodInfo: upiId,
        },
        { withCredentials: true },
      );

      if (res.data.success) {
        alert("🎉 Request Success! Admin verify karega.");
        setAmount("");
        setUpiId("");

        // Immediately balance kam kar de screen par (Optimistic UI update)
        setBalance((prev) => prev - numAmount);
        fetchWalletData(); // Fir fresh data le aa
      }
    } catch (err) {
      alert(err.response?.data?.message || "Transfer initiate nahi hua!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans text-slate-200">
      <div className="max-w-md mx-auto px-5 py-6">
        {/* 🔝 CLEAN HEADER */}
        <header className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="h-9 w-9 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-300 hover:bg-slate-700 transition-all"
          >
            <FiArrowLeft size={16} />
          </button>
          <div className="text-center">
            <h1 className="text-sm font-bold text-white tracking-wide">
              Wallet
            </h1>
            <p className="text-[10px] text-slate-400">
              {userData?.fullname || "Merchant Account"}
            </p>
          </div>
          <div className="h-9 w-9"></div>
        </header>

        {/* 💰 COMPACT BALANCE CARD (REAL TIME) */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 mb-8 shadow-lg relative overflow-hidden"
        >
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium mb-1">
                Live Balance
              </p>
              {fetching ? (
                <div className="h-9 w-24 bg-slate-700 animate-pulse rounded mt-1"></div>
              ) : (
                <h2 className="text-3xl font-bold text-white">
                  <span className="text-xl text-orange-500 mr-1">₹</span>
                  {balance.toFixed(2)}
                </h2>
              )}
            </div>
            <div className="h-12 w-12 bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/20">
              <FiCreditCard className="text-orange-500" size={20} />
            </div>
          </div>
        </motion.div>

        {/* 📝 MINIMAL WITHDRAWAL FORM */}
        <section className="mb-10">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">
            Withdraw Funds
          </h3>

          <form
            onSubmit={handleRequestPayout}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm"
          >
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 ml-1">
                Amount (Max ₹{balance})
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  max={balance}
                  disabled={balance < 500}
                  className="w-full bg-slate-800 border border-slate-700 text-white pl-8 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-slate-600 disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 ml-1">
                UPI ID / Bank Account
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="Enter UPI ID"
                disabled={balance < 500}
                className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-slate-600 disabled:opacity-50"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={loading || balance < 500}
              type="submit"
              className="w-full bg-orange-600 text-white py-3.5 rounded-xl font-bold text-xs hover:bg-orange-500 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:bg-slate-700 disabled:text-slate-500"
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  <FiSend size={14} /> Send Request
                </>
              )}
            </motion.button>

            {balance < 500 && (
              <p className="text-[9px] text-center text-red-400 mt-2">
                Minimum ₹500 required to withdraw.
              </p>
            )}
          </form>
        </section>

        {/* 📜 REAL HISTORY LIST */}
        <section>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">
            Recent Transactions
          </h3>

          <div className="space-y-3">
            {fetching ? (
              <div className="text-center py-10 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse">
                <p className="text-xs text-slate-500 font-medium">
                  Fetching history...
                </p>
              </div>
            ) : requests.length > 0 ? (
              requests.map((req) => (
                <div
                  key={req._id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center border ${req.status === "completed" ? "bg-green-500/10 border-green-500/20 text-green-500" : req.status === "rejected" ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-orange-500/10 border-orange-500/20 text-orange-500"}`}
                    >
                      {req.status === "completed" ? (
                        <FiCheckCircle size={16} />
                      ) : req.status === "rejected" ? (
                        <FiAlertCircle size={16} />
                      ) : (
                        <FiClock size={16} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white mb-0.5">
                        ₹{req.amount}
                      </p>
                      <p
                        className={`text-[10px] font-semibold capitalize ${req.status === "completed" ? "text-green-500" : req.status === "rejected" ? "text-red-500" : "text-orange-500"}`}
                      >
                        {req.status}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-medium text-slate-500">
                      {new Date(req.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-slate-900 border border-slate-800 rounded-2xl">
                <p className="text-xs text-slate-500 font-medium">
                  No transactions yet
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default OwnerEarnings;
