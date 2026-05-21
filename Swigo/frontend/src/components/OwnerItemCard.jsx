import axios from "axios";
import React, { useState } from "react";
import { FiEdit3, FiTrash2, FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { serverurl } from "../pages/EditItem";
import { useDispatch } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";

function OwnerItemCard({ data }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // 🗑️ Delete Handler FIX
  const handledelete = async () => {
    // 1. Confirmation: Bina puchhe delete karna paap hai!
    const confirmDelete = window.confirm("Bhai, kya sach me ye item hataana hai?");
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      
      // 2. Method Change: GET ki jagah DELETE use karo (Backend router ke hisaab se)
      // Aur URL check karo 'delet' hai ya 'delete'
      const result = await axios.delete(`${serverurl}/api/item/delete/${data._id}`, { 
        withCredentials: true,
      });

      // 3. Redux Update: Naya shop data set karo
      dispatch(setMyShopData(result.data));
      alert("Item uda diya gaya! 🔥");
      
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Bhai delete nahi hua: " + (error.response?.data?.message || "Server Error"));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      navigate(`/EditItem/${data._id}`);
      setIsEditing(false);
    }, 300); 
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col h-full">
      
      {/* Image Section */}
      <div className="relative h-40 w-full overflow-hidden bg-gray-50 shrink-0">
        <img
          src={data?.image}
          alt={data?.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm font-bold text-[10px]">
          {data?.foodType === "Veg" ? "🟢 VEG" : "🔴 NON-VEG"}
        </div>
        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md backdrop-blur-md uppercase">
          {data?.category}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 truncate mb-1">
          {data?.name}
        </h3>

        <div className="flex-grow"></div>

        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
          <span className="text-xl font-black text-orange-600">
            ₹{data?.price}
          </span>

          <div className="flex gap-2">
            {/* Edit Button */}
            <button
              className="p-2.5 rounded-full text-blue-500 bg-blue-50 hover:bg-blue-500 hover:text-white transition-all shadow-sm disabled:opacity-50"
              onClick={handleEditClick}
              disabled={isEditing || isDeleting}
            >
              {isEditing ? <FiLoader className="animate-spin" /> : <FiEdit3 />}
            </button>

            {/* Delete Button */}
            <button
              className={`p-2.5 rounded-full transition-all shadow-sm ${
                isDeleting ? "bg-red-200 text-red-500" : "text-red-500 bg-red-50 hover:bg-red-500 hover:text-white"
              }`}
              onClick={handledelete}
              disabled={isDeleting || isEditing}
            >
              {isDeleting ? <FiLoader className="animate-spin" /> : <FiTrash2 />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerItemCard;