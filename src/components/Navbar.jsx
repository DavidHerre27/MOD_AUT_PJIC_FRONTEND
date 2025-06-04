import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

function Navbar() {
  const usuario = localStorage.getItem("usuario") || "Usuario actual";
  const dependencia = localStorage.getItem("dependenciaSeleccionada") || "Sin dependencia";

  const fecha = new Date().toLocaleString("es-CO", {
    dateStyle: "short",
    timeStyle: "short"
  });

  return (
    <AppBar position="static" sx={{ backgroundColor: "#005026" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Sistema de Automatización RPA - Politécnico JIC</Typography>
        <Box textAlign="right">
          <Typography variant="body2">{usuario} - {dependencia}</Typography>
          <Typography variant="caption">{fecha}</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;