import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaStore } from "react-icons/fa6";
import { FiArrowLeft, FiUploadCloud, FiMapPin, FiLoader } from "react-icons/fi";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import { setMyShopData } from "../redux/ownerSlice";
import "leaflet/dist/leaflet.css"; // ⚠️ CSS import zaroori hai

const markerIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// ✅ 1. Marker Component bahar nikala
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
  const [frontendimg, setFrontendimg] = useState(myShopData?.image || null);
  const [backendimg, setBackendimg] = useState(null);

  // Sync state if myShopData updates
  useEffect(() => {
    if (myShopData) {
      setName(myShopData.name || "");
      setCity(myShopData.city || "");
      setState(myShopData.state || "");
      setAddress(myShopData.address || "");
    }
  }, [myShopData]);

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
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <form onSubmit={handlesubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-[2.5rem] shadow-xl border">
        {/* ... form fields ... */}
        
        {/* 🔥 MAP FIX: key={`${lat}-${lon}`} is mandatory for re-centering */}
        <div className="h-[250px] w-full rounded-2xl overflow-hidden border-2 z-0 relative">
          <MapContainer key={`${lat}-${lon}`} center={[lat, lon]} zoom={14} className="h-full w-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker lat={lat} lon={lon} setLat={setLat} setLon={setLon} />
          </MapContainer>
        </div>
        
        <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl mt-6">
            {isSubmitting ? "SAVING..." : "SAVE SHOP DETAILS"}
        </button>
      </form>
    </div>
  );
}
export default CreateAndEditShop;