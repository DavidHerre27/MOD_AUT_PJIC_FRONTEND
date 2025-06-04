import React from "react";
import {
  Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Box
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useNavigate, useLocation } from "react-router-dom";
import poliLogo from "../assets/logo-poli.png";

const drawerWidth = 240;

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar si es superusuario
  const esSuperusuario = localStorage.getItem("es_superusuario") === "true";

  // Opciones base
  const opcionesBase = [
    { texto: "Inicio", ruta: "/inicio", icono: <HomeIcon /> },
    { texto: "Historial", ruta: "/historial", icono: <HistoryIcon /> },
    { texto: "Configuración", ruta: "/configuracion", icono: <SettingsIcon /> },
    { texto: "Errores", ruta: "/errores", icono: <ReportProblemIcon /> },
  ];

  // Agregar "Crear Usuario" solo si es superusuario
  if (esSuperusuario) {
    opcionesBase.splice(1, 0, {
      texto: "Crear Usuario",
      ruta: "/crear-usuario",
      icono: <PersonAddIcon />,
    });
  }

  // Agregar opción de cerrar sesión
  opcionesBase.push({
    texto: "Cerrar sesión",
    ruta: "/login",
    icono: <LogoutIcon />,
    logout: true,
  });

  const manejarNavegacion = (opcion) => {
    if (opcion.logout) {
      localStorage.clear();
    }
    navigate(opcion.ruta);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#00441f",
          color: "white",
        },
      }}
    >
      <Box p={2} textAlign="center">
        <img src={poliLogo} alt="Logo Poli" style={{ width: "100px", marginBottom: "16px" }} />
      </Box>
      <List>
        {opcionesBase.map((opcion) => (
          <ListItem key={opcion.texto} disablePadding>
            <ListItemButton
              onClick={() => manejarNavegacion(opcion)}
              selected={location.pathname === opcion.ruta}
              sx={{
                "&.Mui-selected": { backgroundColor: "#005026" },
                "&:hover": { backgroundColor: "#006837" },
                color: "white",
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>{opcion.icono}</ListItemIcon>
              <ListItemText primary={opcion.texto} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;