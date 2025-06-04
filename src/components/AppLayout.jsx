import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Box } from "@mui/material";

function AppLayout() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Barra lateral */}
      <Sidebar />

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          overflowY: "auto",
          width: "100%",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default AppLayout;