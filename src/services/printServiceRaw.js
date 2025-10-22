// src/services/printServiceRaw.jsx
export async function printTestTicketRaw(items) {
  // 🎟️ Armamos el ticket con comandos ESC/POS
  let ticket = "\x1B\x40"; // Reset
  ticket += "\x1B\x61\x01"; // Centrar
  ticket += "*** ALMACÉN PRO ***\n";
  ticket += "\x1B\x61\x00"; // Alinear a la izquierda
  ticket += "-----------------------------\n";

  items.forEach((item) => {
    ticket += `${item.nombre.padEnd(20)} ${item.precio}\n`;
  });

  ticket += "-----------------------------\n";
  ticket += "\x1B\x61\x01"; // Centrar
  ticket += "¡Gracias por su compra!\n\n\n";
  ticket += "\x1D\x56\x42\x00"; // Corte parcial

  // 🔐 Codificamos en Base64 (RawBT espera bytes binarios)
  const encoded = btoa(unescape(encodeURIComponent(ticket)));

  // 🧭 Intent: modo RAW (no texto)
  const intentUrl = `intent:rawbt.print#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;S.raw=${encoded};end`;

  // 🚀 Dispara el Intent → Android abre RawBT
  window.location.href = intentUrl;
}
