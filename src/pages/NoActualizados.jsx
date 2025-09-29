import { useEffect, useState } from "react";

function NoActualizados() {
  const [productos, setProductos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [editName, setEditName] = useState("");

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
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditPrice("");
    setEditName("");
  };

  const saveEdit = async (id) => {
    const res = await fetch(
      `https://backadminalmacen.onrender.com/api/products/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: editPrice, name: editName }),
      }
    );

    if (res.ok) {
      const updated = await res.json();

      // 🔍 Re-evaluar si todavía cumple las condiciones de "No actualizado"
      const stillNotUpdated =
        updated.price === 999 ||
        updated.price === 0 ||
        updated.name.toUpperCase().includes("(CH)");

      if (stillNotUpdated) {
        // 👉 lo dejamos en la lista, pero actualizado
        setProductos((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, price: updated.price, name: updated.name } : p
          )
        );
      } else {
        // 🚀 ya no cumple -> lo eliminamos de la lista
        setProductos((prev) => prev.filter((p) => p.id !== id));
      }

      cancelEdit();
    } else {
      alert("❌ Error al actualizar producto");
    }
  };

  return (
    <div className="p-4 rounded bg-dark text-light">
      {/* 🔹 Contador */}
      <h2 className="mb-4 text-warning">
        🚫 Productos No Actualizados{" "}
        <span className="badge bg-info text-dark">
          {productos.length}
        </span>
      </h2>

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
          {productos.length > 0 ? (
            productos.map((p) => (
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
                <td>{p.barcode || "—"}</td>
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
                        className="btn btn-secondary btn-sm"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEdit(p)}
                      className="btn btn-warning btn-sm"
                    >
                      Editar
                    </button>
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
