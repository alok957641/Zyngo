import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaStore } from "react-icons/fa6";
import { FiArrowLeft, FiUploadCloud, FiMapPin, FiLoader } from "react-icons/fi";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import { setMyShopData } from "../redux/ownerSlice";
import "leaflet/dist/leaflet.css"; // 🔥 YE IMPORT ZAROORI HAI

const markerIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export const serverurl = "https://zyngo.onrender.com";

function CreateAndEditShop() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const myShopData = useSelector((state) => state.owner?.myShopData);

  const [name, setName] = useState(myShopData?.name || "");
  const [city, setCity] = useState(myShopData?.city || "");
  const [state, setState] = useState(myShopData?.state || "");
  const [address, setAddress] = useState(myShopData?.address || "");
  
  // Coords ko parseFloat karke store karo
  const [lat, setLat] = useState(myShopData?.location?.coordinates?.[1] || 25.2425);
  const [lon, setLon] = useState(myShopData?.location?.coordinates?.[0] || 86.9718);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [frontendimg, setFrontendimg] = useState(myShopData?.image || null);
  const [backendimg, setBackendimg] = useState(null);

  // ✅ Fixed Marker Logic
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setLat(e.latlng.lat);
        setLon(e.latlng.lng);
      },
    });
    return <Marker position={[lat, lon]} icon={markerIcon} />;
  }

  const handleimg = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendimg(file);
      setFrontendimg(URL.createObjectURL(file));
    }
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("address", address);
    formData.append("latitude", lat.toString());
    formData.append("longitude", lon.toString());
    if (backendimg) formData.append("image", backendimg);

    try {
      const result = await axios.post(`${serverurl}/api/shop/CreateAndEditShop`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      dispatch(setMyShopData(result.data.shop || result.data));
      navigate(-1);
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || "Server Error"));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl w-full mx-auto bg-white shadow-xl rounded-[2.5rem] overflow-hidden border">
        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-10 text-center">
            <h2 className="text-3xl font-black text-slate-800 uppercase">{myShopData ? "Edit Shop" : "Start New Shop"}</h2>
        </div>

        <form onSubmit={handlesubmit} className="p-8 space-y-6">
          <input type="text" required onChange={(e) => setName(e.target.value)} value={name} placeholder="Shop Name" className="w-full bg-slate-50 border p-4 rounded-2xl" />
          
          <div className="relative w-full h-44 bg-slate-50 border-2 border-dashed rounded-2xl flex items-center justify-center">
             <input type="file" accept="image/*" required={!myShopData} onChange={handleimg} className="absolute inset-0 opacity-0 cursor-pointer" />
             {frontendimg ? <img className="w-full h-full object-cover rounded-2xl" src={frontendimg} alt="Preview" /> : <FiUploadCloud className="text-4xl text-slate-400" />}
          </div>

          {/* 🔥 MAP FIX: key={`${lat}-${lon}`} se map update hoga */}
          <div className="h-[250px] w-full rounded-2xl overflow-hidden border-2">
            <MapContainer key={`${lat}-${lon}`} center={[lat, lon]} zoom={14} className="h-full w-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker />
            </MapContainer>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input type="text" required onChange={(e) => setCity(e.target.value)} value={city} placeholder="City" className="bg-slate-50 border p-4 rounded-xl" />
            <input type="text" required onChange={(e) => setState(e.target.value)} value={state} placeholder="State" className="bg-slate-50 border p-4 rounded-xl" />
          </div>

          <textarea required onChange={(e) => setAddress(e.target.value)} value={address} placeholder="Address" className="w-full bg-slate-50 border p-4 rounded-xl" />

          <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black">
            {isSubmitting ? <FiLoader className="animate-spin inline" /> : "SAVE SHOP DETAILS"}
          </button>
        </form>
      </div>
    </div>
  );
}
export default CreateAndEditShop;