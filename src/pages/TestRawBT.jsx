// src/pages/TestRawBT.jsx
import React from "react";
import Navbar from "../components/Navbar";
import { buildTicketBase64 } from "../services/printServiceRaw";

export default function TestRawBT() {
  const items = [
    { nombre: "Coca Cola 2L", precio: "$150" },
    { nombre: "Arroz 1Kg", precio: "$120" },
    { nombre: "Pan Flauta", precio: "$90" },
  ];

  const base64 = buildTicketBase64(items);

  const openRawbtIntent = () => {
    // Intent clásico (Android abre RawBT)
    const url = `intent:rawbt.print#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;S.mimeType=application/octet-stream;S.data=${encodeURIComponent(base64)};end`;
    window.location.href = url; // debe ejecutarse por tap del usuario
  };

  const openRawbtScheme = () => {
    // Protocolo rawbt:// (algunas ROMs lo prefieren)
    const url = `rawbt://print?data=${encodeURIComponent(base64)}`;
    // usar un <a> clickable ayuda a que Android asocie la app
    const a = document.createElement("a");
    a.href = url;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const isAndroid = /Android/i.test(navigator.userAgent);

  return (
    <>
      <Navbar />
      <div className="container text-light mt-5">
        <h2 className="text-info mb-3">🧾 Test RawBT (Android)</h2>
        {!isAndroid && (
          <div className="alert alert-warning">
            Abrí esta página desde la <b>tablet Android</b> con RawBT instalado.
          </div>
        )}

        <p>Probá los dos métodos. Debe abrir la app <b>RawBT</b> con la vista previa del ticket.</p>

        <button className="btn btn-success me-2" onClick={openRawbtIntent}>
          🚀 Abrir RawBT (Intent)
        </button>

        <button className="btn btn-primary" onClick={openRawbtScheme}>
          🔗 Abrir RawBT (rawbt://)
        </button>

        <p className="mt-3">
          Si abre RawBT pero imprime en blanco, dentro de RawBT revisá:
          <br />• Printer language: <b>ESC/POS</b> &nbsp;• Encoding: <b>UTF-8</b> &nbsp;• Seleccioná tu impresora Wi-Fi
        </p>
      </div>
    </>
  );
}
