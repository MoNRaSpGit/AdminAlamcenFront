import { useEffect, useState, useRef } from "react";

function NoActualizados() {
  const [productos, setProductos] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [editName, setEditName] = useState("");
  const [editBarcode, setEditBarcode] = useState("");
  const barcodeInputRef = useRef(null);

  useEffect(() => {
    fetch("https://backadminalmacen.onrender.com/api/products/not-updated")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("❌ Error:", err));
  }, []);

  const startEdit = (product) => {
    setEditId(product.id);
    setEditPrice(product.price);
    setEditName(product.name);
    setEditBarcode(product.barcode || "");
    setTimeout(() => barcodeInputRef.current?.focus(), 100);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditPrice("");
    setEditName("");
    setEditBarcode("");
  };

  const saveEdit = async (id) => {
    const res = await fetch(
      `https://backadminalmacen.onrender.com/api/products/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: editPrice,
          name: editName,
          barcode: editBarcode || null,
        }),
      }
    );

    if (res.ok) {
      const updated = await res.json();
      const stillNotUpdated =
        updated.price === 999 ||
        updated.price === 0 ||
        !updated.barcode ||
        updated.name.toLowerCase().includes("(ch)") ||
        updated.name.includes("?");

      if (stillNotUpdated) {
        setProductos((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  price: updated.price,
                  name: updated.name,
                  barcode: updated.barcode,
                }
              : p
          )
        );
      } else {
        setProductos((prev) => prev.filter((p) => p.id !== id));
      }

      cancelEdit();
    } else {
      alert("❌ Error al actualizar producto");
    }
  };

  // 🆕 Quitar temporalmente (solo front)
  const quitarTemporalmente = (id) => {
    setProductos((prev) => prev.filter((p) => p.id !== id));
  };

  const productosFiltrados = productos
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="p-4 rounded bg-dark text-light">
      <h2 className="mb-4 text-warning">
        🚫 Productos No Actualizados{" "}
        <span className="badge bg-secondary">{productosFiltrados.length}</span>
      </h2>

      <input
        type="text"
        className="form-control mb-3 bg-secondary text-light"
        placeholder="Buscar producto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="table table-dark table-striped table-bordered table-hover">
        <thead className="table-danger text-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Código de Barra</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  {editId === p.id ? (
                    <input
                      type="text"
                      className="form-control bg-secondary text-light"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  ) : (
                    p.name
                  )}
                </td>
                <td>
                  {editId === p.id ? (
                    <input
                      type="number"
                      className="form-control bg-secondary text-light"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                    />
                  ) : (
                    `$${p.price}`
                  )}
                </td>
                <td>
                  {editId === p.id ? (
                    <input
                      type="text"
                      ref={barcodeInputRef}
                      className="form-control bg-secondary text-light"
                      placeholder="Código de barra"
                      value={editBarcode}
                      onChange={(e) => setEditBarcode(e.target.value)}
                    />
                  ) : (
                    p.barcode || "—"
                  )}
                </td>
                <td>
                  {editId === p.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(p.id)}
                        className="btn btn-success btn-sm me-2"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="btn btn-secondary btn-sm me-2"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => quitarTemporalmente(p.id)}
                        className="btn btn-outline-danger btn-sm"
                      >
                        Quitar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(p)}
                        className="btn btn-warning btn-sm me-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => quitarTemporalmente(p.id)}
                        className="btn btn-outline-danger btn-sm"
                      >
                        Quitar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                ✅ No hay productos pendientes de actualización
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default NoActualizados;
