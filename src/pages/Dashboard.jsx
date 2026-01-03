import React from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Car } from "lucide-react";

import Navbar from "../components/Navbar";

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <>
            <Navbar />

            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-2">
                    Admin Dashboard
                </h1>
                <p className="text-gray-600 mb-8">
                    Manage bookings and drivers from one place.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                    {/* Bookings */}
                    <div
                        onClick={() => navigate("/bookings")}
                        className="group bg-white rounded-xl shadow-sm border p-6 cursor-pointer hover:shadow-lg hover:border-primary-600 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition">
                                <ClipboardList className="h-6 w-6" />
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg">
                                    Bookings
                                </h3>
                                <p className="text-sm text-gray-600">
                                    View, confirm, and manage all bookings
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Drivers */}
                    <div
                        onClick={() => navigate("/drivers")}
                        className="group bg-white rounded-xl shadow-sm border p-6 cursor-pointer hover:shadow-lg hover:border-primary-600 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition">
                                <Car className="h-6 w-6" />
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg">
                                    Drivers
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Add, assign, and manage drivers
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
