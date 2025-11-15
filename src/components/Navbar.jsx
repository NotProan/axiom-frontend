import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          GameTracker
        </Link>
        <ul className="navbar-menu">
          <li>
            <Link to="/" className="navbar-link">Biblioteca</Link>
          </li>
          <li>
            <Link to="/resenas" className="navbar-link">Reseñas</Link>
          </li>
          <li>
            <Link to="/estadisticas" className="navbar-link">Estadísticas</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar