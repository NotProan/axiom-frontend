import { useState, useEffect } from 'react'
import './FormularioJuego.css'

function FormularioJuego({ juegoEditar, onGuardar, onCancelar }) {
  const [formData, setFormData] = useState({
    titulo: '',
    portada: '',
    plataforma: '',
    genero: '',
    completado: false,
    puntuacion: 0,
    horasJugadas: 0
  })

  useEffect(() => {
    if (juegoEditar) {
      setFormData(juegoEditar)
    }
  }, [juegoEditar])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onGuardar(formData)
    setFormData({
      titulo: '',
      portada: '',
      plataforma: '',
      genero: '',
      completado: false,
      puntuacion: 0,
      horasJugadas: 0
    })
  }

  return (
    <div className="formulario-overlay">
      <form className="formulario-juego" onSubmit={handleSubmit}>
        <h2>{juegoEditar ? ' Editar Juego' : ' Agregar Juego'}</h2>
        
        <label>
          Título *
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
            placeholder="Ej: The Last of Us"
          />
        </label>

        <label>
          URL de Portada
          <input
            type="url"
            name="portada"
            value={formData.portada}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </label>

        <label>
          Plataforma *
          <select name="plataforma" value={formData.plataforma} onChange={handleChange} required>
            <option value="">Selecciona una plataforma</option>
            <option value="PlayStation 5">PlayStation 5</option>
            <option value="PlayStation 4">PlayStation 4</option>
            <option value="Xbox Series X/S">Xbox Series X/S</option>
            <option value="Xbox One">Xbox One</option>
            <option value="Nintendo Switch">Nintendo Switch</option>
            <option value="PC">PC</option>
            <option value="Mobile">Mobile</option>
          </select>
        </label>

        <label>
          Género *
          <select name="genero" value={formData.genero} onChange={handleChange} required>
            <option value="">Selecciona un género</option>
            <option value="Acción">Acción</option>
            <option value="Aventura">Aventura</option>
            <option value="RPG">RPG</option>
            <option value="Deportes">Deportes</option>
            <option value="Estrategia">Estrategia</option>
            <option value="Puzzle">Puzzle</option>
            <option value="Terror">Terror</option>
            <option value="Simulación">Simulación</option>
          </select>
        </label>

        <label>
          Puntuación (1-5 estrellas)
          <input
            type="number"
            name="puntuacion"
            min="0"
            max="5"
            value={formData.puntuacion}
            onChange={handleChange}
          />
        </label>

        <label>
          Horas Jugadas
          <input
            type="number"
            name="horasJugadas"
            min="0"
            value={formData.horasJugadas}
            onChange={handleChange}
          />
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="completado"
            checked={formData.completado}
            onChange={handleChange}
          />
          ¿Juego completado?
        </label>

        <div className="formulario-acciones">
          <button type="submit" className="btn-primary">
            {juegoEditar ? 'Guardar Cambios' : 'Agregar Juego'}
          </button>
          <button type="button" className="btn-secondary" onClick={onCancelar}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default FormularioJuego