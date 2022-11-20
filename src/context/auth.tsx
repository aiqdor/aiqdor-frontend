import React, { createContext, useEffect, useState } from "react";
import firebase from "firebase/app";
import { auth, db } from "../firebaseSetup"
import { useNavigate } from "react-router-dom";
import { LoggedUser } from "../types/LoggedUser"; 
import { AuthContextType } from "../types/AuthContextType";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DoorBackOutlined } from "@mui/icons-material";

export const AuthContext = createContext<AuthContextType>(null!);
export default AuthContext;

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<firebase.User | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Retrieve the user from localStorage if it exists
        const user = localStorage.getItem("authUser");
        if (user) {
            setUser(JSON.parse(user));
        } 

        const isAdmin = localStorage.getItem("isAdmin");
        if (isAdmin) {
            setIsAdmin(JSON.parse(isAdmin));
        }    

        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            await auth.signInWithEmailAndPassword(
              email,
              password
            );

            const userData = await db.collection("users").doc(auth.currentUser?.uid).get();
            const userInfo = await userData.data() as LoggedUser;
            setIsAdmin(userInfo.admin);

            localStorage.setItem("isAdmin", JSON.stringify(userInfo.admin));
            localStorage.setItem('authUser', JSON.stringify(auth.currentUser));
            setUser(auth.currentUser);
            navigate(isAdmin ? "/admin" : "/");
          } catch (error) {
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

    const logout = async () => {
        localStorage.removeItem('authUser');
        localStorage.removeItem('isAdmin');
        await auth.signOut();
        setUser(null);
        setIsAdmin(false);
        navigate("/login");
    };

    const createAccount = async (firstName: string, lastName: string, email: string, password: string, confirmPassword: string, phoneNumber: string, isOwner: boolean) => {
        if (password !== confirmPassword) {
            toast.error('As senhas não conferem!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
            return;
        }
        
        try {
            await auth.createUserWithEmailAndPassword(
                email,
                password
            ).then((userCredential) => {
                const user = userCredential.user;            
                db.collection("users").doc(user?.uid).set({
                    firstName,
                    lastName,
                    email,
                    phoneNumber,
                    createdAt: new Date(),
                    admin: false,
                    isOwner,
                });
            });

            await auth.currentUser?.updateProfile({
                displayName: firstName + " " + lastName,
            });

            toast.success('Conta criada com sucesso!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            navigate("/login");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated: !!user, isAdmin, user, loading, login, logout, createAccount }}
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
