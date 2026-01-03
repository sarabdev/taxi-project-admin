import React from "react";

import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PrivateRoute({ children }) {
    const { admin } = useAuth();
    return admin ? children : <Navigate to="/login" replace />;
}
