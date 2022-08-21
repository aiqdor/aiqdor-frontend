import { LoggedUser } from "./LoggedUser";

export type AuthContextType = {
    isAuthenticated: boolean;
    user: LoggedUser | null;
    loading: boolean;
    // login: (email: string, password: string) => Promise<boolean>;
    login: (email: string, password: string) => void;
    logout: () => void;
};