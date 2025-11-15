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

  return (
    <div className="formulario-overlay">
      <form className="formulario-juego" onSubmit={handleSubmit}>
        <h2>{resenaEditar ? ' Editar Reseña' : ' Escribir Reseña'}</h2>
        
        <label>
          Juego *
          <select 
            name="juegoId" 
            value={formData.juegoId} 
            onChange={handleChange} 
            required
            disabled={resenaEditar}
          >
            <option value="">Selecciona un juego</option>
            {juegos.map(juego => (
              <option key={juego._id} value={juego._id}>
                {juego.titulo}
              </option>
            ))}
          </select>
        </label>

        <label>
          Título de la reseña *
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
            placeholder="Ej: Una experiencia inolvidable"
          />
        </label>

        <label>
          Puntuación (1-5 estrellas) *
          <input
            type="number"
            name="puntuacion"
            min="1"
            max="5"
            value={formData.puntuacion}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Contenido *
          <textarea
            name="contenido"
            value={formData.contenido}
            onChange={handleChange}
            required
            rows="6"
            placeholder="Escribe tu reseña aquí..."
          />
        </label>

        <div className="formulario-acciones">
          <button type="submit" className="btn-primary">
            {resenaEditar ? 'Guardar Cambios' : 'Publicar Reseña'}
          </button>
          <button type="button" className="btn-secondary" onClick={onCancelar}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default FormularioResena