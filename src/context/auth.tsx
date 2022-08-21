import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoggedUser } from "../types/LoggedUser"; 
import { AuthContextType } from "../types/AuthContextType";

export const AuthContext = createContext<AuthContextType>(null!);
export default AuthContext;

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<LoggedUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Retrieve the user from localStorage if it exists
        const user = localStorage.getItem("user");
        if (user) {
            setUser(JSON.parse(user));
        } 

        setLoading(false);
    }, []);

    const login = (email: string, password: string) => {
        console.log("login auth", { email, password });

        const loggedUser = {
            id: "123",
            name: "jorgin",
            email,
            token: "assa"
        };

        localStorage.setItem("user", JSON.stringify(loggedUser));

        if (password === "secret") {
            setUser(loggedUser);
            navigate("/");
        }
    };

    const logout = () => {
        console.log("logout");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated: !!user, user, loading, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};
