import React, { createContext, useEffect, useState } from "react";
import firebase from "firebase/app";
import { auth } from "../firebaseSetup";
import { useNavigate } from "react-router-dom";
import { LoggedUser } from "../types/LoggedUser"; 
import { AuthContextType } from "../types/AuthContextType";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AuthContext = createContext<AuthContextType>(null!);
export default AuthContext;

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<firebase.User  | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((firebaseUser: firebase) => {
            setUser(firebaseUser);
        });

        return unsubscribe;

        
        // // Retrieve the user from localStorage if it exists
        // const user = localStorage.getItem("user");
        // if (user) {
        //     setUser(JSON.parse(user));
        // } 

        // setLoading(false);
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
        } else {
            toast.error('Email ou senha incorreta!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
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
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </AuthContext.Provider>
    );
};
