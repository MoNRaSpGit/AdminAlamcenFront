import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function ProductosPorProveedor() {
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    priceOriginal: "",
    price: "",
    barcode: "",
  });
  const [agregando, setAgregando] = useState(false);
  const precioOriginalRef = useRef(null);

  const API_URL = "https://backadminalmacen.onrender.com/api";

  // Cargar proveedores
  useEffect(() => {
    axios
      .get(`${API_URL}/proveedores`)
      .then((res) => setProveedores(res.data))
      .catch((err) => console.error("Error cargando proveedores:", err));
  }, []);

  // Cargar productos (por proveedor o todos)
  useEffect(() => {
    if (proveedorSeleccionado === "") return; // no hay selección aún

    if (proveedorSeleccionado === "todos") {
      // ✅ Traer todos los productos sin filtro
      axios
        .get(`${API_URL}/products`)
        .then((res) => setProductos(res.data))
        .catch((err) => console.error("Error cargando todos los productos:", err));
    } else {
      // ✅ Traer productos de un proveedor específico
      axios
        .get(`${API_URL}/proveedores/${proveedorSeleccionado}/productos`)
        .then((res) => setProductos(res.data))
        .catch((err) => console.error("Error cargando productos:", err));
    }
  }, [proveedorSeleccionado]);

  // Foco automático al campo Precio O
  useEffect(() => {
    if (editandoId && precioOriginalRef.current) {
      precioOriginalRef.current.focus();
      precioOriginalRef.current.select();
    }
  }, [editandoId]);

  // Filtrado por texto
  const productosFiltrados = productos.filter(
    (p) =>
      p.name.toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.barcode && p.barcode.toLowerCase().includes(busqueda.toLowerCase()))
  );

  // Guardar edición
  const guardarEdicion = async (id) => {
    try {
      await axios.put(`${API_URL}/products/${id}`, {
        name: form.name,
        priceOriginal: form.priceOriginal,
        price: form.price,
        barcode: form.barcode,
      });

      setProductos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...form } : p))
      );
      setEditandoId(null);
    } catch (err) {
      console.error("Error actualizando producto:", err);
      alert("❌ No se pudo actualizar el producto.");
    }
  };

  // Agregar producto nuevo
  const guardarNuevo = async () => {
    try {
      const res = await axios.post(`${API_URL}/products`, {
        name: form.name,
        priceOriginal: form.priceOriginal,
        price: form.price,
        barcode: form.barcode,
      });

      const nuevoId = res.data.id;

      // Si no está en "Todos", asignamos el proveedor
      if (proveedorSeleccionado !== "todos") {
        await axios.post(`${API_URL}/proveedores/asignar`, {
          proveedorId: proveedorSeleccionado,
          productos: [nuevoId],
        });
      }

      setProductos((prev) => [...prev, { id: nuevoId, ...form }]);
      setAgregando(false);
      setForm({ name: "", priceOriginal: "", price: "", barcode: "" });
    } catch (err) {
      console.error("Error agregando producto:", err);
      alert("❌ No se pudo agregar el producto.");
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">🏭 Productos por Proveedor</h2>

      {/* Selector de proveedor */}
      <div className="mb-3">
        <label className="form-label">Seleccionar proveedor</label>
        <select
          className="form-select"
          value={proveedorSeleccionado}
          onChange={(e) => {
            setProveedorSeleccionado(e.target.value);
            setProductos([]);
          }}
        >
          <option value="">-- Seleccioná un proveedor --</option>
          <option value="todos">📦 Todos los productos</option> {/* 👈 NUEVA OPCIÓN */}
          {proveedores.map((prov) => (
            <option key={prov.id} value={prov.id}>
              {prov.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Buscador + botón agregar */}
      {proveedorSeleccionado && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <input
              type="text"
              className="form-control w-50"
              placeholder="🔍 Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <button
              className="btn btn-success ms-3"
              onClick={() => {
                setAgregando(true);
                setForm({ name: "", priceOriginal: "", price: "", barcode: "" });
              }}
            >
              ➕ Agregar producto
            </button>
          </div>

          {/* Tabla */}
          <table className="table table-dark table-striped align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio O</th>
                <th>Precio Final</th>
                <th>Código</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {/* Fila para agregar */}
              {agregando && (
                <tr className="bg-secondary-subtle">
                  <td>—</td>
                  <td>
                    <input
                      className="form-control"
                      placeholder="Nombre"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Precio original"
                      value={form.priceOriginal || ""}
                      onChange={(e) => {
                        const original = parseFloat(e.target.value) || 0;
                        const final = (original * 1.3).toFixed(2);
                        setForm({
                          ...form,
                          priceOriginal: original,
                          price: final,
                        });
                      }}
                    />
                  </td>
                  <td>
                    <span className="text-success fw-bold">
                      ${form.price || 0}
                    </span>
                  </td>
                  <td>
                    <input
                      className="form-control"
                      placeholder="Código"
                      value={form.barcode}
                      onChange={(e) =>
                        setForm({ ...form, barcode: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={guardarNuevo}
                    >
                      💾 Guardar
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setAgregando(false)}
                    >
                      ❌ Cancelar
                    </button>
                  </td>
                </tr>
              )}

              {/* Filas normales */}
              {productosFiltrados.map((p) => (
                <tr
                  key={p.id}
                  className={editandoId === p.id ? "bg-secondary-subtle" : ""}
                >
                  <td>{p.id}</td>

                  {/* Nombre */}
                  <td>
                    {editandoId === p.id ? (
                      <input
                        className="form-control"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                      />
                    ) : (
                      p.name
                    )}
                  </td>

                  {/* Precio original */}
                  <td>
                    {editandoId === p.id ? (
                      <input
                        ref={precioOriginalRef}
                        type="number"
                        className="form-control"
                        value={form.priceOriginal || p.priceOriginal || ""}
                        onChange={(e) => {
                          const original = parseFloat(e.target.value) || 0;
                          const final = (original * 1.3).toFixed(2);
                          setForm({
                            ...form,
                            priceOriginal: original,
                            price: final,
                          });
                        }}
                      />
                    ) : (
                      `$${p.priceOriginal || 0}`
                    )}
                  </td>

                  {/* Precio final */}
                  <td>
                    {editandoId === p.id ? (
                      <span className="text-success fw-bold">
                        ${form.price || 0}
                      </span>
                    ) : (
                      `$${p.price || 0}`
                    )}
                  </td>

                  {/* Código */}
                  <td>
                    {editandoId === p.id ? (
                      <input
                        className="form-control"
                        value={form.barcode}
                        onChange={(e) =>
                          setForm({ ...form, barcode: e.target.value })
                        }
                      />
                    ) : (
                      p.barcode
                    )}
                  </td>

                  {/* Acciones */}
                  <td>
                    {editandoId === p.id ? (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => guardarEdicion(p.id)}
                        >
                          💾 Guardar
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditandoId(null)}
                        >
                          ❌ Cancelar
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => {
                          setEditandoId(p.id);
                          setForm({
                            name: p.name,
                            priceOriginal: p.priceOriginal,
                            price: p.price,
                            barcode: p.barcode,
                          });
                        }}
                      >
                        ✏️ Editar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
