import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
      <nav className="navbar">
        <Link className="navbar-link" to="/">Tablero</Link>{" "}
        <Link className="navbar-link" to="/new-ticket">Crear Ticket</Link>
      </nav>
  );
}