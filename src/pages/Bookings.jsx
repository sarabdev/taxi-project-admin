import React, { useEffect, useState } from "react";
import { ExternalLink, X } from "lucide-react";
import api from "../api/api";
import Navbar from "../components/Navbar";

const STATUS_COLORS = {
    draft: "bg-gray-100 text-gray-700",
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    driver_assigned: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-gray-200 text-gray-700",
};

const STATUS_OPTIONS = {
    draft: ["confirmed", "cancelled"],
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

const displayValue = (value) => value === null || value === undefined || value === "" ? "—" : value;

function DetailItem({ label, children, wide = false }) {
    return (
        <div className={wide ? "sm:col-span-2" : ""}>
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</dt>
            <dd className="mt-1 break-words text-sm font-medium text-gray-800">{children}</dd>
        </div>
    );
}

function BookingDetails({ booking, onClose, formatDateTime }) {
    useEffect(() => {
        if (!booking) return undefined;
        const previousOverflow = document.body.style.overflow;
        const closeOnEscape = (event) => event.key === "Escape" && onClose();
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", closeOnEscape);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", closeOnEscape);
        };
    }, [booking, onClose]);

    if (!booking) return null;

    const customerName = booking.customerName || booking.websiteUser?.fullName || booking.user?.name;
    const customerEmail = booking.customerEmail || booking.websiteUser?.email || booking.user?.email;
    const customerPhone = booking.customerPhone || booking.websiteUser?.phone || booking.user?.phone;
    const money = `${booking.currency === "GBP" || !booking.currency ? "£" : `${booking.currency} `}${Number(booking.amount || 0).toFixed(2)}`;
    const created = booking.createdAt ? new Date(booking.createdAt).toLocaleString() : "—";
    const updated = booking.updatedAt ? new Date(booking.updatedAt).toLocaleString() : "—";

    return (
        <div className="fixed inset-0 z-[60] flex items-stretch justify-center bg-gray-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-6" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
            <section role="dialog" aria-modal="true" aria-labelledby="booking-details-title" className="flex h-[100dvh] w-full max-w-3xl flex-col overflow-hidden bg-white shadow-2xl sm:h-auto sm:max-h-[92dvh] sm:rounded-2xl">
                <header className="flex items-start justify-between gap-4 border-b px-4 py-4 sm:px-6">
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-blue-600">Booking reference</p>
                        <h2 id="booking-details-title" className="break-all text-xl font-bold text-gray-900 sm:text-2xl">{booking._id}</h2>
                    </div>
                    <button type="button" onClick={onClose} aria-label="Close booking details" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100">
                        <X className="h-6 w-6" />
                    </button>
                </header>

                <div className="overflow-y-auto p-4 sm:p-6">
                    <div className="space-y-5">
                        <section className="rounded-xl border border-gray-200 p-4">
                            <h3 className="mb-4 font-semibold text-gray-900">Customer</h3>
                            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <DetailItem label="Name">{displayValue(customerName)}</DetailItem>
                                <DetailItem label="Phone">{displayValue(customerPhone)}</DetailItem>
                                <DetailItem label="Email" wide><span className="break-all">{displayValue(customerEmail)}</span></DetailItem>
                                <DetailItem label="WhatsApp ID">{displayValue(booking.user?.whatsappId)}</DetailItem>
                                <DetailItem label="Source"><span className="capitalize">{displayValue(booking.source)}</span></DetailItem>
                            </dl>
                        </section>

                        <section className="rounded-xl border border-gray-200 p-4">
                            <h3 className="mb-4 font-semibold text-gray-900">Journey</h3>
                            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <DetailItem label="Pickup address" wide>{displayValue(booking.fromAddress)}</DetailItem>
                                <DetailItem label="Drop-off address" wide>{displayValue(booking.toAddress)}</DetailItem>
                                <DetailItem label="Pickup">{formatDateTime(booking.bookingDate, booking.bookingTime)}</DetailItem>
                                <DetailItem label="Return">{booking.returnDate && booking.returnTime ? formatDateTime(booking.returnDate, booking.returnTime) : "One way"}</DetailItem>
                                <DetailItem label="Passengers">{displayValue(booking.numberOfPersons)}</DetailItem>
                                <DetailItem label="Suitcases">{displayValue(booking.luggage)}</DetailItem>
                                <DetailItem label="Vehicle"><span className="capitalize">{displayValue(booking.carType)}</span></DetailItem>
                            </dl>
                        </section>

                        <section className="rounded-xl border border-gray-200 p-4">
                            <h3 className="mb-4 font-semibold text-gray-900">Payment and booking</h3>
                            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <DetailItem label="Fare">{money}</DetailItem>
                                <DetailItem label="Payment status"><span className="capitalize">{displayValue(booking.paymentStatus)}</span></DetailItem>
                                <DetailItem label="Payment method"><span className="capitalize">{displayValue(booking.paymentMethod)}</span></DetailItem>
                                <DetailItem label="Booking status"><span className="capitalize">{displayValue(booking.status)?.replace?.("_", " ") || "—"}</span></DetailItem>
                                <DetailItem label="Stripe payment intent" wide><span className="break-all">{displayValue(booking.stripePaymentIntentId)}</span></DetailItem>
                                <DetailItem label="Stripe session" wide><span className="break-all">{displayValue(booking.stripeSessionId)}</span></DetailItem>
                                <DetailItem label="Stripe customer"><span className="break-all">{displayValue(booking.stripeCustomerId)}</span></DetailItem>
                                <DetailItem label="Stripe charge"><span className="break-all">{displayValue(booking.stripeChargeId)}</span></DetailItem>
                                <DetailItem label="Receipt" wide>
                                    {booking.stripeReceiptUrl ? <a href={booking.stripeReceiptUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline">Open Stripe receipt <ExternalLink className="h-4 w-4" /></a> : "—"}
                                </DetailItem>
                                <DetailItem label="Created">{created}</DetailItem>
                                <DetailItem label="Last updated">{updated}</DetailItem>
                            </dl>
                        </section>

                        <section className="rounded-xl border border-gray-200 p-4">
                            <h3 className="mb-4 font-semibold text-gray-900">Assigned driver</h3>
                            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <DetailItem label="Name">{displayValue(booking.driver?.name)}</DetailItem>
                                <DetailItem label="Phone">{displayValue(booking.driver?.phone)}</DetailItem>
                                <DetailItem label="Vehicle">{displayValue(booking.driver?.carModel)}</DetailItem>
                                <DetailItem label="Registration">{displayValue(booking.driver?.carNumber)}</DetailItem>
                                <DetailItem label="Active">{booking.driver ? (booking.driver.isActive ? "Yes" : "No") : "—"}</DetailItem>
                                <DetailItem label="Notes" wide>{displayValue(booking.driver?.notes)}</DetailItem>
                            </dl>
                        </section>
                    </div>
                </div>
            </section>
        </div>
    );
}


export default function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);

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

        // Check if it's a standard ISO date (YYYY-MM-DD)
        const isStandardDate = /^\d{4}-\d{2}-\d{2}$/.test(date);

        if (!isStandardDate) {
            // If it's a custom string like "Today" or "ASAP", return as is
            return `${date} ${time}`;
        }

        try {
            const d = new Date(`${date}T${time}`);
            if (isNaN(d.getTime())) return `${date} ${time}`; // Fallback if invalid

            return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            })}`;
        } catch {
            return `${date} ${time}`;
        }
    };

    return (
        <>
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
                <div className="mb-5 flex items-end justify-between gap-4 sm:mb-6">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-semibold">Bookings</h2>
                        <p className="mt-1 text-sm text-gray-500">{filteredBookings.length} booking{filteredBookings.length === 1 ? "" : "s"}</p>
                    </div>
                </div>

                {/* FILTERS */}
                <div className="mb-6 grid grid-cols-1 gap-3 rounded-xl border bg-white p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-center">
                    <select
                        aria-label="Filter by booking status"
                        className="min-h-12 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base sm:text-sm"
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
                        aria-label="Filter by booking source"
                        className="min-h-12 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base sm:text-sm"
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
                        className="min-h-11 rounded-lg px-3 text-sm font-medium text-blue-600 hover:bg-blue-50"
                    >
                        Reset Filters
                    </button>
                </div>

                {/* MOBILE BOOKING CARDS */}
                <div className="space-y-4 md:hidden">
                    {loading ? (
                        <div className="rounded-xl border bg-white p-5 text-gray-500 shadow-sm">Loading bookings…</div>
                    ) : filteredBookings.length === 0 ? (
                        <div className="rounded-xl border bg-white p-5 text-gray-500 shadow-sm">No bookings found.</div>
                    ) : filteredBookings.map((b) => {
                        const customerName = b.customerName || b.websiteUser?.fullName || b.user?.name || "—";
                        const customerEmail = b.customerEmail || b.websiteUser?.email || "";
                        const customerPhone = b.customerPhone || b.user?.phone || "";
                        const status = b.status || "pending";

                        return (
                            <article key={b._id} className="overflow-hidden rounded-xl border bg-white shadow-sm">
                                <div className="flex items-start justify-between gap-3 border-b bg-gray-50 p-4">
                                    <div className="min-w-0">
                                        <h3 className="break-words font-semibold text-gray-900">{customerName}</h3>
                                        <p className="mt-1 text-xs text-gray-500">Ref: {b._id.slice(-8).toUpperCase()}</p>
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <p className="font-bold text-gray-900">{b.currency === "GBP" || !b.currency ? "£" : `${b.currency} `}{Number(b.amount || 0).toFixed(2)}</p>
                                        <span className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${PAYMENT_COLORS[b.paymentStatus] || "bg-gray-100 text-gray-700"}`}>
                                            {b.paymentStatus || "—"}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4 p-4 text-sm">
                                    {(customerEmail || customerPhone) && (
                                        <div className="space-y-1 text-gray-600">
                                            {customerEmail && <p className="break-all">{customerEmail}</p>}
                                            {customerPhone && <p className="break-words">{customerPhone}</p>}
                                        </div>
                                    )}

                                    <div className="rounded-lg bg-gray-50 p-3 text-gray-700">
                                        <p className="break-words"><strong>From:</strong> {b.fromAddress}</p>
                                        <p className="mt-2 break-words"><strong>To:</strong> {b.toAddress}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Pickup</p>
                                            <p className="mt-1 break-words">{formatDateTime(b.bookingDate, b.bookingTime)}</p>
                                            {b.returnDate && b.returnTime && <p className="mt-1 break-words text-xs text-gray-500">Return: {formatDateTime(b.returnDate, b.returnTime)}</p>}
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Trip</p>
                                            <p className="mt-1">{b.numberOfPersons ?? 1} passenger(s)</p>
                                            <p>{b.luggage ?? 0} suitcase(s)</p>
                                            <p className="capitalize">{b.carType || "—"}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 border-t pt-4">
                                        <button type="button" onClick={() => setSelectedBooking(b)} className="min-h-11 rounded-lg border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-700 hover:bg-blue-100">
                                            View full details
                                        </button>
                                        <label className="text-xs font-semibold text-gray-600">Booking status
                                            {STATUS_OPTIONS[status]?.length ? (
                                                <select className={`mt-1.5 min-h-12 w-full rounded-lg border px-3 text-base font-medium ${STATUS_COLORS[status] || "bg-gray-100 text-gray-700"}`} defaultValue={status} onChange={(e) => updateStatus(b._id, e.target.value)}>
                                                    <option value={status}>{status.replace("_", " ")}</option>
                                                    {STATUS_OPTIONS[status].map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                                                </select>
                                            ) : (
                                                <span className={`mt-1.5 block rounded-lg px-3 py-3 text-sm font-medium capitalize ${STATUS_COLORS[status] || "bg-gray-100 text-gray-700"}`}>{status.replace("_", " ")}</span>
                                            )}
                                        </label>

                                        <label className="text-xs font-semibold text-gray-600">Driver
                                            {b.driver ? (
                                                <span className="mt-1.5 block rounded-lg bg-green-50 px-3 py-3 text-sm font-medium text-green-700">{b.driver.name}</span>
                                            ) : (
                                                <select aria-label={`Assign driver to ${customerName}`} className="mt-1.5 min-h-12 w-full rounded-lg border border-gray-300 bg-white px-3 text-base" defaultValue="" onChange={(e) => assignDriver(b._id, e.target.value)}>
                                                    <option value="" disabled>Assign Driver</option>
                                                    {drivers.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
                                                </select>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {/* TABLE */}
                <div className="hidden overflow-x-auto rounded-xl border bg-white shadow-sm md:block">
                    {loading ? (
                        <p className="p-6 text-gray-500">Loading bookings…</p>
                    ) : filteredBookings.length === 0 ? (
                        <p className="p-6 text-gray-500">No bookings found.</p>
                    ) : (
                        <table className="min-w-[1100px] text-sm">
                            <thead className="bg-gray-100 text-gray-600">
                                <tr>
                                    <th className="p-3 text-left">Customer</th>
                                    <th className="p-3 text-left">Route</th>
                                    <th className="p-3 text-left">Date / Time</th>
                                    <th className="p-3 text-left">Trip Details</th>
                                    <th className="p-3 text-center">Fare</th>
                                    <th className="p-3 text-center">Source</th>
                                    <th className="p-3 text-center">Payment</th>
                                    <th className="p-3 text-center">Status</th>
                                    <th className="p-3 text-center">Driver</th>
                                    <th className="p-3 text-center">Details</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredBookings.map((b) => (
                                    <tr key={b._id} className="border-t hover:bg-gray-50">
                                        {/* CUSTOMER */}
                                        <td className="p-3">
                                            <div className="font-medium">
                                                {b.customerName || b.websiteUser?.fullName || b.user?.name || "—"}
                                            </div>
                                            <div className="text-gray-500 text-xs">
                                                {b.customerEmail || b.websiteUser?.email || ""}
                                            </div>
                                            {(b.customerPhone || b.user?.phone) && (
                                                <div className="text-gray-500 text-xs mt-1">
                                                    {b.customerPhone || b.user?.phone}
                                                </div>
                                            )}
                                            <div className="text-gray-400 text-[11px] mt-1">
                                                Ref: {b._id.slice(-8).toUpperCase()}
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

                                        {/* TRIP REQUIREMENTS */}
                                        <td className="p-3 text-xs whitespace-nowrap">
                                            <div><strong>Passengers:</strong> {b.numberOfPersons ?? 1}</div>
                                            <div className="mt-1"><strong>Suitcases:</strong> {b.luggage ?? 0}</div>
                                            <div className="mt-1 capitalize"><strong>Vehicle:</strong> {b.carType || "—"}</div>
                                        </td>

                                        {/* FARE */}
                                        <td className="p-3 text-center whitespace-nowrap">
                                            <div className="font-semibold text-gray-900">
                                                {b.currency === "GBP" || !b.currency ? "£" : `${b.currency} `}
                                                {Number(b.amount || 0).toFixed(2)}
                                            </div>
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
                                        <td className="p-3 text-center">
                                            <button type="button" onClick={() => setSelectedBooking(b)} className="min-h-9 whitespace-nowrap rounded-lg bg-blue-50 px-3 text-xs font-semibold text-blue-700 hover:bg-blue-100">
                                                View details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <BookingDetails booking={selectedBooking} onClose={() => setSelectedBooking(null)} formatDateTime={formatDateTime} />
            </main>
        </>
    );
}
