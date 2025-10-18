export default function ProductosTable({
  productos,
  editId,
  editName,
  editPriceOriginal,
  editProveedor, // 🆕
  setEditProveedor, // 🆕
  proveedores, // 🆕
  startEdit,
  cancelEdit,
  saveEdit,
  marcarComoChequeado,
}) {
  return (
    <table className="table table-dark table-striped table-bordered table-hover">
      <thead className="table-primary text-dark">
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Proveedor</th>
          <th>Precio Original</th>
          <th>Precio Final</th>
          <th>Último Chequeo</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {productos.map((p) => (
          <tr key={p.id}>
            <td>{p.id}</td>

            {/* Nombre */}
            <td>
              {editId === p.id ? (
                <input
                  type="text"
                  className="form-control bg-secondary text-light"
                  value={editName}
                  onChange={(e) =>
                    startEdit({ ...p, name: e.target.value })
                  }
                />
              ) : (
                p.name
              )}
            </td>

            {/* Proveedor */}
            <td>
              {editId === p.id ? (
                <select
                  className="form-select bg-secondary text-light"
                  value={editProveedor || ""}
                  onChange={(e) => setEditProveedor(e.target.value)}
                >
                  <option value="">-- Seleccionar proveedor --</option>
                  {proveedores.map((prov) => (
                    <option key={prov.id} value={prov.id}>
                      {prov.nombre}
                    </option>
                  ))}
                </select>
              ) : (
                p.proveedor_nombre || "—"
              )}
            </td>

            {/* Precio Original */}
            <td>
              {editId === p.id ? (
                <input
                  type="number"
                  className="form-control bg-secondary text-light"
                  value={editPriceOriginal}
                  onChange={(e) =>
                    startEdit({ ...p, priceOriginal: e.target.value })
                  }
                />
              ) : (
                `$${p.priceOriginal || 0}`
              )}
            </td>

            {/* Precio Final */}
            <td>{`$${p.price}`}</td>

            {/* Último Chequeo */}
            <td>
              {p.last_checked_at ? (
                <span className="text-success">
                  {new Date(p.last_checked_at).toLocaleDateString("es-UY")}
                </span>
              ) : (
                <span className="text-warning">Pendiente</span>
              )}
            </td>

            {/* Acciones */}
            <td>
              {editId === p.id ? (
                <>
                  <button
                    onClick={() => saveEdit(p.id)}
                    className="btn btn-success btn-sm me-2"
                  >
                    💾 Guardar
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="btn btn-secondary btn-sm"
                  >
                    ❌ Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(p)}
                    className="btn btn-warning btn-sm me-2"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => marcarComoChequeado(p.id)}
                    className="btn btn-outline-success btn-sm"
                  >
                    ✅ Check
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
