import { useState, useEffect, useMemo } from 'react'
import { resenasAPI, juegosAPI } from '../services/api'
import FormularioResena from '../components/FormularioResena'
import './ListaResenas.css'

function ListaResenas() {
  const [resenas, setResenas] = useState([])
  const [juegos, setJuegos] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [resenaEditar, setResenaEditar] = useState(null)
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const [resenasRes, juegosRes] = await Promise.all([
        resenasAPI.obtenerTodas(),
        juegosAPI.obtenerTodos()
      ])
      setResenas(resenasRes.data)
      setJuegos(juegosRes.data)
    } catch (error) {
      console.error('Error al cargar datos:', error)
    }
  }

  const handleGuardar = async (resena) => {
    try {
      if (resenaEditar) {
        await resenasAPI.actualizar(resenaEditar._id, resena)
        alert('Reseña actualizada')
      } else {
        await resenasAPI.crear(resena)
        alert('Reseña publicada')
      }
      cargarDatos()
      setMostrarFormulario(false)
      setResenaEditar(null)
    } catch (error) {
      console.error('Error al guardar:', error)
      alert('Error al guardar la reseña')
    }
  }

  const handleEliminar = async (id) => {
    if (window.confirm('¿Eliminar esta reseña?')) {
      try {
        await resenasAPI.eliminar(id)
        alert('Reseña eliminada')
        cargarDatos()
      } catch (error) {
        console.error('Error al eliminar:', error)
      }
    }
  }

  const abrirFormulario = (resena = null) => {
    setResenaEditar(resena)
    setMostrarFormulario(true)
  }

  const cerrarFormulario = () => {
    setMostrarFormulario(false)
    setResenaEditar(null)
  }

  const resenasEnriquecidas = useMemo(() => {
    return resenas.map(resena => {
      const juegoRelacionado = juegos.find(j => j._id === resena.juegoId)
      return {
        ...resena,
        juegoTitulo: juegoRelacionado?.titulo || 'Juego no encontrado',
        plataforma: juegoRelacionado?.plataforma || 'Plataforma desconocida',
        genero: juegoRelacionado?.genero || 'Género no indicado'
      }
    })
  }, [resenas, juegos])

  const resenasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    if (!termino) {
      return resenasEnriquecidas
    }

    return resenasEnriquecidas.filter(resena => {
      return (
        resena.titulo.toLowerCase().includes(termino) ||
        resena.juegoTitulo.toLowerCase().includes(termino) ||
        resena.plataforma.toLowerCase().includes(termino) ||
        resena.contenido.toLowerCase().includes(termino)
      )
    })
  }, [busqueda, resenasEnriquecidas])

  const promedioPuntuacion = useMemo(() => {
    if (!resenas.length) return '0.0'
    const total = resenas.reduce((acc, resena) => acc + Number(resena.puntuacion || 0), 0)
    return (total / resenas.length).toFixed(1)
  }, [resenas])

  const ultimaActualizacion = useMemo(() => {
    const fechasValidas = resenas
      .map(resena => new Date(resena.fecha))
      .filter(fecha => !Number.isNaN(fecha.getTime()))

    if (!fechasValidas.length) {
      return 'Sin fecha'
    }

    const masReciente = new Date(Math.max(...fechasValidas.map(fecha => fecha.getTime())))
    return masReciente.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }, [resenas])

  const renderEstrellas = (puntuacion) => '⭐'.repeat(Number(puntuacion) || 0)

  const formatearFecha = (fecha) => {
    if (!fecha) return 'Sin fecha'
    const fechaObj = new Date(fecha)
    return Number.isNaN(fechaObj.getTime())
      ? 'Sin fecha'
      : fechaObj.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })
  }

  const obtenerNombreJuego = (juegoId) => {
    const juego = juegos.find(j => j._id === juegoId)
    return juego ? juego.titulo : 'Juego no encontrado'
  }

  const noHayResenas = resenas.length === 0
  const noCoincidencias = !noHayResenas && resenasFiltradas.length === 0

  return (
    <div className="lista-resenas">
      <section className="resenas-hero">
        <div className="hero-copy">
          <p className="hero-subtitle">GameTracker Reviews</p>
          <h1 className="hero-title">Tus reseñas con estilo acrílico</h1>
          <p className="hero-description">
            Organiza tus impresiones, compara plataformas y mantén un registro elegante de cada aventura gamer.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => abrirFormulario()}>
              ➕ Nueva reseña
            </button>
            <span className="hero-hint">Se sincroniza automáticamente con tu biblioteca</span>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <span>Total de reseñas</span>
            <strong>{resenas.length}</strong>
          </div>
          <div className="stat-card">
            <span>Promedio general</span>
            <strong>{promedioPuntuacion}</strong>
          </div>
          <div className="stat-card">
            <span>Última actualización</span>
            <strong>{ultimaActualizacion}</strong>
          </div>
        </div>
      </section>

      <div className="resenas-header">
        <h1>📝 Mis Reseñas</h1>
        <button className="btn-primary" onClick={() => abrirFormulario()}>
          ➕ Escribir Reseña
        </button>
      </div>

      <div className="resenas-toolbar">
        <div className="search-field">
          <span role="img" aria-hidden="true">🔍</span>
          <input
            type="search"
            placeholder="Buscar por juego, título o plataforma..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            aria-label="Buscar reseñas"
          />
        </div>
        <button className="btn-secondary" onClick={() => abrirFormulario()}>
          ✏️ Escribir reseña
        </button>
      </div>

      {noHayResenas ? (
        <div className="sin-resenas">
          <p>No has escrito ninguna reseña</p>
          <p>¡Comparte tu opinión sobre tus juegos!</p>
        </div>
      ) : noCoincidencias ? (
        <div className="sin-resenas sin-resenas-filtro">
          <p>😔 No se encontraron reseñas que coincidan con la búsqueda.</p>
          <p>Prueba con otro término o crea una nueva reseña.</p>
        </div>
      ) : (
        <div className="resenas-grid">
          {resenasFiltradas.map(resena => {
            const puntuacionNumerica = Number(resena.puntuacion) || 0

            return (
              <article key={resena._id} className="tarjeta-resena">
                <div className="resena-header">
                  <div className="resena-header-textos">
                    <p className="resena-juego-subtitle">{resena.juegoTitulo}</p>
                    <h3>{resena.titulo}</h3>
                  </div>
                  <div className="resena-score" aria-label={`Puntuación ${puntuacionNumerica.toFixed(1)}`}>
                    <span>{puntuacionNumerica.toFixed(1)}</span>
                    <small>Puntuación</small>
                  </div>
                  <span className="resena-puntuacion" aria-hidden="true">
                    {renderEstrellas(resena.puntuacion)}
                  </span>
                </div>

                <p className="resena-juego">
                  🎮 {obtenerNombreJuego(resena.juegoId)}
                </p>

                <div className="resena-meta">
                  <span className="meta-pill">{resena.plataforma}</span>
                  <span className="meta-pill ghost">{resena.genero}</span>
                </div>

                <p className="resena-contenido">{resena.contenido}</p>

                <p className="resena-fecha">
                  📅 {formatearFecha(resena.fecha)}
                </p>

                <div className="resena-footer">
                  <div className="resena-acciones">
                    <button className="btn-secondary" onClick={() => abrirFormulario(resena)}>
                      ✏️ Editar
                    </button>
                    <button className="btn-danger" onClick={() => handleEliminar(resena._id)}>
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {mostrarFormulario && (
        <FormularioResena
          juegos={juegos}
          resenaEditar={resenaEditar}
          onGuardar={handleGuardar}
          onCancelar={cerrarFormulario}
        />
      )}
    </div>
  )
}

export default ListaResenas
