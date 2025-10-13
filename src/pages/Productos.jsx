import { useEffect, useState, useRef } from "react";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]); 
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [editName, setEditName] = useState("");

  // 🆕 Campos para nuevo producto
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");       
  const [newPriceInput, setNewPriceInput] = useState(""); 
  const [newProveedor, setNewProveedor] = useState("");   
  const [divideBy, setDivideBy] = useState("");   

  // 🆕 Porcentaje dinámico
  const [markup, setMarkup] = useState(30);

  const searchInputRef = useRef(null);

  // cargar productos y proveedores
  useEffect(() => {
    fetch("https://backadminalmacen.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("❌ Error productos:", err));

    fetch("https://backadminalmacen.onrender.com/api/proveedores")
      .then((res) => res.json())
      .then((data) => setProveedores(data))
      .catch((err) => console.error("❌ Error proveedores:", err));
  }, []);

  // recalcular precio cuando cambia input, divisor o markup
  useEffect(() => {
    const raw = parseFloat(newPriceInput);
    if (isNaN(raw) || raw <= 0) {
      setNewPrice("");
      return;
    }
    const div = parseFloat(divideBy);
    const base = (!isNaN(div) && div > 0) ? raw / div : raw;
    const final = base * (1 + markup / 100);
    setNewPrice(final.toFixed(2));
  }, [newPriceInput, divideBy, markup]);

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

  // Guardar producto + asignarlo al proveedor
  const addNewProduct = async () => {
    if (!newName || !newProveedor) {
      alert("⚠️ Falta nombre o proveedor");
      return;
    }

    // recalcular acá también para asegurar consistencia
    const raw = parseFloat(newPriceInput) || 0;
    const div = parseFloat(divideBy) || 0;
    const base = div > 0 ? raw / div : raw;
    const finalNumber = base > 0 ? base * (1 + markup / 100) : 0;
    const finalRounded = finalNumber ? Number(finalNumber.toFixed(2)) : null;

    try {
      // 1️⃣ insertar producto
      const res = await fetch(
        "https://backadminalmacen.onrender.com/api/products",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newName,
            price: finalRounded,
          }),
        }
      );

      if (!res.ok) throw new Error("Error guardando producto");

      const saved = await res.json();

      // 2️⃣ asignar proveedor
      const res2 = await fetch(
        "https://backadminalmacen.onrender.com/api/proveedores/asignar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            proveedorId: newProveedor,
            productos: [saved.id],
          }),
        }
      );

      if (!res2.ok) throw new Error("Error asignando proveedor");

      // actualizar lista local
      setProductos((prev) => [...prev, saved]);

      // limpiar form (menos proveedor y markup)
      setNewName("");
      setNewPriceInput("");
      setDivideBy("");
      setNewPrice("");

      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }

    } catch (err) {
      console.error("❌", err);
      alert("Error al guardar producto con proveedor");
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
        ref={searchInputRef}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Botón para cambiar markup */}
      <button
        className={`btn ${markup === 30 ? "btn-info" : "btn-danger"} btn-lg mb-3`}
        onClick={() => setMarkup(markup === 30 ? 52 : 30)}
      >
        🔄 Margen actual: {markup}%
      </button>

      {/* ⚠️ Aviso */}
      <div className="alert alert-warning text-dark">
        ⚠️ Che, acordate que al precio se le suma automáticamente un {markup}%.
      </div>

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
          value={newPriceInput}
          onChange={(e) => setNewPriceInput(e.target.value)}
        />
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Dividir por (opcional)"
          value={divideBy}
          onChange={(e) => setDivideBy(e.target.value)}
        />

        {/* Mostrar resultado */}
        {newPrice && (
          <div className="text-info">
            {parseFloat(divideBy) > 0 ? (
              <>
                <p>💰 Precio ingresado: <strong>${Number(newPriceInput || 0).toFixed(2)}</strong></p>
                <p>➗ Dividido entre {divideBy}: <strong>${(Number(newPriceInput || 0) / Number(divideBy)).toFixed(2)}</strong></p>
                <p>➕ Con {markup}%: <strong>${newPrice}</strong></p>
              </>
            ) : (
              <p>💰 Precio final con {markup}%: <strong>${newPrice}</strong></p>
            )}
          </div>
        )}

        {/* Select de proveedores */}
        <select
          className="form-control mb-2"
          value={newProveedor}
          onChange={(e) => setNewProveedor(e.target.value)}
        >
          <option value="">-- Seleccionar proveedor --</option>
          {proveedores.map((prov) => (
            <option key={prov.id} value={prov.id}>
              {prov.nombre}
            </option>
          ))}
        </select>

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
              <td>{p.barcode ? p.barcode : "—"}</td>
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
