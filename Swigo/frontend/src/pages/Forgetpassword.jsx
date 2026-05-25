import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export const serverurl = "https://zyngo.onrender.com";

function Forgetpassword() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [showpassword, setShowpassword] = useState(false);
  const [shoowpassword, setShoowpassword] = useState(false);
  const [newpassword, setNewpassword] = useState("");
  const [conformpassword, setConformpassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  // sendotp
  const handlesendOtp = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const result = await axios.post(
        `${serverurl}/api/auth/sendOtp`,
        { email },
        { withCredentials: true },
      );
       alert("OTP Send Successful!");
      setStep(2);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }finally {
      setLoading(false);
    }
  };

  // varify OTP
  const handlevarifyOtp = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const result = await axios.post(
        `${serverurl}/api/auth/varifyOtp`,
        { email, otp },
        { withCredentials: true },
      );
    alert("OTP Varifyied !")
      setStep(3);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }finally {
      setLoading(false);
    }
  };

  // reset password
  const resetpassword = async () => {

    if (newpassword != conformpassword) {
    setErrorMessage("Passwords do not match! ❌");
      return;
    }
  if (loading) return;
    setLoading(true);
    setErrorMessage("");

    try {
      const result = await axios.post(
        `${serverurl}/api/auth/resetpassword`,
        { email, newpassword },
        { withCredentials: true },
      );
    alert("Password Reseted !")
      navigate("/signin");
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }finally {
      setLoading(false);
    }
  };

  return (
    // Background with animated gradient and no scroll
    <div className="h-screen w-full flex justify-center items-center bg-gradient-to-tr from-orange-100 via-red-50 to-white overflow-hidden relative">
      {/* Background Glows for Glass Effect */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-400 rounded-full blur-[100px] opacity-20"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-400 rounded-full blur-[100px] opacity-20"></div>

      {/* Glassmorphic Card - Sized between 'sm' and 'md' */}
      <div className="relative z-10 w-full max-w-[380px] bg-white/70 backdrop-blur-lg p-7 rounded-[2.5rem] shadow-2xl border border-white/40 mx-4">
        {/* Header Section */}
        <div className="text-center mb-5">
          <div>
            {" "}
            <Link
              to="/signin"
              className="text-black-600 font-bold hover:underline"
            >
              <FaArrowLeftLong className="text-xl font-bold " />
            </Link>
          </div>
          <h1 className="text-3xl font-extrabold text-red-600">Zyngo</h1>

          <p className="text-gray-500 text-xs font-medium mt-1 uppercase tracking-widest">
            Forget Password
          </p>
        </div>

        {step == 1 && (
          <div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2.5 bg-white/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-orange-400 outline-none text-sm shadow-sm"
            />
            <button
              disabled={loading}
              onClick={handlesendOtp}
              className={`w-full ... ${loading ? "opacity-50 cursor-not-allowed w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-2xl font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all text-sm mt-2" : "w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-2xl font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all text-sm mt-2"}`}
            >
              {loading ? "Sending..." : "Generate OTP"}
            </button>

            {/* error messege */}
          {errorMessage && (
            <p className="text-[10px] text-red-500 font-bold text-center mt-1 animate-pulse">
              ⚠️ {errorMessage}
            </p>
          )}
          </div>
        )}

        {step == 2 && (
          <div>
            <input
              type="text"
              placeholder="Enter OTP"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-orange-400 outline-none text-sm shadow-sm"
            />

            <button
              type="submit"
              onClick={handlevarifyOtp}
              className={`w-full ... ${loading ? "opacity-50 cursor-not-allowed w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-2xl font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all text-sm mt-2" : "w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-2xl font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all text-sm mt-2"}`}
            >
              {loading ? "Varifying..." : "Varify OTP"}
            </button>


            {/* error messege */}
          {errorMessage && (
            <p className="text-[10px] text-red-500 font-bold text-center mt-1 animate-pulse">
              ⚠️ {errorMessage}
            </p>
          )}
          </div>
        )}

        {step == 3 && (
          <div>
            {/* Password */}
            <div className="relative">
              <input
                type={showpassword ? "text" : "password"}
                required
                value={newpassword}
                onChange={(e) =>{setNewpassword(e.target.value) ; setErrorMessage("");}}
                placeholder="New Password"
                className="w-full px-4 py-2.5 mb-4 bg-white/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-orange-400 outline-none text-sm shadow-sm"
              />
              <button
                type="button"
                className="absolute right-4 top-3 text-gray-400 hover:text-orange-500"
                onClick={() => setShowpassword((prev) => !prev)}
              >
                {showpassword ? (
                  <FaRegEyeSlash size={18} />
                ) : (
                  <FaRegEye size={18} />
                )}
              </button>

          
            </div>

            <div className="relative">
              <input
                type={shoowpassword ? "text" : "password"}
                required
                value={conformpassword}
                onChange={(e) => {setConformpassword(e.target.value); setErrorMessage("")}}
                placeholder="Conform Password"
                className="w-full px-4 py-2.5 bg-white/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-orange-400 outline-none text-sm shadow-sm"
              />
              <button
                type="button"
                className="absolute right-4 top-3 text-gray-400 hover:text-orange-500"
                onClick={() => setShoowpassword((prev) => !prev)}
              >
                {shoowpassword ? (
                  <FaRegEyeSlash size={18} />
                ) : (
                  <FaRegEye size={18} />
                )}
              </button>
            </div>

            <button
              type="submit"
              onClick={resetpassword}
              className={`w-full ... ${loading ? "opacity-50 cursor-not-allowed w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-2xl font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all text-sm mt-2" : "w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-2xl font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all text-sm mt-2"}`}
            >
              {loading ? "Reseting..." : "Reset Password"}
            </button>

                {/* error messege */}
          {errorMessage && (
            <p className="text-[10px] text-red-500 font-bold text-center mt-1 animate-pulse">
              ⚠️ {errorMessage}
            </p>
          )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Forgetpassword;
