import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../types/User";

export type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  // login: (email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => void; 
  logout: () => void; 
}

export const AuthContext = createContext<AuthContextType>(null!);

export default AuthContext;

export const AuthProvider = ( { children }: { children: JSX.Element } ) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

    const login = (email: string, password: string) => {
      console.log("login auth", { email, password });

      if (password === 'secret') {
        // setUser({ id: '123', email });
        navigate("/");
      }
    }
  
    const logout = () => {
      console.log('logout');
      setUser(null);
      navigate("/");
    }

    return(
        <AuthContext.Provider value={{isAuthenticated: !!user, user, login, logout}}>
          {children}
        </AuthContext.Provider>
    )
}