import React from "react";
import { useSelector } from "react-redux";
import { FiShield, FiDatabase, FiSettings, FiServer, FiLock, FiCpu, FiTerminal, FiSave } from "react-icons/fi";

const AdminSettings = () => {
  const { userData } = useSelector((state) => state.user || {});

  return (
    <div className="max-w-5xl mx-auto p-4 pb-20 text-slate-200">
      {/* HEADER */}
      <div className="mb-10">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Admin Command Center</h2>
        <p className="text-orange-500 text-[10px] font-black tracking-[4px] uppercase mt-1">Infrastructure & Governance Protocols</p>
      </div>

      {/* ADMIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CARD: SYSTEM HEALTH */}
        <div className="bg-[#090d1f] border border-white/5 p-6 rounded-3xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-6">
            <FiServer className="text-blue-500" /> System Health
          </h3>
          <div className="space-y-4">
            <StatusRow label="Database Cluster" value="Connected" color="text-green-500" />
            <StatusRow label="Node Latency" value="12ms" color="text-blue-400" />
            <StatusRow label="Uptime" value="99.98%" color="text-purple-400" />
          </div>
        </div>

        {/* CARD: SECURITY */}
        <div className="bg-[#090d1f] border border-white/5 p-6 rounded-3xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-6">
            <FiShield className="text-orange-500" /> Security Keys
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white/[0.02] p-3 rounded-xl border border-white/5">
              <span className="text-xs text-slate-500">API Secret Key</span>
              <button className="text-[10px] font-black text-orange-500 uppercase">Rotate Key</button>
            </div>
            <div className="flex justify-between items-center bg-white/[0.02] p-3 rounded-xl border border-white/5">
              <span className="text-xs text-slate-500">Auth Token</span>
              <button className="text-[10px] font-black text-orange-500 uppercase">Revoke Sessions</button>
            </div>
          </div>
        </div>

        {/* CARD: OPERATIONAL TOGGLES */}
        <div className="md:col-span-2 bg-[#090d1f] border border-white/5 p-6 rounded-3xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-6">
            <FiSettings className="text-purple-500" /> Operations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <AdminToggle title="Maintenance" desc="Pause all orders" />
            <AdminToggle title="Registration" desc="Close sign-ups" />
            <AdminToggle title="Auto-Payout" desc="Stop settlements" />
          </div>
        </div>

        {/* LOG CONSOLE */}
        <div className="md:col-span-2 bg-[#020617] border border-white/5 p-6 rounded-3xl font-mono text-[10px] text-green-500">
           <div className="flex items-center gap-2 mb-4 text-slate-400">
             <FiTerminal /> SYSTEM LOGS
           </div>
           <p> Connected to {userData?.email || "Admin"}...</p>
           <p> Synchronizing database nodes...</p>
           <p>Status: OK</p>
        </div>
      </div>
    </div>
  );
};

const StatusRow = ({ label, value, color }) => (
  <div className="flex justify-between border-b border-white/5 pb-2">
    <span className="text-xs text-slate-500">{label}</span>
    <span className={`text-xs font-black ${color}`}>{value}</span>
  </div>
);

const AdminToggle = ({ title, desc }) => (
  <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5 flex flex-col justify-between h-28">
    <span className="text-xs font-bold text-white">{title}</span>
    <span className="text-[9px] text-slate-500">{desc}</span>
    <div className="w-10 h-5 bg-slate-800 rounded-full cursor-pointer mt-2"></div>
  </div>
);

export default AdminSettings;