import { ReactNode } from "react";

export interface AuthContextType {
    tocken: string | null;
    isAuthenticated: boolean;
    userData: any | null;
    login: (newToken: string, newData: any) => void;
    logout: () => void;
    setUserdata: (data: any) => void;
    config: {
      headers: {
        Authorization: string;
      };
    };
  }
  export interface AuthProviderProps {children:ReactNode}

  export interface AuthRouteProps {
    children: React.ReactNode;
  }

  export interface ProtectedRouteProps {
    children: React.ReactNode;
  }