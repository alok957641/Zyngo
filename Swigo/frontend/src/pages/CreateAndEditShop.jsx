import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaStore } from "react-icons/fa6";
import { FiArrowLeft, FiUploadCloud, FiLoader } from "react-icons/fi";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import { setMyShopData } from "../redux/ownerSlice";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ lat, lon, setLat, setLon }) {
  useMapEvents({
    click(e) {
      setLat(e.latlng.lat);
      setLon(e.latlng.lng);
    },
  });
  return <Marker position={[lat, lon]} icon={markerIcon} />;
}

export const serverurl = "http://localhost:8000";

function CreateAndEditShop() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const myShopData = useSelector((state) => state.owner?.myShopData);

  // States with Initial Data (Edit mode mein data bhara hoga)
  const [name, setName] = useState(myShopData?.name || "");
  const [city, setCity] = useState(myShopData?.city || "");
  const [state, setState] = useState(myShopData?.state || "");
  const [address, setAddress] = useState(myShopData?.address || "");
  const [lat, setLat] = useState(myShopData?.location?.coordinates?.[1] || 25.2425);
  const [lon, setLon] = useState(myShopData?.location?.coordinates?.[0] || 86.9718);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendimg, setBackendimg] = useState(null);

  const handleimg = (e) => setBackendimg(e.target.files[0]);

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
      const res = await axios.post(`${serverurl}/api/shop/CreateAndEditShop`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      // Backend se jo naya shop data aaye usse update karo
      dispatch(setMyShopData(res.data.shop || res.data)); 
      navigate(-1);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-8 px-4">
      <div className="max-w-2xl w-full mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-slate-500 font-semibold">
          <FiArrowLeft /> <span>Back</span>
        </button>
      </div>

      <div className="max-w-2xl w-full bg-white shadow-xl rounded-[2.5rem] overflow-hidden">
        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-10 text-center">
           <FaStore className="text-4xl text-orange-500 mx-auto mb-4" />
           <h2 className="text-3xl font-black text-slate-800 uppercase">{myShopData ? "Edit Shop" : "Start New Shop"}</h2>
        </div>

        <form onSubmit={handlesubmit} className="p-8 space-y-4">
          <input type="text" required onChange={(e) => setName(e.target.value)} value={name} placeholder="Shop Name" className="w-full bg-slate-50 border rounded-2xl px-5 py-4 outline-none" />
          <input type="text" required onChange={(e) => setCity(e.target.value)} value={city} placeholder="City" className="w-full bg-slate-50 border rounded-2xl px-5 py-4 outline-none" />
          <input type="text" required onChange={(e) => setState(e.target.value)} value={state} placeholder="State" className="w-full bg-slate-50 border rounded-2xl px-5 py-4 outline-none" />
          <textarea required onChange={(e) => setAddress(e.target.value)} value={address} placeholder="Full Address" className="w-full bg-slate-50 border rounded-2xl px-5 py-4 outline-none" />
          
          <label className="flex items-center gap-3 bg-slate-50 border rounded-2xl px-5 py-4 cursor-pointer">
            <FiUploadCloud className="text-orange-500" />
            <span className="text-slate-400">{backendimg ? backendimg.name : "Upload Shop Image"}</span>
            <input type="file" accept="image/*" onChange={handleimg} className="hidden" />
          </label>

          <div className="h-[250px] w-full rounded-2xl overflow-hidden border-2 relative">
            <MapContainer key={`${lat}-${lon}`} center={[lat, lon]} zoom={14} className="h-full w-full">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker lat={lat} lon={lon} setLat={setLat} setLon={setLon} />
            </MapContainer>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl">
            {isSubmitting ? <FiLoader className="animate-spin inline" /> : (myShopData ? "UPDATE SHOP" : "CREATE SHOP")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateAndEditShop;