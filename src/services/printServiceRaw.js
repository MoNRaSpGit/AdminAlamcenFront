// src/services/printServiceRaw.jsx
export async function printTestTicketRaw(items) {
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
  ticket += "\x1D\x56\x42\x00"; // Corte

  // Convertir a Base64 real
  const bytes = new TextEncoder().encode(ticket);
  const base64 = btoa(String.fromCharCode(...bytes));

  // RawBT esquema actualizado (recomendado)
  const rawbtUrl = `rawbt://print?data=${base64}`;

  // Dispara la impresión
  window.location.href = rawbtUrl;
}
