import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Car, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
    const { admin, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const signOut = () => {
        logout();
        navigate("/login");
    };

    const navClass = ({ isActive }) =>
        `block rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-gray-800 hover:text-white"
        }`;

    return (
        <nav className="sticky top-0 z-50 bg-gray-900 text-white shadow-sm">
            <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-6">
                    <NavLink to="/" className="flex shrink-0 items-center gap-2 font-semibold text-lg" onClick={() => setMenuOpen(false)}>
                        <Car className="h-6 w-6 text-blue-400" />
                        <span>Taxi Admin</span>
                    </NavLink>

                    <div className="hidden items-center gap-1 md:flex">
                        <NavLink to="/" end className={navClass}>Dashboard</NavLink>
                        <NavLink to="/bookings" className={navClass}>Bookings</NavLink>
                        <NavLink to="/drivers" className={navClass}>Drivers</NavLink>
                    </div>
                </div>

                <div className="hidden items-center gap-4 md:flex">
                    <span className="max-w-40 truncate text-sm text-gray-300">{admin?.name}</span>
                    <button onClick={signOut} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-red-600 px-3 text-sm font-medium hover:bg-red-700">
                        <LogOut className="h-4 w-4" />Logout
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => setMenuOpen((open) => !open)}
                    aria-expanded={menuOpen}
                    aria-label="Toggle admin navigation"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-gray-200 hover:bg-gray-800 md:hidden"
                >
                    {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {menuOpen && (
                <div className="border-t border-gray-800 px-4 pb-4 pt-3 md:hidden">
                    <div className="space-y-1">
                        <NavLink to="/" end className={navClass} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
                        <NavLink to="/bookings" className={navClass} onClick={() => setMenuOpen(false)}>Bookings</NavLink>
                        <NavLink to="/drivers" className={navClass} onClick={() => setMenuOpen(false)}>Drivers</NavLink>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3 border-t border-gray-800 pt-3">
                        <span className="min-w-0 truncate text-sm text-gray-300">{admin?.name}</span>
                        <button onClick={signOut} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-medium">
                            <LogOut className="h-4 w-4" />Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
