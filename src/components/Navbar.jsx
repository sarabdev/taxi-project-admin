import React from "react";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
    const { admin, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="h-14 bg-gray-900 text-white flex items-center justify-between px-6">
            <div className="flex items-center gap-6">
                <h3 className="font-semibold text-lg">🚕 Taxi Admin</h3>

                <Link to="/" className="text-gray-300 hover:text-white">
                    Dashboard
                </Link>
                <Link to="/bookings" className="text-gray-300 hover:text-white">
                    Bookings
                </Link>
                <Link to="/drivers" className="text-gray-300 hover:text-white">
                    Drivers
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-300">
                    {admin?.name}
                </span>
                <button
                    onClick={() => {
                        logout();
                        navigate("/login");
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}
