import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase.js";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";
export const serverurl = import.meta.env.VITE_API_URL;



function Signup() {
  const [role, setRole] = useState("");
  const [showpassword, setShowpassword] = useState(false);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
 
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // signup
  const handelsignup = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!role) {
      return setErrorMessage(
        "Please select a Role (User, Owner, or Delivery Boy)",
      );
    }
    setErrorMessage("");
    try {
      const result = await axios.post(
        `${serverurl}/api/auth/signup`,
        {
          fullname,
          email,
          password,
          role,
          mobile,
        },
        { withCredentials: true },
      );
      alert("Signup Successful!");
      dispatch(setUserData(result.data));
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  // signup google
  const handlesignupgoogle = async () => {
    if (!mobile) {
      return setErrorMessage("Mobile number is required");
    }
    if (!role) {
      return setErrorMessage(
        "Please select a Role (User, Owner, or Delivery Boy)",
      );
    }
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const { data } = await axios.post(
        `${serverurl}/api/auth/googleauth`,
        {
          fullname: result.user.displayName,
          email: result.user.email,
          role,
          mobile,
        },
        { withCredentials: true },
      );
      console.log(data);
      alert("Signup Successful!");
      dispatch(setUserData(data));
      setErrorMessage("");
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      setErrorMessage(msg);
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
          <h1 className="text-3xl font-extrabold text-red-600">Swigo</h1>
          <p className="text-gray-500 text-xs font-medium mt-1 uppercase tracking-widest">
            Create Account
          </p>
        </div>

        <form className="space-y-3.5" onSubmit={handelsignup}>
          {/* Fullname */}
          <input
            type="text"
            required
            placeholder="Full Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="w-full px-4 py-2.5 bg-white/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-orange-400 outline-none transition-all text-sm shadow-sm"
          />

          {/* Email & Mobile Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2.5 bg-white/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-orange-400 outline-none text-sm shadow-sm"
            />
            <input
              type="tel"
              required
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value);
                setErrorMessage("");
              }}
              placeholder="Mobile"
              className="w-full px-4 py-2.5 bg-white/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-orange-400 outline-none text-sm shadow-sm"
            />
          </div>

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

          {/* Role Picker */}
          <div className="flex bg-gray-200/50 p-1 rounded-2xl gap-1">
            {["user", "owner", "deliveryboy"].map((ele) => (
              <button
                type="button"
                key={ele}
                onClick={() => {
                  setRole(ele);
                  setErrorMessage("");
                }}
                className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all duration-300 ${
                  role === ele
                    ? "bg-white text-orange-600 shadow-md scale-105"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {ele}
              </button>
            ))}
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            onClick={handelsignup}
            className={`w-full ... ${loading ? "opacity-50 cursor-not-allowed w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-2xl font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all text-sm mt-2" : "w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-2xl font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all text-sm mt-2"}`}
          >
            {loading ? "loading..." : "Sign Up"}
          </button>

          {/* error messege */}
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
            <FcGoogle className="text-xl" /> Google Signup
          </button>

          <p className="text-center text-xs text-gray-600 font-medium">
            Already a member?{" "}
            <Link
              to="/signin"
              className="text-red-600 font-bold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
