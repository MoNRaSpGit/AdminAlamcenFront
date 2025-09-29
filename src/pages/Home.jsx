import { useState } from "react";

function Home() {
  const [respuesta, setRespuesta] = useState("Todavía no hay respuesta...");

  const consultarBackend = async () => {
    try {
      const res = await fetch("https://backadminalmacen.onrender.com/api/ping");
      const data = await res.json();
      setRespuesta(data.message);
    } catch (err) {
      setRespuesta("❌ Error conectando al backend: " + err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Frontend AdminAlmacen</h1>
      <p>Respuesta del backend:</p>
      <p><strong>{respuesta}</strong></p>
      <button className="btn btn-primary" onClick={consultarBackend}>
        Consultar Backend
      </button>
    </div>
  );
}

export default Home;
