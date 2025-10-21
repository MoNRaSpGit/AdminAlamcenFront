import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Productos from "./pages/Productos";
import NoActualizados from "./pages/NoActualizados";
import Escaner from "./pages/Escaner";
import ProductosProveedor from "./pages/ProductosProveedor"; // 👈 importar la nueva página
import ProductosPorProveedor from "./pages/ProductosPorProveedor";
import ImprimirPrueba from "./pages/ImprimirPrueba";
import ImprimirQZ from "./pages/ImprimirQZ";
import TestRawBT from "./pages/TestRawBT";














function App() {
  return (
    <>
      {/* Navbar celeste */}
      <Navbar />

      {/* Contenedor principal */}
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<h1>Bienvenido a AdminAlmacén 🚀</h1>} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/no-actualizados" element={<NoActualizados />} />
          <Route path="/escaner" element={<Escaner />} />
          {/* 🆕 Ruta nueva */}
          <Route path="/productos-proveedores" element={<ProductosProveedor />} />
          <Route path="/productos-proveedor" element={<ProductosPorProveedor />} />
          <Route path="/imprimir-prueba" element={<ImprimirPrueba />} />
          <Route path="/imprimir-qz" element={<ImprimirQZ />} />
          <Route path="/test-raw" element={<TestRawBT />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
