import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-info">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-dark" to="/">
          🏪 AdminAlmacén
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/productos">
                📦 Productos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/no-actualizados">
                ⚠️ No Actualizados
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/escaner">
                📷 Escáner
              </Link>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
