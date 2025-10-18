import React from "react";
import Navbar from "../components/Navbar";
import "../styles/print.css"; // 👈 Estilos del ticket

export default function ImprimirPrueba() {
    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Navbar />
            <div className="print-container">
                {/* ✅ Todo lo visible en la web */}
                <div className="preview-area no-print">
                    <h2 className="titulo-pagina">🧾 Prueba de Impresión</h2>
                    <p className="texto-descripcion">
                        Este ticket está diseñado con estilo de kiosco / supermercado.
                    </p>
                </div>

                {/* 🎟️ Ticket real */}
                <div className="ticket">
                    <h3 className="ticket-header">KIOSCO PILOTO</h3>
                    <p className="ticket-sub">RUT: 12345678-9</p>
                    <p className="ticket-sub">Tacuarembó - Uruguay</p>
                    <hr />

                    <div className="ticket-body">
                        <div className="ticket-item">
                            <span className="nombre">Pan de campo</span>
                            <span className="separador">------</span>
                            <span className="precio">$120</span>
                        </div>
                        <div className="ticket-item">
                            <span className="nombre">Refresco 1.5L</span>
                            <span className="separador">------</span>
                            <span className="precio">$95</span>
                        </div>
                        <div className="ticket-item">
                            <span className="nombre">Galletas surtidas</span>
                            <span className="separador">------</span>
                            <span className="precio">$88</span>
                        </div>
                    </div>
                    <hr />
                    <div className="ticket-total">
                        <span>Total:</span>
                        <span className="total-valor">$303</span>
                    </div>
                    <hr />

                    <p className="ticket-footer">
                        Fecha: {new Date().toLocaleString()}
                    </p>
                    <p className="ticket-footer">¡Gracias por su compra! 💚</p>
                </div>

                {/* Botón solo visible en la web */}
                <button onClick={handlePrint} className="btn btn-success mt-3 no-print">
                    🖨️ Imprimir Ticket
                </button>
            </div>
        </>
    );
}
