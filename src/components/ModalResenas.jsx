import { useState } from 'react'
import './ModalResenas.css'

const obtenerColorPuntaje = (valor) => {
  if (valor >= 9) return 'rgba(238, 174, 202, 0.2)'
  if (valor >= 8) return 'rgba(255, 215, 153, 0.2)'
  if (valor >= 6) return 'rgba(177, 221, 207, 0.2)'
  return 'rgba(186, 208, 255, 0.2)'
}

function ModalResenas({ review, onCerrar }) {
  const [cerrando, setCerrando] = useState(false)
  if (!review) return null

  const juego = review.juegoRelacionado || {}
  const puntaje = Number(review.puntuacion10 || 0)
  const colorPuntaje = obtenerColorPuntaje(puntaje)
  const fechaResena = review.fecha
    ? new Date(review.fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    : 'Fecha no disponible'

  const detallesJuego = [
    { label: 'Plataformas', value: juego.plataforma || 'Desconocida' },
    { label: 'Género', value: juego.genero || 'No indicado' },
    { label: 'Año', value: juego.anio || 'Sin dato' },
    { label: 'Desarrollador', value: juego.desarrollador || 'Sin registro' },
    { label: 'Horas jugadas', value: `${juego.horasJugadas || 0}h` },
    { label: 'Version resenada', value: juego.version || 'No registrada' }
  ]

  const handleCerrar = () => {
    setCerrando(true)
    setTimeout(() => onCerrar(), 250)
  }

  return (
    <div
      className={`modal-overlay ${cerrando ? 'cerrar-overlay' : ''}`}
      onClick={handleCerrar}
    >
      <div
        className={`modal-contenido ${cerrando ? 'cerrar-modal' : ''}`}
        style={{ '--score-glow': colorPuntaje }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-cerrar" onClick={handleCerrar} aria-label="Cerrar resena">
          X
        </button>

        <div className="modal-layout">
          <div className="modal-cover-shell">
            <div className="modal-cover-stack">
              <div className="modal-cover-card">
                <div className="modal-cover-glow" aria-hidden="true"></div>
                <img
                  src={review.juegoPortada || 'https://via.placeholder.com/400x600?text=Sin+Portada'}
                  alt={juego.titulo || review.titulo}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x600?text=Error'
                  }}
                />
                <div className="modal-game-name-vertical">
                  <span>{juego.titulo || review.titulo || 'Juego no encontrado'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-body-stack">
            <div className="modal-top-row">
              <div className="modal-title-block">
                <p className="modal-chip">{juego.titulo || 'Resena'}</p>
                <h2 className="modal-review-title">{review.titulo || 'Resena sin titulo'}</h2>
              </div>
              <div
                className="modal-score-resena"
                aria-label={`Puntuacion ${puntaje.toFixed(1)} de 10`}
              >
                <span className="modal-score-number">{puntaje.toFixed(1)}</span>
                <span className="modal-score-label">/ 10</span>
              </div>
            </div>

            <div className="modal-date-row">
              <span className="modal-fecha-chip">{fechaResena}</span>
            </div>

            <div className="modal-review-box simple">
              <p>{review.contenido || 'Sin descripcion disponible'}</p>
            </div>

            <div className="modal-mini-info">
              {detallesJuego.slice(0, 3).map((item) => (
                <div className="modal-info-item" key={item.label}>
                  <span className="modal-info-label">{item.label}</span>
                  <p>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalResenas
