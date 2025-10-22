// src/services/printServiceRaw.jsx
export async function printTestTicketRaw(items) {
  // Armamos el texto del ticket
  let ticket = "*** ALMACÉN PRO ***\n";
  ticket += "-----------------------------\n";
  items.forEach((item) => {
    ticket += `${item.nombre.padEnd(20)} ${item.precio}\n`;
  });
  ticket += "-----------------------------\n";
  ticket += "¡Gracias por su compra!\n\n\n";

  // Codificamos el texto en Base64 (formato que RawBT entiende)
  const encoded = btoa(unescape(encodeURIComponent(ticket)));

  // Construimos la URL tipo Intent
  const intentUrl = `intent:rawbt.print#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;S.text=${encoded};end`;

  // Redirigimos al Intent → Android abre RawBT automáticamente
  window.location.href = intentUrl;
}
