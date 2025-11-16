import { BotonEditar, BotonEliminar, BotonVer } from '../assets/AnimacionesExtra/BotonesTarjeta'
import './TarjetaJuego.css'

function TarjetaJuego({ juego, onEliminar, onEditar, onVer }) {
  const renderEstrellas = (puntuacion) => {
    const estrellasLlenas = '★'.repeat(puntuacion)
    const estrellasVacias = '☆'.repeat(5 - puntuacion)
    return estrellasLlenas + estrellasVacias
  }

  const descripcionRecortada = () => {
    const texto = juego.descripcion || 'Sin descripción disponible'
    const limite = 150
    
    if (texto.length <= limite) {
      return texto
    }
    
    return (
      <>
        {texto.substring(0, limite)}...{' '}
        <span 
          className="ver-mas-inline" 
          onClick={() => onVer && onVer(juego)}
        >
          Ver más
        </span>
      </>
    )
  }

  return (
    <div className="tarjeta-horizontal">
      <div className="tarjeta-imagen-horizontal">
        <img 
          src={juego.portada || 'https://via.placeholder.com/200x280?text=Sin+Portada'} 
          alt={juego.titulo}
          onError={(e) => e.target.src = 'https://via.placeholder.com/200x280?text=Error'}
        />
        {juego.completado && (
          <span className="badge-completado-horizontal">Completado</span>
        )}
      </div>

      <div className="tarjeta-contenido-horizontal">
        <div className="info-superior">
          <h3 className="titulo-horizontal">{juego.titulo}</h3>
          
          <div className="info-grid">
            <p><strong>Plataformas:</strong> {juego.plataforma}</p>
            <p><strong>Género:</strong> {juego.genero}</p>
            <p><strong>Año:</strong> {juego.anio || 'N/A'}</p>
            <p><strong>Desarrollador:</strong> {juego.desarrollador || 'N/A'}</p>
          </div>

          <div className="badge-puntuacion">
  <span className="estrella-icono-badge">★</span>
  <span className="puntuacion-numero">
    {(juego.puntuacion || 0).toFixed(1)}
  </span>
  <span className="puntuacion-max">/10</span>
</div>

          <p className="horas-horizontal">{juego.horasJugadas}h jugadas</p>
        </div>

        <div className="descripcion-horizontal">
          <p>{descripcionRecortada()}</p>
        </div>

        <div className="botones-horizontal">
          <BotonEditar onClick={() => onEditar(juego)} />
          <BotonEliminar onClick={() => {
            if(window.confirm('Eliminar este juego?')) {
              onEliminar(juego._id)
            }
          }} />
          <BotonVer onClick={() => onVer && onVer(juego)} />
        </div>
      </div>
    </div>
  )
}

export default TarjetaJuego