import React from "react";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [admin, setAdmin] = useState(
        JSON.parse(localStorage.getItem("adminUser")) || null
    );

    const login = (token, adminData) => {
        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminUser", JSON.stringify(adminData));
        setAdmin(adminData);
    };

    const logout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        setAdmin(null);
    };

    return (
        <AuthContext.Provider value={{ admin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
