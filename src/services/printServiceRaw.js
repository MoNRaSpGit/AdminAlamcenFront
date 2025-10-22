// src/services/printServiceRaw.js
export async function printTestTicketRaw(items) {
  // Armar ticket con comandos ESC/POS
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

  // Convertir a Base64
  const bytes = new TextEncoder().encode(ticket);
  const base64 = btoa(String.fromCharCode(...bytes));

  // Abrir RawBT con la URL oficial
  const rawbtUrl = `rawbt://print?data=${base64}`;
  window.location.href = rawbtUrl;
}
