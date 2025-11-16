import { useState, useEffect } from 'react'
import './FormularioJuego.css'

function FormularioJuego({ juegoEditar, onGuardar, onCancelar }) {
  const [formData, setFormData] = useState({
    titulo: '',
    portada: '',
    plataforma: [],
    genero: [],
    completado: false,
    puntuacion: 0,
    horasJugadas: 0,
    descripcion: '',
    anio: new Date().getFullYear(),
    desarrollador: ''
  })

  const plataformasDisponibles = [
    'PlayStation 5', 'PlayStation 4', 'PlayStation 3', 'Xbox Series X/S', 'Xbox 360',
    'Xbox One', 'Nintendo Switch', 'PC', 'Mobile'
  ]
const generosDisponibles = [
  'Acción',
  'Aventura',
  'RPG',
  'Deportes',
  'Estrategia',
  'Puzzle',
  'Terror',
  'Simulación',
  'Mundo abierto',
  'Plataforma',
  'Shooter',
  'Roguelike',
  'Carreras',
  'Sigilo',
  'Shooter Looter',
  'Thriller',
  'Metroidvania'
]


  useEffect(() => {
    if (juegoEditar) {
      setFormData({
        ...juegoEditar,
        plataforma: Array.isArray(juegoEditar.plataforma) 
          ? juegoEditar.plataforma 
          : juegoEditar.plataforma.split(', '),
        genero: Array.isArray(juegoEditar.genero) 
          ? juegoEditar.genero 
          : juegoEditar.genero.split(', ')
      })
    }
  }, [juegoEditar])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleMultiSelect = (name, value) => {
    const currentArray = formData[name]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    
    setFormData({
      ...formData,
      [name]: newArray
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const dataToSend = {
      ...formData,
      plataforma: formData.plataforma.join(', '),
      genero: formData.genero.join(', ')
    }
    
    onGuardar(dataToSend)
  }

  return (
    <div className="formulario-overlay-acrylic">
      <div className="formulario-container-acrylic">
        <h2 className="formulario-titulo">
          {juegoEditar ? 'Editar Juego' : 'Agregar Nuevo Juego'}
        </h2>

        <form onSubmit={handleSubmit} className="formulario-grid">
          <div className="form-group">
            <label>Título</label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              placeholder="Ej: The Last of Us"
            />
          </div>

          <div className="form-group">
            <label>URL de Portada</label>
            <input
              type="url"
              name="portada"
              value={formData.portada}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          <div className="form-group">
            <label>Año</label>
            <input
              type="number"
              name="anio"
              min="1970"
              max={new Date().getFullYear() + 5}
              value={formData.anio}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Desarrollador</label>
            <input
              type="text"
              name="desarrollador"
              value={formData.desarrollador}
              onChange={handleChange}
              placeholder="Ej: Naughty Dog"
            />
          </div>

          <div className="form-group form-group-full">
            <label>Plataformas</label>
            <div className="multi-select-container">
              {plataformasDisponibles.map(plat => (
                <button
                  key={plat}
                  type="button"
                  className={`multi-select-btn ${formData.plataforma.includes(plat) ? 'selected' : ''}`}
                  onClick={() => handleMultiSelect('plataforma', plat)}
                >
                  {plat}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group form-group-full">
            <label>Géneros</label>
            <div className="multi-select-container">
              {generosDisponibles.map(gen => (
                <button
                  key={gen}
                  type="button"
                  className={`multi-select-btn ${formData.genero.includes(gen) ? 'selected' : ''}`}
                  onClick={() => handleMultiSelect('genero', gen)}
                >
                  {gen}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Puntuación (1.0 - 10.0)</label>
            <input
              type="number"
              name="puntuacion"
              min="1"
               max="10"
              step="0.1"
              value={formData.puntuacion}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Horas Jugadas</label>
            <input
              type="number"
              name="horasJugadas"
              min="0"
              value={formData.horasJugadas}
              onChange={handleChange}
            />
          </div>

          <div className="form-group form-group-full">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="4"
              placeholder="Escribe una descripción del juego..."
            />
          </div>

          <div className="form-group form-group-full">
            <label className="checkbox-container">
              <input
                type="checkbox"
                name="completado"
                checked={formData.completado}
                onChange={handleChange}
              />
              <span>Juego completado</span>
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit-acrylic">
              {juegoEditar ? 'Guardar Cambios' : 'Agregar Juego'}
            </button>
            <button type="button" className="btn-cancel-acrylic" onClick={onCancelar}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormularioJuego