import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaStore } from "react-icons/fa6";
import {
  FiArrowLeft,
  FiUploadCloud,
  FiMapPin,
  FiLoader,
  FiSearch,
} from "react-icons/fi";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import { setMyShopData } from "../redux/ownerSlice";

// Fix for Leaflet Default Icon
const markerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export const serverurl = "https://zyngo.onrender.com";

function CreateAndEditShop() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const myShopData = useSelector((state) => state.owner?.myShopData);

  // --- 📝 Form States ---
  const [name, setName] = useState(myShopData?.name || "");
  const [city, setCity] = useState(myShopData?.city || "");
  const [state, setState] = useState(myShopData?.state || "");
  const [address, setAddress] = useState(myShopData?.address || "");

  // --- 📍 Location States (GeoJSON Logic) ---
  const [lat, setLat] = useState(
    myShopData?.location?.coordinates?.[1] || 25.2425,
  );
  const [lon, setLon] = useState(
    myShopData?.location?.coordinates?.[0] || 86.9718,
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoingBack, setIsGoingBack] = useState(false);
  const [frontendimg, setFrontendimg] = useState(myShopData?.image || null);
  const [backendimg, setBackendimg] = useState(null);

  // --- 🗺️ Map Click Component ---
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setLat(e.latlng.lat);
        setLon(e.latlng.lng);
      },
    });
    return lat ? <Marker position={[lat, lon]} icon={markerIcon} /> : null;
  }

  const handleimg = (e) => {
    const file = e.target.files[0];
   let image;
        if (req.file) {
           
            image = await uploadoncloudinary(req.file.buffer);}
  };

  const handleBackClick = () => {
    setIsGoingBack(true);
    setTimeout(() => navigate(-1), 300);
  };

  // --- 🚀 FINAL SUBMIT ---
const handlesubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("address", address);
    formData.append("latitude", lat);
    formData.append("longitude", lon);
    if (backendimg) formData.append("image", backendimg);

    try {
        const result = await axios.post(`${serverurl}/api/shop/CreateAndEditShop`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        });
        dispatch(setMyShopData(result.data.shop));
        navigate(-1);
    } catch (error) {
        alert("Error saving shop: " + (error.response?.data?.message || error.message));
        setIsSubmitting(false);
    }
};

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-8 px-4 font-sans">
      <div className="max-w-2xl w-full mb-6">
        <button
          onClick={handleBackClick}
          disabled={isGoingBack || isSubmitting}
          className="group flex items-center gap-3 text-slate-500 hover:text-orange-600 font-semibold transition-all w-fit"
        >
          <div className="p-2.5 bg-white rounded-full shadow-sm border border-slate-200">
            {isGoingBack ? (
              <FiLoader className="animate-spin" />
            ) : (
              <FiArrowLeft />
            )}
          </div>
          <span>Back</span>
        </button>
      </div>

      <div className="max-w-2xl w-full bg-white shadow-xl rounded-[2.5rem] overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-10 text-center relative">
          <div className="bg-white w-16 h-16 rounded-2xl text-orange-500 mb-4 shadow-sm border border-orange-100 mx-auto flex items-center justify-center">
            <FaStore className="text-3xl" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
            {myShopData ? "Edit Your Shop" : "Start New Shop"}
          </h2>
        </div>

        <form onSubmit={handlesubmit} className="p-8 space-y-6">
          {/* Shop Name */}
          <div className="space-y-2">
            <label className="text-slate-700 font-bold text-sm ml-1 uppercase tracking-widest">
              Shop Name *
            </label>
            <input
              type="text"
              required
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Alok Bakery"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-slate-700 font-bold text-sm ml-1 uppercase tracking-widest">
              Shop Banner *
            </label>
            <div className="relative w-full h-44 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden group cursor-pointer">
              <input
                type="file"
                accept="image/*"
                required={!myShopData}
                onChange={handleimg}
                className="absolute inset-0 opacity-0 z-20 cursor-pointer"
              />
              {frontendimg ? (
                <img
                  className="w-full h-full object-cover"
                  src={frontendimg}
                  alt="Preview"
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <FiUploadCloud className="text-3xl mb-2" />
                  <span className="text-xs font-bold">Tap to upload photo</span>
                </div>
              )}
            </div>
          </div>

          {/* 🗺️ MAP SELECTION SECTION */}
          <div className="space-y-3">
            <label className="text-slate-700 font-bold text-sm ml-1 uppercase tracking-widest flex items-center gap-2">
              <FiMapPin className="text-orange-500" /> Mark Shop on Map *
            </label>
            <div className="h-[250px] w-full rounded-2xl overflow-hidden border-2 border-slate-100 shadow-inner z-0 relative">
              <MapContainer
                key={`${lat}-${lon}`}
                center={[lat, lon]}
                zoom={14}
                className="h-full w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker />
              </MapContainer>
              <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-xl text-[10px] font-bold text-slate-600 z-[1000] border border-white">
                📍 Current: {lat.toFixed(4)}, {lon.toFixed(4)} (Tap map to
                change)
              </div>
            </div>

            {/* City & State */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                required
                onChange={(e) => setCity(e.target.value)}
                value={city}
                placeholder="City"
                className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 outline-none"
              />
              <input
                type="text"
                required
                onChange={(e) => setState(e.target.value)}
                value={state}
                placeholder="State"
                className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 outline-none"
              />
            </div>

            {/* Full Address */}
            <textarea
              rows="2"
              required
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              placeholder="Exact Shop Address..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 outline-none resize-none"
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-lg hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <FiLoader className="animate-spin text-xl" />
              ) : (
                <>
                  <FaStore /> SAVE SHOP DETAILS
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAndEditShop;
