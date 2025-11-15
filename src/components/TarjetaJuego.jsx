import { useState } from 'react'
import './TarjetaJuego.css'

function TarjetaJuego({ juego, onEliminar, onEditar }) {
  const renderEstrellas = (puntuacion) => {
    return '⭐'.repeat(puntuacion) + '☆'.repeat(5 - puntuacion)
  }

  return (
    <div className="tarjeta-juego-acrylic">
      <div className="tarjeta-container">
        {/* Portada a la izquierda */}
        <div className="tarjeta-portada">
          <img 
            src={juego.portada || 'https://via.placeholder.com/200x280?text=Sin+Portada'} 
            alt={juego.titulo}
            onError={(e) => e.target.src = 'https://via.placeholder.com/200x280?text=Error'}
          />
          {juego.completado && (
            <span className="badge-completado">✓ Completado</span>
          )}
        </div>

        {/* Información a la derecha */}
        <div className="tarjeta-info">
          <h3 className="tarjeta-titulo">{juego.titulo}</h3>
          
          <div className="tarjeta-detalles">
            <p><strong>Plataformas:</strong> {juego.plataforma}</p>
            <p><strong>Género:</strong> {juego.genero}</p>
            <p><strong>Año:</strong> {new Date(juego.fechaAgregado).getFullYear()}</p>
            <p><strong>Desarrollador:</strong> {juego.desarrollador || 'N/A'}</p>
          </div>

          <div className="tarjeta-puntuacion">
            {renderEstrellas(juego.puntuacion)}
          </div>

          <div className="tarjeta-descripcion">
            <p><strong>Descripción</strong></p>
            <p>⏱️ {juego.horasJugadas} horas jugadas</p>
          </div>

          <div className="tarjeta-acciones">
            <button 
              className="btn-editar"
              onClick={() => onEditar(juego)}
            >
              ✏️ Editar
            </button>
            <button 
              className="btn-eliminar"
              onClick={() => {
                if(window.confirm('¿Eliminar este juego?')) {
                  onEliminar(juego._id)
                }
              }}
            >
              🗑️ Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TarjetaJuego