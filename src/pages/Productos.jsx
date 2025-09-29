import { useEffect, useState } from "react";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [editName, setEditName] = useState("");

  // 🆕 Campos para nuevo producto
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newBarcode, setNewBarcode] = useState(""); // 👈 agregado
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    fetch("https://backadminalmacen.onrender.com/api/products")
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
      setProductos((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, price: updated.price, name: updated.name } : p
        )
      );
      cancelEdit();
    } else {
      alert("❌ Error al actualizar producto");
    }
  };

  const addNewProduct = async () => {
    const res = await fetch(
      "https://backadminalmacen.onrender.com/api/products",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          price: newPrice || null,
          barcode: newBarcode || null, // 👈 corregido
          description: newDescription || null,
        }),
      }
    );

    if (res.ok) {
      const saved = await res.json();
      setProductos((prev) => [...prev, saved]); // lo agregamos a la lista
      // limpiar formulario
      setNewName("");
      setNewPrice("");
      setNewBarcode("");
      setNewDescription("");
    } else {
      alert("❌ Error al guardar producto");
    }
  };

  const productosFiltrados = productos.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 rounded bg-dark text-light">
      <h2 className="mb-4 text-info">📦 Listado de Productos</h2>

      {/* 🔎 Buscador */}
      <input
        type="text"
        className="form-control mb-3 bg-secondary text-light"
        placeholder="Buscar producto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 🆕 Formulario para producto nuevo */}
      <div className="card bg-secondary text-light mb-4 p-3">
        <h4>➕ Agregar Producto</h4>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Nombre del producto"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Precio (opcional)"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Código de barra (opcional)"
          value={newBarcode}
          onChange={(e) => setNewBarcode(e.target.value)}
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Descripción (opcional)"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <button className="btn btn-success" onClick={addNewProduct}>
          Guardar Producto
        </button>
      </div>

      {/* Tabla de productos */}
      <table className="table table-dark table-striped table-bordered table-hover">
        <thead className="table-primary text-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Código de Barra</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map((p) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Productos;
