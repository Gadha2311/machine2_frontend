import React from "react";
import { Button } from "@mui/material";
import { useAuth } from "../context/authcontext"; 

const Sidebar: React.FC = () => {
  const { logout } = useAuth(); 

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <aside
      style={{ backgroundColor: "#f0f0f0" }} 
      className="w-full p-6 sm:w-60 text-gray-800"
    >
      <nav className="space-y-8 text-sm">
        
        <Button
          variant="contained"
          color="error"
          onClick={handleLogout}
          sx={{
            marginTop: "20px",
            padding: "10px 40px",
            fontSize: "16px",
          }}
        >
          Logout
        </Button>
      </nav>
    </aside>
  );
};

export default Sidebar;
