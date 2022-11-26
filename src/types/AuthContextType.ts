import firebase from "firebase/app";

export type AuthContextType = {
    isAuthenticated: boolean;
    isAdmin: boolean;
    isOwner: boolean;
    user: firebase.User | null;
    loading: boolean;
    login: (email: string, password: string) => void;
    createAccount: (firstName: string, lastName: string, email: string, password: string, confirmPassword: string, phoneNumber: string, isOwner: boolean) => Promise<void>;
    logout: (forceLogin?: boolean) => void;
};