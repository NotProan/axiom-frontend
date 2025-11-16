import './ModalVerJuego.css'

function ModalVerJuego({ juego, onCerrar }) {
  if (!juego) return null

  const renderEstrellas = (puntuacion) => {
    return '★'.repeat(puntuacion) + '☆'.repeat(5 - puntuacion)
  }

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
        <button className="modal-cerrar" onClick={onCerrar}>✕</button>
        
        <div className="modal-grid">
          <div className="modal-izquierda">
            <img 
              src={juego.portada || 'https://via.placeholder.com/400x600?text=Sin+Portada'} 
              alt={juego.titulo}
              onError={(e) => e.target.src = 'https://via.placeholder.com/400x600?text=Error'}
            />
            {juego.completado && (
              <span className="modal-badge">Completado</span>
            )}
          </div>

          <div className="modal-derecha">
            <h2>{juego.titulo}</h2>
            
            <div className="modal-info-grid">
              <div className="modal-info-item">
                <strong>Plataformas:</strong>
                <p>{juego.plataforma}</p>
              </div>
              
              <div className="modal-info-item">
                <strong>Género:</strong>
                <p>{juego.genero}</p>
              </div>
              
              <div className="modal-info-item">
                <strong>Año:</strong>
                <p>{juego.anio || 'N/A'}</p>
              </div>
              
              <div className="modal-info-item">
                <strong>Desarrollador:</strong>
                <p>{juego.desarrollador || 'N/A'}</p>
              </div>
              
              <div className="modal-info-item">
                <strong>Horas jugadas:</strong>
                <p>{juego.horasJugadas}h</p>
              </div>
              
              <div className="modal-info-item">
                <strong>Puntuación:</strong>
                <p className="modal-estrellas">{renderEstrellas(juego.puntuacion)}</p>
              </div>
            </div>

            <div className="modal-descripcion">
              <strong>Descripción:</strong>
              <p>{juego.descripcion || 'Sin descripción disponible'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalVerJuego