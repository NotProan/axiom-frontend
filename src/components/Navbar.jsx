import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleAgregarJuego = () => {
    if (location.pathname !== '/biblioteca') {
      navigate('/biblioteca')
    }
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('abrirFormularioJuego'))
    }, 100)
  }

  return (
    <nav className="navbar-compact">
      <div className="navbar-container-compact">
        <Link to="/" className="navbar-logo-compact">
          GAMETRACKER
        </Link>
        
        <ul className="navbar-menu-compact">
          <li>
            <Link to="/" className="navbar-link-compact">Inicio</Link>
          </li>
          <li>
            <Link to="/biblioteca" className="navbar-link-compact">Biblioteca</Link>
          </li>
          <li>
            <Link to="/resenas" className="navbar-link-compact">Reseñas</Link>
          </li>
          <li>
            <Link to="/estadisticas" className="navbar-link-compact">Estadísticas</Link>
          </li>
        </ul>

        <div className="navbar-actions">
          <button className="btn-add-game" onClick={handleAgregarJuego}>
            Agregar Juego
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar