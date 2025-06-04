import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";

function VistaContratos() {
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const dependencia = localStorage.getItem("dependenciaSeleccionada") || "Adquisiciones";

  useEffect(() => {
    const fetchContratos = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/contratos?dependencia=${dependencia}`);
        setContratos(res.data);
      } catch (error) {
        console.error("❌ Error al cargar los contratos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContratos();
  }, [dependencia]);

  const iniciarAutomatizacion = async () => {
    setProcesando(true);
    setMensaje("");
    try {
      const res = await axios.post(`http://localhost:8000/automatizar?dependencia=${dependencia}`);
      setMensaje(res.data.mensaje || "✔️ Automatización finalizada");
    } catch (err) {
      setMensaje("❌ Error al automatizar contratos.");
      console.error(err);
    } finally {
      setProcesando(false);
      setOpenSnackbar(true);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Contratos - {dependencia}
        {archivoSubido && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Archivo cargado: <strong>{archivoSubido}</strong>
        </Alert>
      )} 
      </Typography>

      <Button
        variant="contained"
        color="success"
        onClick={iniciarAutomatizacion}
        disabled={procesando}
        style={{ marginBottom: "1rem" }}
      >
        {procesando ? "Procesando..." : "Iniciar Automatización"}
      </Button>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {contratos.length > 0 &&
                  Object.keys(contratos[0]).map((col, idx) => (
                    <TableCell key={idx}>{col}</TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {contratos.map((row, i) => (
                <TableRow key={i}>
                  {Object.values(row).map((value, j) => (
                    <TableCell key={j}>{String(value)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity={mensaje.startsWith("✔️") ? "success" : "error"}>
          {mensaje}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default VistaContratos;