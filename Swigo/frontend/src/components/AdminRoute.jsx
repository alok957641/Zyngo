import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
    const { userData, loading } = useSelector((state) => state.user);
    const location = useLocation();

    if (loading) return null; // Ya apna loader dalde

    if (!userData || userData.role !== "admin") {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    return children; // Bas yahan sidebar return kar
};

export default AdminRoute;