// src/pages/TestRawBT.jsx
import React from "react";
import { printTestTicketRaw } from "../services/printServiceRaw.js";

export default function TestRawBT() {
  const handlePrint = async () => {
    const items = [
      { nombre: "Coca Cola 2L", precio: "$150" },
      { nombre: "Arroz 1Kg", precio: "$120" },
      { nombre: "Pan Flauta", precio: "$90" },
    ];

    await printTestTicketRaw(items);
  };

  return (
    <div className="container text-light mt-5">
      <h2 className="text-info mb-4">🧾 Test de Impresora RAW (Wi-Fi)</h2>
      <p>
        Esta prueba manda el ticket directamente por IP a la impresora sin
        pasar por QZ Tray.
      </p>
      <button className="btn btn-success" onClick={handlePrint}>
        🖨️ Probar Impresión Wi-Fi
      </button>
    </div>
  );
}
