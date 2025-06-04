import React, { useEffect, useState } from "react"; 
import axios from "../api/axiosConfig";
import {
  Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Snackbar, Alert,
  Box, Stack, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [contratos, setContratos] = useState([]);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [archivoSubido, setArchivoSubido] = useState(() => localStorage.getItem("archivoSubido") || "");
  const [modalOpen, setModalOpen] = useState(false);
  const [contratoSeleccionado, setContratoSeleccionado] = useState(null);

  const usuario = localStorage.getItem("usuario") || "Usuario actual";
  const dependencia = localStorage.getItem("dependenciaSeleccionada") || "Adquisiciones";

  useEffect(() => {
    const fetchContratos = async () => {
      if (!archivoSubido) return;
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8000/contratos", {
          params: { dependencia, archivo: archivoSubido },
        });
        console.log("✅ Contratos recibidos:", res.data);
        setContratos(res.data);
      } catch (error) {
        console.error("❌ Error al cargar contratos:", error);
        setMensaje("❌ No se pudo cargar el archivo de contratos");
      } finally {
        setLoading(false);
      }
    };
    fetchContratos();
  }, [archivoSubido, dependencia]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:8000/subir_excel?dependencia=${dependencia}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setArchivoSubido(res.data.archivo_guardado || "");
      localStorage.setItem("archivoSubido", res.data.archivo_guardado || "");
      setMensaje("✔️ Excel cargado correctamente");
    } catch (error) {
      console.error("❌ Error al subir el Excel:", error);
      setMensaje("❌ Error al subir o procesar el archivo");
    } finally {
      setOpenSnackbar(true);
      setLoading(false);
    }
  };

  const iniciarAutomatizacion = async () => {
    if (!archivoSubido) {
      setMensaje("⚠️ Primero debes cargar un archivo Excel");
      setOpenSnackbar(true);
      return;
    }

    setProcesando(true);
    try {
      const usuario = localStorage.getItem("usuario") || "Desconocido";
      const res = await axios.post(
        `http://localhost:8000/automatizar?dependencia=${dependencia}&archivo=${archivoSubido}&usuario=${usuario}`
      );
      setMensaje(res.data.mensaje || "✔️ Automatización finalizada");
    } catch (error) {
      console.error("❌ Error al automatizar:", error);
      setMensaje("❌ Falló la automatización");
    } finally {
      setOpenSnackbar(true);
      setProcesando(false);
    }
  };

  const abrirModal = (contrato) => {
    setContratoSeleccionado(contrato);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setContratoSeleccionado(null);
  };

  const exportarTodosExcel = () => {
    if (contratos.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(contratos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Contratos");
    XLSX.writeFile(wb, "Listado_Contratos.xlsx");
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" color="#005026" mb={2}>
        Modulo de Automatización - {dependencia}
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3} alignItems="center" flexWrap="wrap">
        <Box>
          <input
            type="file"
            accept=".xlsx"
            id="upload-excel"
            hidden
            onChange={handleFileUpload}
          />
          <label htmlFor="upload-excel">
            <Button
              component="span"
              variant="contained"
              startIcon={<UploadFileIcon />}
              sx={{
                backgroundColor: '#FFC600',
                color: 'black',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: '#e6b800' },
                width: 'fit-content'
              }}
            >
              Cargar Excel
            </Button>
          </label>
        </Box>

        <Button
          variant="contained"
          sx={{
            backgroundColor: '#005026',
            fontWeight: 'bold',
            '&:hover': { backgroundColor: '#00441f' }
          }}
          onClick={iniciarAutomatizacion}
          disabled={procesando}
        >
          {procesando ? "Procesando..." : "Ejecutar bot"}
        </Button>

        <Button variant="outlined" onClick={() => navigate("/historial")}>
          Ver historial
        </Button>

        <Button variant="outlined" onClick={exportarTodosExcel}>
          Exportar Excel
        </Button>
      </Stack>

      {archivoSubido && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Archivo cargado: <strong>{archivoSubido}</strong>
        </Alert>
      )}

      {loading ? (
        <CircularProgress />
      ) : Array.isArray(contratos) && contratos.length > 0 ? (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><b>Contrato</b></TableCell>
                <TableCell><b>Proyecto</b></TableCell>
                <TableCell><b>Cédula o Nit del Contratista</b></TableCell>
                <TableCell align="center"><b>Acciones</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contratos.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row["No. de Contrato"] || "N/A"}</TableCell>
                  <TableCell>{row["Código del Proyecto"] || row["Proyecto"] || "—"}</TableCell>
                  <TableCell>{String(row["Cédula o Nit Contratista"])?.split("T")[0] || "—"}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => abrirModal(row)}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        !loading && <Alert severity="info">No hay contratos cargados.</Alert>
      )}

      <Dialog open={modalOpen} onClose={cerrarModal} maxWidth="md" fullWidth>
        <DialogTitle>Detalles del contrato</DialogTitle>
        <DialogContent dividers>
          {contratoSeleccionado &&
            Object.entries(contratoSeleccionado).map(([key, value], i) => (
              <Typography key={i} variant="body2" sx={{ mb: 1 }}>
                <strong>{key}:</strong> {value || "—"}
              </Typography>
            ))
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarModal}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={mensaje.startsWith("✔️") ? "success" : "error"} variant="filled">
          {mensaje}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Home;