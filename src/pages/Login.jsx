import React, { useState } from "react";
import {
  Box, TextField, Button, Typography, Paper, Snackbar, Alert,
} from "@mui/material";
import axios from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();

  const data = new URLSearchParams();
  data.append("username", usuario);
  data.append("password", clave);

  try {
    const res = await axios.post("https://mod-aut-pjic.onrender.com/token", data);

    const {
      access_token,
      usuario,
      dependencia,
      es_superusuario
  } = res.data;

  localStorage.setItem("token", access_token);
  localStorage.setItem("usuario", usuario);
  localStorage.setItem("dependencia", dependencia);
  localStorage.setItem("es_superusuario", String(es_superusuario));

    navigate("/inicio");
  } catch (err) {
    console.error("❌ Error al iniciar sesión:", err);
    setError("❌ Error al iniciar sesión");
  }
};

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#e6f2e6"
    >
      <Paper elevation={4} sx={{ p: 6, borderRadius: 4, width: 360 }}>
        <Typography variant="h5" fontWeight="bold" mb={3} align="center">
          Iniciar sesión
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Usuario"
            fullWidth
            required
            margin="normal"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            required
            margin="normal"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              backgroundColor: "#005026",
              "&:hover": { backgroundColor: "#00441f" },
              fontWeight: "bold",
            }}
          >
            INGRESAR
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Login;