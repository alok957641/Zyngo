import React, { useMemo, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { Check, Smartphone, Store, Truck, User } from "lucide-react";
import { setUserData } from "../redux/userSlice.js";
import { serverurl } from "../config/api.js";

const roles = [
  { value: "user", label: "Customer", icon: User },
  { value: "owner", label: "Restaurant", icon: Store },
  { value: "deliveryboy", label: "Delivery", icon: Truck },
];

function ProfileVerification() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [role, setRole] = useState(userData?.role || "user");
  const [mobile, setMobile] = useState(
    userData?.mobile && String(userData.mobile) !== "0" ? String(userData.mobile) : "",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isMobileValid = useMemo(() => /^\d{10}$/.test(mobile), [mobile]);

  if (!userData) {
    return <Navigate to="/signin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!role) {
      setErrorMessage("Please select your role");
      return;
    }

    if (!isMobileValid) {
      setErrorMessage("Enter a valid 10 digit mobile number");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.put(
        `${serverurl}/api/auth/profile`,
        { role, mobile },
        { withCredentials: true },
      );

      dispatch(setUserData(data));

      if (data.role === "admin") navigate("/admin/dashboard", { replace: true });
      else if (data.role === "deliveryboy") navigate("/rider/dashboard", { replace: true });
      else navigate("/", { replace: true });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Could not update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-tr from-orange-100 via-red-50 to-white px-4 py-6">
      <div className="w-full max-w-[430px] bg-white/80 backdrop-blur-lg border border-white/50 rounded-[2rem] shadow-2xl p-6 sm:p-7">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-red-600">Zyngo</h1>
          <p className="text-gray-500 text-xs font-bold mt-1 uppercase tracking-widest">
            Confirm Profile
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-2xl bg-white/70 border border-orange-100 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Signed in as</p>
            <p className="text-sm font-extrabold text-gray-800 truncate">{userData.email}</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {roles.map((item) => {
              const Icon = item.icon;
              const selected = role === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    setRole(item.value);
                    setErrorMessage("");
                  }}
                  className={`min-h-[82px] rounded-2xl border p-2 flex flex-col items-center justify-center gap-2 transition-all ${
                    selected
                      ? "bg-orange-500 text-white border-orange-500 shadow-lg"
                      : "bg-white/70 text-gray-600 border-gray-200 hover:border-orange-300"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-[10px] font-extrabold uppercase leading-tight">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative">
            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              required
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
                setErrorMessage("");
              }}
              placeholder="Mobile number"
              className="w-full pl-11 pr-4 py-3 bg-white/70 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-400 outline-none text-sm font-bold shadow-sm"
            />
          </div>

          {errorMessage && (
            <p className="text-[11px] text-red-500 font-bold text-center">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-2xl font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Check size={18} />
            {loading ? "Saving..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileVerification;
