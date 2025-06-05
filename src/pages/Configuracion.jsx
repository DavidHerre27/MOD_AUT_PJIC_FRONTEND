import React, { useState, useEffect } from "react";
import {
  Box, Typography, TextField, Button, Snackbar, Alert, Paper, Stack
} from "@mui/material";
import axios from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function Configuracion() {
  const navigate = useNavigate();
  const usuarioActual = localStorage.getItem("usuario") || "";
  const dependenciaActual = localStorage.getItem("dependencia") || "";
  const [clave, setClave] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!usuarioActual || !dependenciaActual) {
      navigate("/login", { replace: true });
    }
  }, [usuarioActual, dependenciaActual, navigate]);

  const guardarCredenciales = async () => {
  try {
    const payload = {
      usuario_sistema: usuarioActual,               // Usuario logueado
      gt_usuario: usuarioActual,                   // Usuario en Gestión Transparente
      gt_clave: clave,                  // Clave visible que será encriptada por el backend
      dependencia: dependenciaActual
    };

    await axios.post("https://mod-aut-pjic.onrender.com/guardar_credenciales", payload);
    setMensaje("✔️ Credenciales guardadas correctamente");
  } catch (err) {
    console.error("❌ Error al guardar credenciales:", err);
    setMensaje("❌ Error al guardar credenciales");
  } finally {
    setOpen(true);
  }
};

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="#005026" mb={3}>
          Configuración de Usuario
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Usuario de la Plataforma"
            value={usuarioActual}
            disabled
            fullWidth
          />

          <TextField
            label="Dependencia"
            value={dependenciaActual}
            disabled
            fullWidth
          />

          <TextField
            label="Clave"
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            fullWidth
          />

          <Button
            variant="contained"
            onClick={guardarCredenciales}
            sx={{ backgroundColor: '#005026', '&:hover': { backgroundColor: '#00441f' } }}
          >
            Guardar Cambios
          </Button>
        </Stack>
      </Paper>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={mensaje.startsWith("✔️") ? "success" : "error"}>{mensaje}</Alert>
      </Snackbar>
    </Box>
  );
}

export default Configuracion;