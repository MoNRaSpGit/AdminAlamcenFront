import { useEffect, useState, useRef } from "react";
import ProductoForm from "../views/ProductoForm";
import ProductosTable from "../views/ProductosTable";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState("");
  const [search, setSearch] = useState("");

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPriceOriginal, setEditPriceOriginal] = useState("");
  const [editProveedor, setEditProveedor] = useState(""); // 🆕 proveedor editable

  const API = "https://backadminalmacen.onrender.com/api";
  const searchInputRef = useRef(null);

  // Cargar productos y proveedores
  useEffect(() => {
    Promise.all([
      fetch(`${API}/products`).then((res) => res.json()),
      fetch(`${API}/proveedores`).then((res) => res.json()),
    ])
      .then(([prods, provs]) => {
        setProductos(prods);
        setProveedores(provs);
      })
      .catch((err) => console.error("❌ Error inicial:", err));
  }, []);

  // === 🧠 Funciones base ===
  const startEdit = (p) => {
    setEditId(p.id);
    setEditName(p.name);
    setEditPriceOriginal(p.priceOriginal || "");
    setEditProveedor(p.proveedor_id || ""); // 🆕 preseleccionar proveedor
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditPriceOriginal("");
    setEditProveedor("");
  };

  const saveEdit = async (id) => {
  try {
    const producto = productos.find((p) => p.id === id);

    // 🧮 Calculamos nuevo precio final (30% margen)
    const base = parseFloat(editPriceOriginal || producto.priceOriginal || 0);
    const newPrice = (base * 1.3).toFixed(2);

    // 🧾 Armamos el body que se enviará al backend
    const body = {
      name: editName || producto.name,
      priceOriginal: base,
      price: parseFloat(newPrice),
      proveedor_id: editProveedor
        ? Number(editProveedor)
        : producto.proveedor_id || null, // ✅ Enviamos proveedor actual o nuevo
    };

    console.log("➡️ Enviando datos al backend:", body);

    const res = await fetch(`${API}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error("Error al guardar cambios");

    const updated = await res.json();

    // 🧠 Actualizamos en el estado local
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );

    cancelEdit();
  } catch (err) {
    console.error("❌ Error actualizando producto:", err);
    alert("No se pudo guardar el cambio");
  }
};


  const marcarComoChequeado = async (id) => {
    try {
      const res = await fetch(`${API}/products/${id}/check`, { method: "PUT" });
      if (!res.ok) throw new Error();
      const fecha = new Date().toISOString();
      setProductos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, last_checked_at: fecha } : p))
      );
    } catch {
      alert("No se pudo marcar el producto como chequeado");
    }
  };

  const agregarProducto = (nuevo) => {
    setProductos((prev) => [...prev, nuevo]);
  };

  // Filtro
  const productosFiltrados = productos.filter((p) => {
    const coincideTexto = p.name.toLowerCase().includes(search.toLowerCase());
    const coincideProveedor =
      !proveedorSeleccionado ||
      proveedorSeleccionado === "todos" ||
      Number(p.proveedor_id) === Number(proveedorSeleccionado);
    return coincideTexto && coincideProveedor;
  });

  // === 🧩 UI ===
  return (
    <div className="p-4 rounded bg-dark text-light">
      <h2 className="mb-4 text-info">📦 Revisión y Carga de Productos</h2>

      {/* 🔍 Buscador y filtro */}
      <div className="d-flex gap-3 mb-3">
        <input
          type="text"
          className="form-control bg-secondary text-light"
          placeholder="Buscar producto..."
          value={search}
          ref={searchInputRef}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="form-select bg-secondary text-light"
          value={proveedorSeleccionado}
          onChange={(e) => setProveedorSeleccionado(e.target.value)}
        >
          <option value="todos">Todos los proveedores</option>
          {proveedores.map((prov) => (
            <option key={prov.id} value={prov.id}>
              {prov.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* ➕ Nuevo producto */}
      <ProductoForm
        API={API}
        proveedores={proveedores}
        onProductoAgregado={agregarProducto}
      />

      {/* 📋 Tabla */}
      <ProductosTable
        productos={productosFiltrados}
        editId={editId}
        editName={editName}
        editPriceOriginal={editPriceOriginal}
        editProveedor={editProveedor} // 🆕
        setEditProveedor={setEditProveedor} // 🆕
        proveedores={proveedores} // 🆕
        startEdit={startEdit}
        cancelEdit={cancelEdit}
        saveEdit={saveEdit}
        marcarComoChequeado={marcarComoChequeado}
      />
    </div>
  );
}
