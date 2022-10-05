import { LoggedUser } from "./LoggedUser";
import firebase from "firebase/app";

export type AuthContextType = {
    isAuthenticated: boolean;
    user: firebase.User | null;
    loading: boolean;
    // login: (email: string, password: string) => Promise<boolean>;
    login: (email: string, password: string) => void;
    logout: () => void;
};