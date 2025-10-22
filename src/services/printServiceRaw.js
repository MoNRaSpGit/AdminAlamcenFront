// src/services/printServiceRaw.js
export async function printTestTicketRaw(items) {
  // Armamos ticket ESC/POS real
  let ticket = "\x1B\x40"; // Reset
  ticket += "\x1B\x61\x01"; // Centrar
  ticket += "*** ALMACÉN PRO ***\n";
  ticket += "\x1B\x61\x00"; // Izquierda
  ticket += "-----------------------------\n";
  items.forEach((item) => {
    ticket += `${item.nombre.padEnd(20)} ${item.precio}\n`;
  });
  ticket += "-----------------------------\n";
  ticket += "\x1B\x61\x01"; // Centrar
  ticket += "¡Gracias por su compra!\n\n\n";
  ticket += "\x1D\x56\x42\x00"; // Corte parcial

  // Codificar en Base64 real
  const bytes = new TextEncoder().encode(ticket);
  const base64Data = btoa(String.fromCharCode(...bytes));

  // Intent en modo RAW (binario)
  const intent = `intent:rawbt.print#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;S.mimeType=application/octet-stream;S.data=${base64Data};end`;

  // Dispara el Intent → abre RawBT
  window.location.href = intent;
}
