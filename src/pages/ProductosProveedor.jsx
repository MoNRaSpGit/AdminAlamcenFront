import { useEffect, useState, useRef } from "react";

function ProductosProveedor() {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [selectedProveedor, setSelectedProveedor] = useState("");
  const [selectedProductos, setSelectedProductos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [mensajeTipo, setMensajeTipo] = useState("success"); // success | danger
  const [search, setSearch] = useState("");
  const searchInputRef = useRef(null); // 👈 referencia al input

  // ✅ helper para manejar imagen base64 o data URI
  const getImageSrc = (img) => {
    if (!img) return "https://picsum.photos/150/150"; // placeholder seguro
    return img.startsWith("data:") ? img : `data:image/png;base64,${img}`;
  };

  useEffect(() => {
    // cargar productos sin proveedor
    fetch("https://backadminalmacen.onrender.com/api/proveedores/sin-proveedor")
      .then((res) => res.json())
      .then((data) => {
        const ordenados = [...data].sort((a, b) =>
          a.name.localeCompare(b.name, "es", { sensitivity: "base" })
        );
        setProductos(ordenados);
      })
      .catch((err) => console.error("❌ Error productos:", err));

    // cargar proveedores
    fetch("https://backadminalmacen.onrender.com/api/proveedores")
      .then((res) => res.json())
      .then((data) => setProveedores(data))
      .catch((err) => console.error("❌ Error proveedores:", err));
  }, []);

  // seleccionar/deseleccionar producto
  const toggleProducto = (id) => {
    setSelectedProductos((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  // confirmar asignación
  const confirmarAsignacion = async () => {
    if (!selectedProveedor) {
      setMensaje("⚠️ Selecciona un proveedor primero");
      setMensajeTipo("danger");
      setTimeout(() => setMensaje(""), 2000);
      return;
    }
    if (selectedProductos.length === 0) {
      setMensaje("⚠️ Selecciona al menos un producto");
      setMensajeTipo("danger");
      setTimeout(() => setMensaje(""), 2000);
      return;
    }

    try {
      const res = await fetch(
        "https://backadminalmacen.onrender.com/api/proveedores/asignar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            proveedorId: selectedProveedor,
            productos: selectedProductos,
          }),
        }
      );

      if (!res.ok) throw new Error("❌ Error asignando productos");

      await res.json();

      setMensaje("✅ Confirmado correctamente");
      setMensajeTipo("success");
      setTimeout(() => setMensaje(""), 2000);

      // quitar productos asignados de la lista
      setProductos((prev) =>
        prev.filter((p) => !selectedProductos.includes(p.id))
      );
      setSelectedProductos([]);

      // limpiar buscador y enfocar 👇
      setSearch("");
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error en la asignación");
      setMensajeTipo("danger");
      setTimeout(() => setMensaje(""), 2000);
    }
  };

  // productos filtrados por buscador
  const productosFiltrados = productos.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase().trim()) ||
      (p.barcode && p.barcode.includes(search.trim()))
  );

  return (
    <div className="p-4 rounded bg-dark text-light">
      <h2 className="mb-4 text-info">📦 Asignar Proveedores a Productos</h2>

      {/* Mensaje flotante (toast) */}
      {mensaje && (
        <div
          className={`alert alert-${mensajeTipo} text-center`}
          style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}
        >
          {mensaje}
        </div>
      )}

      {/* 🔎 Buscador */}
      <div className="mb-3">
        <input
          type="text"
          ref={searchInputRef} // 👈 referencia al input
          className="form-control bg-secondary text-light"
          placeholder="Buscar por nombre o código..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Contador */}
      <div className="mb-3">
        <span className="badge bg-info text-dark fs-6">
          Mostrando {productosFiltrados.length} de {productos.length} productos sin proveedor
        </span>
      </div>

      {/* Grid de tarjetas */}
      <div className="row">
        {productosFiltrados.map((p) => {
          const seleccionado = selectedProductos.includes(p.id);
          return (
            <div key={p.id} className="col-6 col-md-3 mb-4">
              <div
                className={`card h-100 text-center ${seleccionado ? "border border-3 border-danger" : ""
                  }`}
                style={{ cursor: "pointer" }}
                onClick={() => toggleProducto(p.id)}
              >
                <img
                  src={getImageSrc(p.image)}
                  alt={p.name}
                  className="card-img-top"
                  style={{ height: "150px", objectFit: "cover" }}
                />
                <div className="card-body bg-secondary text-light">
                  <h6 className="card-title">{p.name}</h6>
                  <p className="card-text text-warning  mb-0">
                    {p.price ? `$${Number(p.price).toFixed(2)}` : "—"}
                  </p>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Panel flotante: select + botón confirmar */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 10000,
          width: "300px",
        }}
        className="bg-dark border border-light rounded p-3 shadow"
      >
        <label className="form-label">Seleccionar proveedor</label>
        <select
          className="form-select mb-2"
          value={selectedProveedor}
          onChange={(e) => setSelectedProveedor(e.target.value)}
        >
          <option value="">-- Selecciona un proveedor --</option>
          {proveedores.map((prov) => (
            <option key={prov.id} value={prov.id}>
              {prov.nombre}
            </option>
          ))}
        </select>

        <button
          className="btn btn-success w-100"
          onClick={confirmarAsignacion}
          disabled={!selectedProveedor || selectedProductos.length === 0}
        >
          ✅ Confirmar Asignación ({selectedProductos.length})
        </button>
      </div>
    </div>
  );
}

export default ProductosProveedor;
