import React, { useState, useEffect } from "react";
import {
  Box, Typography, TextField, Button, Paper, Snackbar, Alert
} from "@mui/material";
import axios from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function CrearUsuario() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [dependencia, setDependencia] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [autorizado, setAutorizado] = useState(null); // null: cargando, false: denegado, true: permitido

  useEffect(() => {
    const esSuperusuario = localStorage.getItem("es_superusuario") === "true";
    if (!esSuperusuario) {
      setAutorizado(false);
      setMensaje({ tipo: "error", texto: "⛔ Acceso denegado: solo para superusuarios." });
      setTimeout(() => navigate("/inicio"), 2500);
    } else {
      setAutorizado(true);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/crear_usuario", {
        usuario,
        clave,
        dependencia
      });
      setMensaje({ tipo: "success", texto: "✅ Usuario creado correctamente" });
      setUsuario(""); setClave(""); setDependencia("");
    } catch (error) {
      if (error.response?.status === 403) {
        setMensaje({ tipo: "error", texto: "⛔ No tienes permisos para crear usuarios." });
        setTimeout(() => navigate("/inicio"), 2500);
      } else {
        setMensaje({ tipo: "error", texto: "❌ Error al crear usuario" });
      }
    }
  };

  // ⏳ Mientras se verifica el rol, no mostrar nada
  if (autorizado === null) return null;

  // ❌ Si no está autorizado, solo mostrar mensaje (redireccionará en segundos)
  if (autorizado === false) {
    return (
      <Snackbar open={true} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="error" variant="filled">⛔ Acceso denegado: solo para superusuarios.</Alert>
      </Snackbar>
    );
  }

  // ✅ Render normal si autorizado
  return (
    <Box display="flex" justifyContent="center" mt={5}>
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h6" mb={2}>Crear nuevo usuario</Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} margin="normal" />
          <TextField fullWidth label="Contraseña" value={clave} type="password" onChange={(e) => setClave(e.target.value)} margin="normal" />
          <TextField fullWidth label="Dependencia" value={dependencia} onChange={(e) => setDependencia(e.target.value)} margin="normal" />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, backgroundColor: "#005026" }}>Crear</Button>
        </form>
      </Paper>

      {mensaje && (
        <Snackbar
          open={!!mensaje}
          autoHideDuration={4000}
          onClose={() => setMensaje(null)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity={mensaje.tipo} variant="filled">{mensaje.texto}</Alert>
        </Snackbar>
      )}
    </Box>
  );
}

export default CrearUsuario;