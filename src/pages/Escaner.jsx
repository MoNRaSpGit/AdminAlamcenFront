import { useState, useRef, useEffect } from "react";

export default function Escaner({ onProductoEncontrado }) {
  const [codigo, setCodigo] = useState("");
  const [productoActual, setProductoActual] = useState(null);
  const [carrito, setCarrito] = useState([]);

  // Modal "fake" embebido
  const [barcodePendiente, setBarcodePendiente] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoPrecio, setNuevoPrecio] = useState("");
  const inputRef = useRef(null);

  // Siempre enfocar el input al montar
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const manejarEnter = async (e) => {
    if (e.key === "Enter" && codigo.trim() !== "") {
      try {
        const res = await fetch(
          `https://backadminalmacen.onrender.com/api/products/by-barcode/${codigo}`
        );

        if (res.ok) {
          // ✅ Producto existe
          const producto = await res.json();
          setProductoActual(producto);
          setCarrito((prev) => [...prev, producto]);
          onProductoEncontrado?.(producto);
          resetInput();
        } else {
          // 🚨 Producto no existe → abrir modal
          setBarcodePendiente(codigo);
          resetInput();
        }
      } catch (err) {
        alert("❌ Error consultando producto");
        resetInput();
      }
    }
  };

  const resetInput = () => {
    setCodigo("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const guardarNuevo = async () => {
    if (!barcodePendiente || !nuevoNombre || !nuevoPrecio) {
      alert("⚠️ Completa todos los campos");
      resetInput();
      return;
    }

    const res = await fetch("https://backadminalmacen.onrender.com/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nuevoNombre,
        price: nuevoPrecio,
        barcode: barcodePendiente,
        status: "pendiente",
      }),
    });

    if (res.ok) {
      const producto = await res.json();
      setProductoActual(producto);
      setCarrito((prev) => [...prev, producto]);
    } else {
      alert("❌ Error al guardar producto");
    }

    // limpiar modal
    setNuevoNombre("");
    setNuevoPrecio("");
    setBarcodePendiente(null);
    resetInput();
  };

  const cancelarNuevo = () => {
    setNuevoNombre("");
    setNuevoPrecio("");
    setBarcodePendiente(null);
    resetInput();
  };

  return (
    <div className="container mt-4 text-light">
      <h2 className="text-info mb-4">🛒 Escáner de Productos</h2>

      <input
        ref={inputRef}
        type="text"
        className="form-control mb-3"
        placeholder="Escanee o escriba el código de barras"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        onKeyDown={manejarEnter}
      />

      {/* Producto actual en grande */}
      {productoActual && (
        <div className="card bg-dark text-light p-3 mb-4 shadow">
          {productoActual.image && (
            <img
              src={productoActual.image}
              alt={productoActual.name}
              style={{ maxHeight: "200px", objectFit: "contain" }}
              className="mb-3"
            />
          )}
          <h3 className="text-info">{productoActual.name}</h3>
          <p className="fs-4 text-success">💲 {productoActual.price}</p>
        </div>
      )}

      {/* Modal embebido */}
      {barcodePendiente && (
        <div className="card bg-secondary text-light p-3 mb-4 shadow">
          <h5>➕ Nuevo producto (código: {barcodePendiente})</h5>
          <input
            type="text"
            className="form-control mb-2 bg-dark text-light"
            placeholder="Nombre del producto"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
          />
          <input
            type="number"
            className="form-control mb-2 bg-dark text-light"
            placeholder="Precio"
            value={nuevoPrecio}
            onChange={(e) => setNuevoPrecio(e.target.value)}
          />
          <button className="btn btn-success me-2" onClick={guardarNuevo}>
            Guardar
          </button>
          <button className="btn btn-danger" onClick={cancelarNuevo}>
            Cancelar
          </button>
        </div>
      )}

      {/* Carrito */}
      <h4 className="text-info">🧾 Lista de productos escaneados</h4>
      <ul className="list-group">
        {carrito.map((p, i) => (
          <li
            key={i}
            className="list-group-item d-flex justify-content-between align-items-center bg-dark text-light border-secondary"
          >
            <span>{p.name}</span>
            <span className="badge bg-info text-dark fs-6">
              ${p.price}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
