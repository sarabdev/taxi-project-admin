import React from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await api.post("/admin/login", { email, password });

            if (res.data?.success) {
                login(res.data.token, res.data.admin);
                navigate("/");
            } else {
                setError("Login failed");
            }
        } catch (err) {
            setError(
                err.response?.data?.message || "Invalid email or password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8"
            >
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-blue-600">
                        Taxi Admin
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Sign in to manage bookings
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3">
                        {error}
                    </div>
                )}

                {/* Email */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email address
                    </label>
                    <input
                        type="email"
                        placeholder="admin@taxi.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        required
                        className="w-full border rounded-lg px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500
              disabled:bg-gray-100"
                    />
                </div>

                {/* Password */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        required
                        className="w-full border rounded-lg px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500
              disabled:bg-gray-100"
                    />
                </div>

                {/* Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2.5 rounded-lg text-white font-medium transition
            ${loading
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                        }`}
                >
                    {loading ? "Signing in..." : "Sign in"}
                </button>

                {/* Footer */}
                <p className="text-xs text-gray-400 text-center mt-6">
                    © {new Date().getFullYear()} Taxi Booking System
                </p>
            </form>
        </div>
    );
}
