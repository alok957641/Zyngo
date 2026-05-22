import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaStore } from "react-icons/fa6";
import { FiArrowLeft, FiUploadCloud, FiMapPin, FiLoader } from "react-icons/fi";
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

// ✅ FIX 1: Marker component bahar nikala taaki flicker na kare
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

  const [name, setName] = useState(myShopData?.name || "");
  const [city, setCity] = useState(myShopData?.city || "");
  const [state, setState] = useState(myShopData?.state || "");
  const [address, setAddress] = useState(myShopData?.address || "");
  const [lat, setLat] = useState(myShopData?.location?.coordinates?.[1] || 25.2425);
  const [lon, setLon] = useState(myShopData?.location?.coordinates?.[0] || 86.9718);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoingBack, setIsGoingBack] = useState(false);
  const [frontendimg, setFrontendimg] = useState(myShopData?.image || null);
  const [backendimg, setBackendimg] = useState(null);

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
    formData.append("latitude", lat);
    formData.append("longitude", lon);
    if (backendimg) formData.append("image", backendimg);

    try {
      const res = await axios.post(`${serverurl}/api/shop/CreateAndEditShop`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      dispatch(setMyShopData(res.data));
      navigate(-1);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-8 px-4 font-sans">
      <div className="max-w-2xl w-full mb-6">
        <button onClick={() => { setIsGoingBack(true); setTimeout(() => navigate(-1), 300); }} className="group flex items-center gap-3 text-slate-500 hover:text-orange-600 font-semibold transition-all">
          <div className="p-2.5 bg-white rounded-full shadow-sm border border-slate-200">
            {isGoingBack ? <FiLoader className="animate-spin" /> : <FiArrowLeft />}
          </div>
          <span>Back</span>
        </button>
      </div>

      <div className="max-w-2xl w-full bg-white shadow-xl rounded-[2.5rem] overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-10 text-center">
           <FaStore className="text-4xl text-orange-500 mx-auto mb-4" />
           <h2 className="text-3xl font-black text-slate-800 uppercase">{myShopData ? "Edit Shop" : "Start New Shop"}</h2>
        </div>

        <form onSubmit={handlesubmit} className="p-8 space-y-6">
          <input type="text" required onChange={(e) => setName(e.target.value)} value={name} placeholder="Shop Name" className="w-full bg-slate-50 border rounded-2xl px-5 py-4 outline-none" />
          
          {/* Map Section */}
          <div className="h-[250px] w-full rounded-2xl overflow-hidden border-2 z-0 relative">
            {/* ✅ FIX 2: key prop ensures map re-renders on location change */}
            <MapContainer key={`${lat}-${lon}`} center={[lat, lon]} zoom={14} className="h-full w-full">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker lat={lat} lon={lon} setLat={setLat} setLon={setLon} />
            </MapContainer>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl">
            {isSubmitting ? <FiLoader className="animate-spin inline" /> : "SAVE SHOP DETAILS"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateAndEditShop;