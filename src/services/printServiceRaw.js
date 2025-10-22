// src/services/printServiceRaw.js
export function buildTicketBase64(items) {
  let t = "\x1B\x40";              // init
  t += "\x1B\x61\x01";             // center
  t += "*** ALMACÉN PRO ***\n";
  t += "\x1B\x61\x00";             // left
  t += "-----------------------------\n";
  for (const it of items) {
    t += `${(it.nombre || "").padEnd(20)} ${it.precio || ""}\n`;
  }
  t += "-----------------------------\n";
  t += "\x1B\x61\x01";             // center
  t += "¡Gracias por su compra!\n\n\n";
  t += "\x1D\x56\x42\x00";         // cut

  // bytes → base64
  const bytes = new TextEncoder().encode(t);
  return btoa(String.fromCharCode(...bytes));
}
