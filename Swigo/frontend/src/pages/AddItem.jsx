import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBowlFood, FaIndianRupeeSign } from "react-icons/fa6";
import { FiArrowLeft, FiUploadCloud, FiLoader } from "react-icons/fi"; 
import { MdOutlineDescription, MdCategory } from "react-icons/md";
import { useDispatch } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";
import axios from "axios";
export const serverurl = "http://localhost:8000";

function AddItem() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // 📝 Form States
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [foodType, setFoodType] = useState("Veg"); // Default Veg

  // 🚀 Loading States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoingBack, setIsGoingBack] = useState(false);

  const [frontendimg, setFrontendimg] = useState(null);
  const [backendimg, setBackendimg] = useState(null);

  const handleimg = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendimg(file);
      setFrontendimg(URL.createObjectURL(file));
    }
  };

  const handleBackClick = () => {
    setIsGoingBack(true);
    setTimeout(() => {
      navigate(-1);
    }, 300); 
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    
    // 🚀 ALERT HATA DIYA! HTML5 ka <form> ab khud handle karega khali fields ko.

    try {
      setIsSubmitting(true); // ⏳ Loading On
      
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("foodType", foodType);
      if (backendimg) {
        formData.append("image", backendimg);
      }

      const result = await axios.post(`${serverurl}/api/item/AddItem`, formData, {
        withCredentials: true,
      });

      dispatch(setMyShopData(result.data));
      console.log("Success:", result.data);

      navigate(-1);
    } catch (error) {
      console.log("Error:", error);
      setIsSubmitting(false); 
      alert("Something went wrong with the server!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Back Button */}
      <div className="max-w-2xl w-full mb-6">
        <button
          onClick={handleBackClick}
          disabled={isGoingBack || isSubmitting}
          className="group flex items-center gap-3 text-slate-500 hover:text-orange-600 font-semibold transition-all duration-300 w-fit disabled:opacity-50"
        >
          <div className="p-2.5 bg-white rounded-full shadow-sm border border-slate-200 group-hover:shadow-md group-hover:border-orange-200 transition-all duration-300">
             {isGoingBack ? (
                <FiLoader className="text-lg animate-spin" />
             ) : (
                <FiArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform duration-300" />
             )}
          </div>
          <span className="tracking-wide">{isGoingBack ? "Going back..." : "Back to Menu"}</span>
        </button>
      </div>

      {/* Main Form Card */}
      <div className="max-w-2xl w-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden border border-slate-100 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 px-8 py-10 border-b border-orange-100 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-yellow-200 rounded-full opacity-20 blur-3xl"></div>
            
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white p-4 rounded-2xl text-orange-500 mb-5 shadow-sm border border-orange-100 rotate-3 hover:rotate-0 transition-transform duration-300">
              <FaBowlFood className="text-4xl drop-shadow-sm text-orange-500" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
              Add a New Dish
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-3 font-medium max-w-sm mx-auto">
              Make it look delicious! Fill in the details below to add this item to your restaurant's menu.
            </p>
          </div>
        </div>

        {/* 🚀 YAHAN DIV KO FORM BANA DIYA, TAAKI 'REQUIRED' KAAM KARE */}
        <form onSubmit={handlesubmit} className="p-8 sm:p-10 space-y-7">
          
          {/* Dish Name */}
          <div className="space-y-2">
            <label className="text-slate-700 font-bold ml-1 text-sm flex items-center gap-2">
               Dish Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Paneer Butter Masala"
              required // 👈 Ab ye kaam karega
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 focus:bg-white hover:bg-slate-100/50 transition-all duration-200 shadow-sm placeholder-slate-400 font-medium text-lg"
            />
          </div>

          {/* Dish Image Upload */}
          <div className="space-y-2">
            <label className="text-slate-700 font-bold ml-1 text-sm flex items-center gap-2">
               Food Photo <span className="text-red-500">*</span>
            </label>
            <div className="relative w-full h-56 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center hover:bg-orange-50/50 hover:border-orange-400 transition-all duration-300 cursor-pointer group shadow-sm overflow-hidden">
              <input
                type="file"
                accept="image/*"
                onChange={handleimg}
                required // 👈 Bina photo ke aage nahi badhne dega
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
              />

              {frontendimg ? (
                <>
                  <img className="w-full h-full object-cover z-10 transition-transform duration-500 group-hover:scale-105" src={frontendimg} alt="Dish Preview" />
                  <div className="absolute inset-0 bg-black/40 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                     <span className="text-white font-semibold flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full"><FiUploadCloud /> Change Photo</span>
                  </div>
                </>
              ) : (
                <div className="text-center flex flex-col items-center z-10 p-6">
                  <div className="p-4 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform duration-300">
                    <FiUploadCloud className="text-3xl text-orange-400 group-hover:text-orange-600 transition-colors" />
                  </div>
                  <span className="text-sm font-bold text-slate-600 group-hover:text-orange-600 transition-colors">
                    Upload a mouth-watering picture
                  </span>
                  <span className="text-xs text-slate-400 mt-1">Recommended size: 800x600px</span>
                </div>
              )}
            </div>
          </div>

          {/* Price & Category (Row) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Price */}
            <div className="space-y-2">
              <label className="text-slate-700 font-bold ml-1 text-sm">
                Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaIndianRupeeSign className="text-slate-400 text-lg" />
                </div>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="250"
                  required // 👈 Price zaroori hai
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-10 pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 focus:bg-white hover:bg-slate-100/50 transition-all duration-200 shadow-sm placeholder-slate-400 font-bold text-lg"
                />
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="space-y-2">
              <label className="text-slate-700 font-bold ml-1 text-sm flex items-center gap-1.5">
                <MdCategory className="text-slate-400" /> Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required // 👈 Category zaroori hai
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 focus:bg-white hover:bg-slate-100/50 transition-all duration-200 shadow-sm font-medium appearance-none cursor-pointer"
              >
                <option value="" disabled>Select Category</option>
                <option value="Snacks">Snacks</option>
                <option value="Main Course">Main Course</option>
                <option value="Pizza">Pizza</option>
                <option value="Desserts">Desserts</option>
                <option value="Burger">Burger</option>
                <option value="South Indian">South Indian</option>
                <option value="Sandwich">Sandwich</option>
                <option value="North Indian">North Indian</option>
                <option value="Chinese">Chinese</option>
                <option value="Fast Food">Fast Food</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Food Type (Veg/Non-Veg Radio Buttons) */}
          <div className="space-y-3">
             <label className="text-slate-700 font-bold ml-1 text-sm">
                Food Preference <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                 <label className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${foodType === 'Veg' ? 'border-green-500 bg-green-50/50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}>
                    <input 
                      type="radio" 
                      name="foodType" 
                      value="Veg" 
                      checked={foodType === 'Veg'}
                      onChange={(e) => setFoodType(e.target.value)}
                      className="hidden" 
                    />
                    <div className="w-5 h-5 border-2 border-green-600 flex items-center justify-center bg-white p-[2px]">
                       <div className="w-full h-full bg-green-600 rounded-full"></div>
                    </div>
                    <span className={`font-bold ${foodType === 'Veg' ? 'text-green-700' : 'text-slate-600'}`}>Pure Veg</span>
                 </label>

                 <label className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${foodType === 'Non-Veg' ? 'border-red-500 bg-red-50/50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}>
                    <input 
                      type="radio" 
                      name="foodType" 
                      value="Non-Veg" 
                      checked={foodType === 'Non-Veg'}
                      onChange={(e) => setFoodType(e.target.value)}
                      className="hidden" 
                    />
                    <div className="w-5 h-5 border-2 border-red-600 flex items-center justify-center bg-white">
                       <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-transparent border-b-red-600 mt-[2px]"></div>
                    </div>
                    <span className={`font-bold ${foodType === 'Non-Veg' ? 'text-red-700' : 'text-slate-600'}`}>Non Veg</span>
                 </label>
              </div>
          </div>

          <div className="pt-2"></div>

          {/* 🚀 BROWSER DEFAULT SUBMIT TYPE LAGAYA W/ LOADER */}
          <button
            type="submit" // 👈 Yahan onClick hata ke type submit lagaya hai
            disabled={isSubmitting}
            className={`group relative w-full overflow-hidden text-white font-extrabold text-lg py-4.5 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 ${
              isSubmitting
                ? "bg-orange-400 cursor-not-allowed opacity-80 shadow-none"
                : "bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 active:scale-[0.98]"
            }`}
          >
            {!isSubmitting && (
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer"></div>
            )}
            
            {isSubmitting ? (
              <>
                <FiLoader className="text-2xl animate-spin relative z-10" />
                <span className="relative z-10">Adding to Menu...</span>
              </>
            ) : (
              <>
                <span className="text-2xl mb-1 relative z-10">+</span>
                <span className="relative z-10">Add Dish to Menu</span>
              </>
            )}
          </button>
          
        </form>
      </div>
    </div>
  );
}

export default AddItem;