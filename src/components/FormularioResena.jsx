import { useState, useEffect } from 'react'
import './FormularioJuego.css'

function FormularioResena({ juegos, resenaEditar, onGuardar, onCancelar }) {
  const [formData, setFormData] = useState({
    juegoId: '',
    titulo: '',
    contenido: '',
    puntuacion: 5
  })

  useEffect(() => {
    if (resenaEditar) {
      setFormData(resenaEditar)
    }
  }, [resenaEditar])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onGuardar(formData)
    setFormData({
      juegoId: '',
      titulo: '',
      contenido: '',
      puntuacion: 5
    })
  }

  const formTitle = resenaEditar ? ' Editar Reseña' : ' Escribir Reseña'

  return (
    <div className="formulario-overlay formulario-overlay-acrylic" role="dialog" aria-modal="true">
      <div className="formulario-container-acrylic formulario-resena">
        <form onSubmit={handleSubmit} className="formulario-juego formulario-grid formulario-resena-grid">
          <h2 className="formulario-titulo">{formTitle}</h2>

          <label className="form-group legacy-label">
            <span>Juego *</span>
            <select
              name="juegoId"
              value={formData.juegoId}
              onChange={handleChange}
              required
              disabled={Boolean(resenaEditar)}
            >
              <option value="">Selecciona un juego</option>
              {juegos.map(juego => (
                <option key={juego._id} value={juego._id}>
                  {juego.titulo}
                </option>
              ))}
            </select>
          </label>

          <label className="form-group legacy-label">
            <span>Título de la reseña *</span>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              placeholder="Ej: Una experiencia inolvidable"
            />
          </label>

          <label className="form-group legacy-label">
            <span>Puntuación (1-5 estrellas) *</span>
            <div className="rating-input-wrapper">
              <input
                type="number"
                name="puntuacion"
                min="1"
                max="5"
                value={formData.puntuacion}
                onChange={handleChange}
                required
              />
              <span className="rating-helper">{`⭐`.repeat(formData.puntuacion)}</span>
            </div>
          </label>

          <label className="form-group form-group-full legacy-label">
            <span>Contenido *</span>
            <textarea
              name="contenido"
              value={formData.contenido}
              onChange={handleChange}
              required
              rows="6"
              placeholder="Escribe tu reseña aquí..."
            />
          </label>

          <div className="formulario-acciones form-actions">
            <button type="submit" className="btn-primary btn-submit-acrylic">
              {resenaEditar ? 'Guardar Cambios' : 'Publicar Reseña'}
            </button>
            <button type="button" className="btn-secondary btn-cancel-acrylic" onClick={onCancelar}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormularioResena
