// printServiceRaw.js
export async function printTestTicketRaw(items) {
  try {
    // Dirección e IP de tu impresora Xprinter
    const ip = "192.168.1.123";
    const port = 9100;

    // Convertimos el ticket en texto ESC/POS simple
    let ticket = "\x1B\x40"; // Reset ESC/POS
    ticket += "     *** ALMACÉN PRO ***\n";
    ticket += "-----------------------------\n";
    items.forEach((item) => {
      ticket += `${item.nombre.padEnd(20)} ${item.precio}\n`;
    });
    ticket += "-----------------------------\n";
    ticket += "¡Gracias por su compra!\n\n\n";
    ticket += "\x1D\x56\x42\x00"; // Corte parcial

    // Enviamos los bytes a la impresora por socket TCP
    const socket = new WebSocket(`ws://${ip}:${port}`);
    socket.binaryType = "arraybuffer";

    socket.onopen = () => {
      const encoder = new TextEncoder();
      socket.send(encoder.encode(ticket));
      socket.close();
    };

    socket.onerror = (err) => {
      console.error("❌ Error enviando a RawBT:", err);
      alert("Error al enviar el ticket a la impresora Wi-Fi.");
    };
  } catch (err) {
    console.error("Error general de impresión:", err);
  }
}
