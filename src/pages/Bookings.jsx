import React, { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

const STATUS_COLORS = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    driver_assigned: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-gray-200 text-gray-700",
};

const STATUS_OPTIONS = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["driver_assigned", "cancelled"],
    driver_assigned: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
};

const PAYMENT_COLORS = {
    paid: "bg-green-100 text-green-700",
    unpaid: "bg-yellow-100 text-yellow-700",
    refunded: "bg-red-100 text-red-700",
};


export default function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [statusFilter, setStatusFilter] = useState("");
    const [sourceFilter, setSourceFilter] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            const [b, d] = await Promise.all([
                api.get("/admin/bookings"),
                api.get("/drivers"),
            ]);
            setBookings(b.data.bookings || []);
            setDrivers(d.data.drivers || []);
        } catch (err) {
            console.error("Load bookings error", err);
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(bookingId, status) {
        try {
            await api.patch(`/admin/bookings/${bookingId}/status`, { status });
            loadData();
        } catch {
            alert("Failed to update status");
        }
    }

    async function assignDriver(bookingId, driverId) {
        try {
            await api.patch(`/admin/bookings/${bookingId}/assign-driver`, {
                driverId,
            });
            loadData();
        } catch {
            alert("Failed to assign driver");
        }
    }

    const filteredBookings = bookings.filter((b) => {
        if (statusFilter && b.status !== statusFilter) return false;
        if (sourceFilter && b.source !== sourceFilter) return false;
        return true;
    });

    const formatDateTime = (date, time) => {
        if (!date || !time) return "—";
        const d = new Date(`${date}T${time}`);
        return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        })}`;
    };

    return (
        <>
            <Navbar />

            <div className="p-6 max-w-7xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6">Bookings</h2>

                {/* FILTERS */}
                <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-4 items-center">
                    <select
                        className="border rounded px-3 py-2 text-sm"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Status</option>
                        {Object.keys(STATUS_COLORS).map((s) => (
                            <option key={s} value={s}>
                                {s.replace("_", " ")}
                            </option>
                        ))}
                    </select>

                    <select
                        className="border rounded px-3 py-2 text-sm"
                        value={sourceFilter}
                        onChange={(e) => setSourceFilter(e.target.value)}
                    >
                        <option value="">All Sources</option>
                        <option value="website">Website</option>
                        <option value="whatsapp">WhatsApp</option>
                    </select>

                    <button
                        onClick={() => {
                            setStatusFilter("");
                            setSourceFilter("");
                        }}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Reset Filters
                    </button>
                </div>

                {/* TABLE */}
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    {loading ? (
                        <p className="p-6 text-gray-500">Loading bookings…</p>
                    ) : filteredBookings.length === 0 ? (
                        <p className="p-6 text-gray-500">No bookings found.</p>
                    ) : (
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-100 text-gray-600">
                                <tr>
                                    <th className="p-3 text-left">Customer</th>
                                    <th className="p-3 text-left">Route</th>
                                    <th className="p-3 text-left">Date / Time</th>
                                    <th className="p-3 text-center">Source</th>
                                    <th className="p-3 text-center">Payment</th>
                                    <th className="p-3 text-center">Status</th>
                                    <th className="p-3 text-center">Driver</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredBookings.map((b) => (
                                    <tr key={b._id} className="border-t hover:bg-gray-50">
                                        {/* CUSTOMER */}
                                        <td className="p-3">
                                            <div className="font-medium">
                                                {b.websiteUser?.fullName || b.user?.name || "—"}
                                            </div>
                                            <div className="text-gray-500 text-xs">
                                                {b.websiteUser?.email || b.user?.phone || ""}
                                            </div>
                                        </td>


                                        {/* ROUTE */}
                                        <td className="p-3 text-xs">
                                            <div>
                                                <strong>From:</strong> {b.fromAddress}
                                            </div>
                                            <div className="mt-1">
                                                <strong>To:</strong> {b.toAddress}
                                            </div>
                                        </td>

                                        {/* DATE */}
                                        <td className="p-3 text-xs">
                                            <div>{formatDateTime(b.bookingDate, b.bookingTime)}</div>

                                            {(b.returnDate && b.returnTime) && (
                                                <div className="text-gray-500 mt-1">
                                                    Return: {formatDateTime(b.returnDate, b.returnTime)}
                                                </div>
                                            )}
                                        </td>




                                        {/* SOURCE */}
                                        <td className="p-3 text-center capitalize">
                                            {b.source}
                                        </td>


                                        {/* 💳 PAYMENT STATUS */}
                                        <td className="p-3 text-center">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${PAYMENT_COLORS[b.paymentStatus] ||
                                                    "bg-gray-100 text-gray-700"
                                                    }`}
                                            >
                                                {b.paymentStatus || "—"}
                                            </span>
                                        </td>

                                        {/* STATUS */}
                                        <td className="p-3 text-center">
                                            {STATUS_OPTIONS[b.status]?.length ? (
                                                <select
                                                    className={`border rounded px-2 py-1 text-xs font-medium ${STATUS_COLORS[b.status]}`}
                                                    defaultValue={b.status}
                                                    onChange={(e) =>
                                                        updateStatus(b._id, e.target.value)
                                                    }
                                                >
                                                    <option value={b.status}>
                                                        {b.status.replace("_", " ")}
                                                    </option>
                                                    {STATUS_OPTIONS[b.status].map((s) => (
                                                        <option key={s} value={s}>
                                                            {s.replace("_", " ")}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[b.status]}`}
                                                >
                                                    {b.status.replace("_", " ")}
                                                </span>
                                            )}
                                        </td>

                                        {/* DRIVER */}
                                        <td className="p-3 text-center">
                                            {b.driver ? (
                                                <span className="text-green-700 text-xs font-medium">
                                                    {b.driver.name}
                                                </span>
                                            ) : (
                                                <select
                                                    className="border rounded px-2 py-1 text-xs"
                                                    defaultValue=""
                                                    onChange={(e) =>
                                                        assignDriver(b._id, e.target.value)
                                                    }
                                                >
                                                    <option value="" disabled>
                                                        Assign Driver
                                                    </option>
                                                    {drivers.map((d) => (
                                                        <option key={d._id} value={d._id}>
                                                            {d.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
}
