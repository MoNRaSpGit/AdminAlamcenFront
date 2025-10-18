import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  connectQZ,
  listPrinters,
  getDefaultPrinter,
  printTestTicket,
  disconnectQZ,
} from "../services/printService";

export default function ImprimirQZ() {
  const [status, setStatus] = useState("QZ: desconectado");
  const [printers, setPrinters] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    // Conectar automáticamente al cargar la página
    (async () => {
      try {
        await connectQZ();
        setStatus("🟢 QZ conectado correctamente");
        const lista = await listPrinters();
        setPrinters(lista);
        const def = await getDefaultPrinter();
        setSelected(def);
      } catch (e) {
        console.error(e);
        setStatus("❌ No se pudo conectar con QZ Tray");
      }
    })();

    // Desconectar al salir (opcional)
    return () => {
      disconnectQZ().catch(() => {});
    };
  }, []);

  const handlePrint = async () => {
    setStatus("🕓 Enviando ticket...");
    try {
      await printTestTicket(selected);
      setStatus("✅ Ticket impreso correctamente");
    } catch (err) {
      console.error(err);
      setStatus("❌ Error al imprimir");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ maxWidth: 600, marginTop: 30 }}>
        <h2>🖨️ Prueba de impresión con QZ Tray</h2>
        <p className="mt-3">{status}</p>

        <div className="mb-3">
          <label className="form-label fw-bold">Seleccionar impresora</label>
          <select
            className="form-select"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            {printers.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <button className="btn btn-success" onClick={handlePrint}>
          🧾 Imprimir ticket de prueba
        </button>
      </div>
    </>
  );
}
