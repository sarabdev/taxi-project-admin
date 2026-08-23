import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Car, Settings } from "lucide-react";

import api from "../api/api";
import Navbar from "../components/Navbar";

export default function Dashboard() {
    const navigate = useNavigate();

    const [pricePerMile, setPricePerMile] = useState("");
    const [initialPrice, setInitialPrice] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {
        try {
            const res = await api.get("/admin/settings");
            const value = res.data.settings?.perMilePrice ?? "";
            setPricePerMile(value);
            setInitialPrice(value);
        } catch (err) {
            console.error("Failed to load settings", err);
        }
    }

    async function saveSettings() {
        try {
            setSaving(true);
            await api.post("/admin/settings", {
                perMilePrice: Number(pricePerMile),
            });
            setInitialPrice(pricePerMile);
        } catch {
            alert("Failed to save price");
        } finally {
            setSaving(false);
        }
    }

    const hasChanges = String(pricePerMile) !== String(initialPrice);

    return (
        <>
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
                <h1 className="text-2xl sm:text-3xl font-semibold mb-1">
                    Admin Dashboard
                </h1>
                <p className="text-gray-600 mb-6 sm:mb-8">
                    Manage bookings, drivers, and pricing
                </p>

                {/* ⚙️ PRICING SETTINGS */}
                <div className="bg-white border rounded-xl p-4 sm:p-6 mb-8 sm:mb-10 max-w-md shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Settings className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-lg">
                            Pricing Settings
                        </h3>
                    </div>

                    <label className="block text-sm text-gray-600 mb-1">
                        Price per mile
                    </label>

                    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={pricePerMile}
                            onChange={(e) => setPricePerMile(e.target.value)}
                            className="min-h-12 w-full rounded-lg border px-3 py-2 text-base sm:w-40
                                       focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. 2.50"
                        />

                        {/* ✅ SAVE BUTTON (VISIBLE) */}
                        <button
                            onClick={saveSettings}
                            disabled={!hasChanges || saving}
                            className="
                                min-h-12 px-4 py-2 text-sm font-medium rounded-lg
                                bg-blue-600 text-white
                                hover:bg-blue-700
                                disabled:opacity-50 disabled:cursor-not-allowed
                                transition
                            "
                        >
                            {saving ? "Saving…" : "Save"}
                        </button>
                    </div>

                    {!hasChanges && (
                        <p className="text-xs text-gray-400 mt-2">
                            No changes to save
                        </p>
                    )}
                </div>

                {/* 🚀 NAVIGATION CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                    {/* Bookings */}
                    <div
                        onClick={() => navigate("/bookings")}
                        className="group bg-white rounded-xl shadow-sm border cursor-pointer
                                   hover:shadow-lg hover:border-blue-600 transition-all p-4 sm:p-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-blue-50 transition group-hover:bg-blue-600">
                                <ClipboardList className="h-6 w-6 text-blue-600 group-hover:text-white" />
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg">
                                    Bookings
                                </h3>
                                <p className="text-sm text-gray-600">
                                    View, confirm, and manage bookings
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Drivers */}
                    <div
                        onClick={() => navigate("/drivers")}
                        className="group bg-white rounded-xl shadow-sm border cursor-pointer
                                   hover:shadow-lg hover:border-blue-600 transition-all p-4 sm:p-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-blue-50 transition group-hover:bg-blue-600">
                                <Car className="h-6 w-6 text-blue-600 group-hover:text-white" />
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
            </main>
        </>
    );
}
