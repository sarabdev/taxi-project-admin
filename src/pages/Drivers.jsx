import React from "react";

import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function Drivers() {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        phone: "",
        carModel: "",
        carNumber: "",
    });

    useEffect(() => {
        loadDrivers();
    }, []);

    async function loadDrivers() {
        try {
            setLoading(true);
            const res = await api.get("/drivers");
            setDrivers(res.data.drivers);
        } catch (err) {
            setError("Failed to load drivers");
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            await api.post("/drivers", form);
            setForm({
                name: "",
                phone: "",
                carModel: "",
                carNumber: "",
            });
            await loadDrivers();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create driver");
        }
    }

    return (
        <>
            <Navbar />

            <div className="p-6 max-w-6xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6">Drivers</h2>

                {/* ADD DRIVER */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">Add Driver</h3>

                    {error && (
                        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        <input
                            className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                            placeholder="Driver Name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            required
                        />

                        <input
                            className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                            placeholder="Phone Number"
                            value={form.phone}
                            onChange={(e) =>
                                setForm({ ...form, phone: e.target.value })
                            }
                            required
                        />

                        <input
                            className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                            placeholder="Car Model"
                            value={form.carModel}
                            onChange={(e) =>
                                setForm({ ...form, carModel: e.target.value })
                            }
                        />

                        <input
                            className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                            placeholder="Car Number"
                            value={form.carNumber}
                            onChange={(e) =>
                                setForm({ ...form, carNumber: e.target.value })
                            }
                        />

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-medium"
                            >
                                Add Driver
                            </button>
                        </div>
                    </form>
                </div>

                {/* DRIVER LIST */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Driver List</h3>

                    {loading && (
                        <p className="text-gray-500">Loading drivers...</p>
                    )}

                    {!loading && drivers.length === 0 && (
                        <p className="text-gray-500">No drivers found.</p>
                    )}

                    {!loading && drivers.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm border">
                                <thead className="bg-gray-100 text-gray-600">
                                    <tr>
                                        <th className="p-3 text-left">Name</th>
                                        <th className="p-3 text-left">Phone</th>
                                        <th className="p-3 text-left">Car</th>
                                        <th className="p-3 text-center">Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {drivers.map((d) => (
                                        <tr
                                            key={d._id}
                                            className="border-t hover:bg-gray-50"
                                        >
                                            <td className="p-3 font-medium">{d.name}</td>
                                            <td className="p-3">{d.phone}</td>
                                            <td className="p-3">
                                                {d.carModel || "-"}{" "}
                                                {d.carNumber && `(${d.carNumber})`}
                                            </td>
                                            <td className="p-3 text-center">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-medium ${d.isActive
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-200 text-gray-600"
                                                        }`}
                                                >
                                                    {d.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
