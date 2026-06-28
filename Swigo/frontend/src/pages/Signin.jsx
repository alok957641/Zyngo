import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase.js";

import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";
import { serverurl } from "../config/api.js";

function Signin() {
  const [showpassword, setShowpassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // signin
  const handelsignin = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const result = await axios.post(
        `${serverurl}/api/auth/signin`,
        { email, password },
        { withCredentials: true },
      );
      dispatch(setUserData(result.data));
      navigate("/", { replace: true });
    } catch (error) {
      // 🚀 YAHAN THI GALTI: 'msg' ki jagah actual error nikalna tha
      setErrorMessage(error.response?.data?.message || "Invalid Email or Password");
    } finally {
      setLoading(false);
    }
  };

  // sign in google
  const handlesignupgoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const { data } = await axios.post(
        `${serverurl}/api/auth/googleauth`,
        {
          email: result.user.email,
          fullname: result.user.displayName,
        },
        { withCredentials: true },
      );
      dispatch(setUserData(data));
      navigate("/profile-verification", { replace: true });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Google Signin Failed");
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
          <h1 className="text-3xl font-extrabold text-red-600">Zyngo</h1>
          <p className="text-gray-500 text-xs font-medium mt-1 uppercase tracking-widest">
            Login Account
          </p>
        </div>

        <form className="space-y-3.5" onSubmit={handelsignin}>
          {/* Email & Mobile Grid */}

          <input
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMessage("");
            }}
            placeholder="Email"
            className="w-full px-4 py-2.5 bg-white/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-orange-400 outline-none text-sm shadow-sm"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showpassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage("");
              }}
              placeholder="Password"
              className="w-full px-4 py-2.5 bg-white/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-orange-400 outline-none text-sm shadow-sm"
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

          <div className="text-right  text-xs text-gray-600 font-medium">
            <Link
              to="/forgetpassword"
              className="text-red-600 font-bold hover:underline"
            >
              Forget Password
            </Link>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className={`w-full ... ${loading ? "opacity-50 cursor-not-allowed w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-2xl font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all text-sm mt-2" : "w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-2xl font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all text-sm mt-2"}`}
          >
            {loading ? "loading..." : "Sign In"}
          </button>

          {errorMessage && (
            <p className="text-[10px] text-red-500 font-bold text-center mt-1 animate-pulse">
              ⚠️ {errorMessage}
            </p>
          )}
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow h-[1px] bg-gray-300/50"></div>
          <span className="px-3 text-[10px] text-gray-400 font-bold italic tracking-tighter">
            EXPLORE FOOD
          </span>
          <div className="flex-grow h-[1px] bg-gray-300/50"></div>
        </div>

        {/* Google & Login Links */}
        <div className="space-y-3">
          <button
            onClick={handlesignupgoogle}
            className="w-full flex justify-center items-center py-2.5 border border-white bg-white/40 rounded-2xl gap-2 text-xs font-bold text-gray-700 hover:bg-white/60 transition-all shadow-sm"
          >
            <FcGoogle className="text-xl" /> Google Signin
          </button>

          <p className="text-center text-xs text-gray-600 font-medium">
            Want to create a Account ?{" "}
            <Link
              to="/signup"
              className="text-red-600 font-bold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signin;
