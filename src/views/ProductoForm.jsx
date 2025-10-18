import { useEffect, useState } from "react";

export default function ProductoForm({ API, proveedores, onProductoAgregado }) {
  const [name, setName] = useState("");
  const [priceOriginal, setPriceOriginal] = useState("");
  const [divideBy, setDivideBy] = useState("");
  const [markup, setMarkup] = useState(30);
  const [priceFinal, setPriceFinal] = useState("");
  const [proveedor, setProveedor] = useState("");

  useEffect(() => {
    const base = parseFloat(priceOriginal);
    if (!base || base <= 0) return setPriceFinal("");
    const divisor = parseFloat(divideBy);
    const unit = divisor > 0 ? base / divisor : base;
    const final = unit * (1 + markup / 100);
    setPriceFinal(final.toFixed(2));
  }, [priceOriginal, divideBy, markup]);

  const handleSave = async () => {
    if (!name || !priceOriginal || !proveedor) {
      alert("⚠️ Falta nombre, precio o proveedor");
      return;
    }

    try {
      const base = parseFloat(priceOriginal);
      const divisor = parseFloat(divideBy);
      const unit = divisor > 0 ? base / divisor : base;
      const final = unit * (1 + markup / 100);

      const res = await fetch(`${API}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          priceOriginal: unit.toFixed(2),
          price: final.toFixed(2),
        }),
      });
      if (!res.ok) throw new Error("Error al crear producto");
      const saved = await res.json();

      await fetch(`${API}/proveedores/asignar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proveedorId: proveedor,
          productos: [saved.id],
        }),
      });

      await fetch(`${API}/products/${saved.id}/check`, { method: "PUT" });

      onProductoAgregado(saved);
      setName("");
      setPriceOriginal("");
      setDivideBy("");
      setProveedor("");
      setPriceFinal("");
    } catch {
      alert("❌ No se pudo agregar el producto");
    }
  };

  return (
    <div className="card bg-secondary text-light mb-4 p-3 shadow">
      <h4>➕ Agregar nuevo producto</h4>

      {/* 🧾 Campos */}
      <input
        className="form-control mb-2"
        placeholder="Nombre del producto"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        className="form-control mb-2"
        placeholder="Precio original (pack o unidad)"
        value={priceOriginal}
        onChange={(e) => setPriceOriginal(e.target.value)}
      />
      <input
        type="number"
        className="form-control mb-2"
        placeholder="Dividir por (opcional)"
        value={divideBy}
        onChange={(e) => setDivideBy(e.target.value)}
      />

      <select
        className="form-select mb-3 bg-dark text-light border-info"
        value={proveedor}
        onChange={(e) => setProveedor(e.target.value)}
      >
        <option value="">-- Seleccionar proveedor --</option>
        {proveedores.map((prov) => (
          <option key={prov.id} value={prov.id}>
            {prov.nombre}
          </option>
        ))}
      </select>

      {/* 💡 Cálculo detallado */}
      {priceOriginal && priceFinal && (
        <div
          className="bg-dark p-3 rounded border border-info text-info mb-3"
          style={{ lineHeight: "1.6" }}
        >
          <h6 className="text-light">📊 Cálculo del precio:</h6>
          <ul className="list-unstyled mb-2">
            <li>
              💰 Precio base:{" "}
              <strong>${parseFloat(priceOriginal).toFixed(2)}</strong>
            </li>

            {divideBy && divideBy > 0 && (
              <li>
                ➗ Dividido entre {divideBy}:{" "}
                <strong>
                  ${(parseFloat(priceOriginal) / parseFloat(divideBy)).toFixed(2)}
                </strong>
              </li>
            )}

            <li>
              ➕ Margen de ganancia ({markup}%):{" "}
              <strong>
                ${(
                  (parseFloat(divideBy) > 0
                    ? parseFloat(priceOriginal) / parseFloat(divideBy)
                    : parseFloat(priceOriginal)) *
                  (1 + markup / 100)
                ).toFixed(2)}
              </strong>
            </li>
          </ul>

          <div className="mt-2">
            ✅ <strong>Precio final sugerido:</strong>{" "}
            <span className="fs-5 text-success fw-bold">
              ${priceFinal}
            </span>
          </div>
        </div>
      )}

      {/* 🔄 Botones */}
      <button
        className={`btn ${markup === 30 ? "btn-info" : "btn-danger"} me-3`}
        onClick={() => setMarkup(markup === 30 ? 47 : 30)}
      >
        🔄 Margen actual: {markup}%
      </button>

      <button className="btn btn-success" onClick={handleSave}>
        💾 Guardar Producto
      </button>
    </div>
  );
}
