import { useState, useEffect } from 'react'
import './FormularioJuego.css'

const crearEstadoInicial = () => ({
  juegoId: '',
  titulo: '',
  contenido: '',
  puntuacion: 8
})

const convertirPuntuacionParaFormulario = (valor) => {
  const numero = Number(valor)
  if (Number.isNaN(numero)) return 0
  if (numero > 5) return Math.min(numero, 10)
  return Math.min(numero * 2, 10)
}

const prepararPuntuacionParaGuardar = (valor) => {
  const numero = Math.max(0, Math.min(10, Number(valor) || 0))
  if (numero <= 5) return numero
  return Number((numero / 2).toFixed(2))
}

function FormularioResena({ juegos, resenaEditar, onGuardar, onCancelar }) {
  const [formData, setFormData] = useState(() => crearEstadoInicial())
  const [juegoBusqueda, setJuegoBusqueda] = useState('')

  useEffect(() => {
    if (resenaEditar) {
      setFormData({
        juegoId: resenaEditar.juegoId || '',
        titulo: resenaEditar.titulo || '',
        contenido: resenaEditar.contenido || '',
        puntuacion: convertirPuntuacionParaFormulario(resenaEditar.puntuacion)
      })
    } else {
      setFormData(crearEstadoInicial())
      setJuegoBusqueda('')
    }
  }, [resenaEditar])

  useEffect(() => {
    if (resenaEditar) {
      const juegoActual = juegos.find(j => j._id === resenaEditar.juegoId)
      setJuegoBusqueda(juegoActual?.titulo || '')
    }
  }, [resenaEditar, juegos])

  const handleChange = (e) => {
    let value = e.target.value

    if (e.target.name === 'puntuacion') {
      const numero = Math.max(0, Math.min(10, Number(value)))
      value = Number.isNaN(numero) ? '' : numero
    }

    setFormData({
      ...formData,
      [e.target.name]: value
    })
  }

  const handleJuegoBusquedaChange = (e) => {
    const valor = e.target.value
    setJuegoBusqueda(valor)

    if (resenaEditar) {
      return
    }

    const juegoSeleccionado = juegos.find(
      juego => juego.titulo.toLowerCase() === valor.toLowerCase()
    )

    setFormData(prev => ({
      ...prev,
      juegoId: juegoSeleccionado?._id || ''
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.juegoId) {
      alert('Selecciona un juego válido antes de guardar la reseña')
      return
    }

    const payload = {
      ...formData,
      puntuacion: prepararPuntuacionParaGuardar(formData.puntuacion)
    }

    onGuardar(payload)
    setFormData(crearEstadoInicial())
    setJuegoBusqueda('')
  }

  const formTitle = resenaEditar ? ' Editar Reseña' : ' Escribir Reseña'
  const juegoSeleccionado = juegos.find(j => j._id === formData.juegoId)
  const puntuacionActual = Math.max(0, Math.min(10, Number(formData.puntuacion) || 0))

  return (
    <div className="formulario-overlay formulario-overlay-acrylic" role="dialog" aria-modal="true">
      <div className="formulario-container-acrylic formulario-resena">
        <form
          onSubmit={handleSubmit}
          className="formulario-juego formulario-grid formulario-resena-grid"
        >
          <h2 className="formulario-titulo">{formTitle}</h2>

          <label className="form-group legacy-label">
            <span>Juego *</span>
            <input
              type="text"
              list="juegos-disponibles"
              name="juegoBusqueda"
              value={juegoBusqueda}
              onChange={handleJuegoBusquedaChange}
              placeholder="Busca por título de tu biblioteca"
              autoComplete="off"
              disabled={Boolean(resenaEditar)}
              aria-label="Buscar juego para reseña"
            />
            <datalist id="juegos-disponibles">
              {juegos.map(juego => (
                <option key={juego._id} value={juego.titulo} />
              ))}
            </datalist>
            <p className="field-hint">
              {juegoSeleccionado
                ? `Seleccionado: ${juegoSeleccionado.titulo}`
                : 'Selecciona un juego de tu biblioteca'}
            </p>
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
            <span>Puntuación (0-10) *</span>
            <div className="rating-input-wrapper">
              <input
                type="number"
                name="puntuacion"
                min="0"
                max="10"
                step="0.1"
                value={formData.puntuacion}
                onChange={handleChange}
                required
              />
              <div className="rating-preview" aria-live="polite">
                <span className="rating-helper">
                  {'⭐'.repeat(Math.round(puntuacionActual))}
                </span>
                <span className="rating-value">
                  {puntuacionActual.toFixed(1)} / 10
                </span>
              </div>
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
            <button
              type="button"
              className="btn-secondary btn-cancel-acrylic"
              onClick={onCancelar}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormularioResena
