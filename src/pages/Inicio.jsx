import './Inicio.css'

function Inicio() {
  return (
    <div className="inicio-container">
      <div className="inicio-content">
        <h1 className="inicio-titulo">Bienvenido a Axiom</h1>
        <p className="inicio-subtitulo">
          Tu biblioteca personal de videojuegos
        </p>
        <p className="inicio-descripcion">
          Axiom es una plataforma minimalista diseñada para organizar, 
          explorar y gestionar tus juegos con claridad y precisión. 
          Simplifica tu biblioteca, registra tu progreso y mantén tus datos 
          siempre accesibles en un espacio limpio y moderno.
        </p>

        <p className="inicio-descripcion">
            Axiom te permite guardar tus juegos, trackear tu avance y 
            mantener tu biblioteca siempre organizada. Todo en una 
            interfaz limpia y eficiente pensada para jugadores que 
            valoran el orden.
        </p>
        
        <div className="inicio-acciones">
          <a href="/biblioteca" className="btn-inicio-primary">
            Ver Biblioteca
          </a>
          <a href="/resenas" className="btn-inicio-secondary">
            Ver Reseñas
          </a>
          <a href="/estadisticas" className="btn-inicio-secondary">
            Ver Estadísticas
          </a>
        </div>

        <div className="inicio-caracteristicas">
          <div className="caracteristica">
            <div className="caracteristica-icono">🎮</div>
            <h3>Biblioteca Personal</h3>
            <p>Organiza todos tus juegos</p>
          </div>
          <div className="caracteristica">
            <div className="caracteristica-icono">📝</div>
            <h3>Reseñas</h3>
            <p>Escribe tus opiniones</p>
          </div>
          <div className="caracteristica">
            <div className="caracteristica-icono">📊</div>
            <h3>Estadísticas</h3>
            <p>Analiza tu progreso</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Inicio