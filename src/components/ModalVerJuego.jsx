import { useState } from "react";
import "./ModalVerJuego.css";

function ModalVerJuego({ juego, onCerrar }) {
  const [cerrando, setCerrando] = useState(false);

  if (!juego) return null;

  const handleCerrar = () => {
    setCerrando(true);
    setTimeout(() => onCerrar(), 300); 
  };

  const renderEstrellas = (puntuacion) => {
    const llenas = '★'.repeat(puntuacion || 0)
    const vacias = '☆'.repeat(5 - (puntuacion || 0))
    return llenas + vacias
  }

  return (
    <div
  className={`modal-overlay ${cerrando ? "cerrar-overlay" : ""}`}
  onClick={handleCerrar}
>
  <div
    className={`modal-contenido ${cerrando ? "cerrar-modal" : ""}`}
    onClick={(e) => e.stopPropagation()}
  >
        <button className="modal-cerrar" onClick={handleCerrar}>
          ✕
        </button>
        
        <div className="modal-grid">
          <div className="modal-izquierda">
            <img 
              src={juego.portada || 'https://via.placeholder.com/400x600?text=Sin+Portada'} 
              alt={juego.titulo}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/400x600?text=Error' }}
            />
            {juego.completado && (
              <span className="modal-badge">Completado</span>
            )}
          </div>

          <div className="modal-derecha">
            <h2>{juego.titulo}</h2>
            
            <div className="modal-info-grid">
              <div className="modal-info-item">
                <strong>Plataformas</strong>
                <p>{juego.plataforma || 'N/A'}</p>
              </div>
              
              <div className="modal-info-item">
                <strong>Género</strong>
                <p>{juego.genero || 'N/A'}</p>
              </div>
              
              <div className="modal-info-item">
                <strong>Año</strong>
                <p>{juego.anio || 'N/A'}</p>
              </div>
              
              <div className="modal-info-item">
                <strong>Desarrollador</strong>
                <p>{juego.desarrollador || 'N/A'}</p>
              </div>
              
              <div className="modal-info-item">
                <strong>Horas jugadas</strong>
                <p>{juego.horasJugadas || 0}h</p>
              </div>
              
              <div className="modal-info-item">
                <strong>Puntuación</strong>
                <p className="modal-estrellas">{renderEstrellas(juego.puntuacion)}</p>
              </div>
            </div>

            <div className="modal-descripcion">
              <strong>Descripción</strong>
              <p>{juego.descripcion || 'Sin descripción disponible'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalVerJuego