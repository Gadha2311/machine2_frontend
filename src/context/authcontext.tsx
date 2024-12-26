import {  createContext, useContext, useEffect, useState } from "react";
import {
  AuthContextType,
  AuthProviderProps,
} from "../interface/authInterface";

const Authcontext = createContext<AuthContextType>({
  tocken: null,
  isAuthenticated: false,
  userData: null,
  login: () => {},
  logout: () => {},
  setUserdata: () => {},
  config: {
    headers: {
      Authorization: "",
    },
  },
});

export const Authprovider = ({ children }: AuthProviderProps) => {
  const [tocken, setTocken] = useState<string | null>(null);
  const [userData, setUserdata] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem(userData) || "{}");
    if (storedData.userToken && storedData.user) {
      setIsAuthenticated(true);
      setTocken(storedData.userToken);
      setUserdata(storedData.user);
    }
  }, []);
  const login = (newTocken: string, newData: any) => {
    console.log("in login");
    console.log(newTocken);
    
    localStorage.setItem(
      "user_data",
      JSON.stringify({ userTocken: newTocken, user: newData })
    );
    setTocken(newTocken);
    setUserdata(newData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("user_data");
    setTocken(null);
    setUserdata(null);
    setIsAuthenticated(false);
  };
  const config = {
    headers: {
      Authorization: `Bearer ${tocken}`,
    },
  };
  return (
    <Authcontext.Provider
      value={{
        tocken,
        config,
        isAuthenticated,
        userData,
        login,
        logout,
        setUserdata,
      }}
    >
      {children}
    </Authcontext.Provider>
  );
  
};

export const useAuth=()=>{
  const context=useContext(Authcontext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an Authprovider");
  }

  return context;
}