import { Link, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-info">
      <div className="container-fluid">
        {/* 🏪 Logo / título */}
        <Link className="navbar-brand fw-bold text-dark" to="/">
          🏪 AdminAlmacén
        </Link>

        {/* Botón hamburguesa */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenido del menú */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link text-dark" to="/productos">
                📦 Productos
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link text-dark" to="/no-actualizados">
                ⚠️ No Actualizados
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link text-dark" to="/escaner">
                📷 Escáner
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link text-dark" to="/productos-proveedores">
                🏷️ Asignar Proveedores
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link text-dark" to="/productos-proveedor">
                🏭 Productos por Proveedor
              </NavLink>
            </li>

            {/* 🆕 Nueva opción: impresión */}
            <li className="nav-item">
              <NavLink className="nav-link text-dark" to="/imprimir-qz">
                🖨️ QZ Directo
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-dark" to="/test-raw">
                📡 RawBT Wi-Fi
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
