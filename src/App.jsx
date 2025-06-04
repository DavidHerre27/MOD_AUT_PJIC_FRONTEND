import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Historial from "./pages/Historial";
import Errores from "./pages/Errores";
import Configuracion from "./pages/Configuracion";
import CrearUsuario from "./pages/CrearUsuario";
import PrivateRoute from "./components/PrivateRoute";
import AppLayout from "./components/AppLayout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* Rutas privadas protegidas */}
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            {/* Solo administradores */}
            <Route path="/crear-usuario" element={<CrearUsuario />} />
            {/* Comunes para todos */}
            <Route path="/inicio" element={<Home />} />
            <Route path="/historial" element={<Historial />} />
            <Route path="/errores" element={<Errores />} />
            <Route path="/configuracion" element={<Configuracion />} />
          </Route>
        </Route>

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;