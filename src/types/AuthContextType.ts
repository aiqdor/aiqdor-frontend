import firebase from "firebase/app";

export type AuthContextType = {
    isAuthenticated: boolean;
    isAdmin: boolean;
    user: firebase.User | null;
    loading: boolean;
    login: (email: string, password: string) => void;
    logout: (forceLogin?: boolean) => void;
    createAccount: (firstName: string, lastName: string, email: string, password: string, confirmPassword: string, phoneNumber: string, isOwner: boolean) => void;
};