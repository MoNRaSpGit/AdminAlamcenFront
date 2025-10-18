// src/services/printService.js
import qz from "qz-tray";

// ========== CONEXIÓN ==========
export async function connectQZ() {
  if (qz.websocket.isActive()) return;

  try {
    await qz.websocket.connect();
    console.log("🟢 QZ conectado correctamente");
  } catch (error) {
    console.error("❌ Error al conectar con QZ:", error);
    alert("No se pudo conectar con QZ Tray. Verificá que esté abierto.");
  }
}

export async function disconnectQZ() {
  if (qz.websocket.isActive()) {
    await qz.websocket.disconnect();
    console.log("🔴 QZ desconectado");
  }
}

// ========== OBTENER IMPRESORAS ==========
export async function getDefaultPrinter() {
  await connectQZ();
  return await qz.printers.getDefault();
}

export async function listPrinters() {
  await connectQZ();
  return await qz.printers.find();
}

// ========== FUNCIONES AUXILIARES ESC/POS ==========
const ESC = "\x1B";
const GS = "\x1D";

const INIT = ESC + "@";
const ALIGN_L = ESC + "a" + "\x00";
const ALIGN_C = ESC + "a" + "\x01";
const ALIGN_R = ESC + "a" + "\x02";
const BOLD_ON = ESC + "E" + "\x01";
const BOLD_OFF = ESC + "E" + "\x00";
const DOUBLE_ON = GS + "!" + "\x11"; // doble ancho/alto
const DOUBLE_OFF = GS + "!" + "\x00";
const CUT_FULL = GS + "V" + "\x00"; // corte total

// separador de líneas
function line(char = "-") {
  return char.repeat(42) + "\n";
}

// alinear nombre / precio
function lr(name, value) {
  const max = 42;
  const left = name.toString();
  const right = value.toString();
  const spaces = Math.max(1, max - left.length - right.length);
  return left + " ".repeat(spaces) + right + "\n";
}

// ========== TICKET ==========
export async function printTestTicket(printerName = null, items = []) {
  await connectQZ();

  const printer = printerName || (await qz.printers.getDefault());
  const config = qz.configs.create(printer);

  // Fecha y hora sin caracteres raros
  const now = new Date();
  const fecha = now.toLocaleDateString("es-UY");
  let horas = now.getHours();
  const minutos = String(now.getMinutes()).padStart(2, "0");
  const segundos = String(now.getSeconds()).padStart(2, "0");
  const ampm = horas >= 12 ? "PM" : "AM";
  horas = horas % 12 || 12;
  const horaFormateada = `${horas}:${minutos}:${segundos} ${ampm}`;

  // 🧾 Encabezado
  const header = [
    INIT,
    ALIGN_C, BOLD_ON, DOUBLE_ON, "KIOSCO PILOTO\n", DOUBLE_OFF, BOLD_OFF,
    ALIGN_C, "RUT: 12345678-9\n",
    ALIGN_C, "Tacuarembo - Uruguay\n",
    line("-"),
  ];

  // 🛒 Lista de productos
  const lista = items.length
    ? items
    : [
        { nombre: "Yogur Clady 460g", precio: "$83.00" },
        { nombre: "Dorito 250g", precio: "$238.00" },
        { nombre: "Galleta de arroz sin sal", precio: "$88.00" },
        { nombre: "Coca 500 ml", precio: "$68.00" },
        { nombre: "Dante flan x2", precio: "$62.00" },
        { nombre: "Puré de papa Puritas", precio: "$41.00" },
      ];

  const cuerpo = lista.flatMap((p) => [ALIGN_L, lr(p.nombre, p.precio)]);

  // 🧮 Calcular total
  const total = lista.reduce((acc, p) => {
    const precio = parseFloat(p.precio.replace("$", "").trim());
    return acc + (isNaN(precio) ? 0 : precio);
  }, 0);

  // 🧾 Footer
  const footer = [
    line("-"),
    BOLD_ON,
    ALIGN_L,
    lr(`TOTAL (${lista.length} prod.)`, `$${total.toFixed(2)}`),
    BOLD_OFF,
    line("-"),
    ALIGN_C,
    `Fecha: ${fecha}  ${horaFormateada}\n`,
    ALIGN_C,
    " Gracias por su compra!\n",
  ];

  // 📏 Feed dinámico (para tickets cortos)
  const cantidadItems = lista.length;
  let extraFeed = 0;
  if (cantidadItems <= 3) extraFeed = 12;
  else if (cantidadItems <= 6) extraFeed = 8;
  else extraFeed = 4;

  const feedLines = Array(extraFeed).fill("\n").join("");

  // Datos finales
  const data = [
    ...header,
    ...cuerpo,
    ...footer,
    feedLines,
    CUT_FULL, // ✂️ corte total
  ];

  try {
    await qz.print(config, data);
    console.log("🖨️ Ticket enviado correctamente.");
  } catch (error) {
    console.error("❌ Error al imprimir:", error);
    alert("Error al imprimir con QZ Tray. Verificá la conexión.");
  }
}
