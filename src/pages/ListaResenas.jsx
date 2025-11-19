import { useState, useEffect, useMemo } from 'react'
import { resenasAPI, juegosAPI } from '../services/api'
import FormularioResena from '../components/FormularioResena'
import { BotonEliminar, BotonEditar } from '../assets/AnimacionesExtra/BotonesTarjeta'
import './ListaResenas.css'
import { crearMapaJuegos, enriquecerResenasConJuego } from '../utils/juegoHelpers'

// --- IMAGEN BASE64 PARA PORTADA POR DEFECTO ---
const PORTADA_POR_DEFECTO = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='280' viewBox='0 0 200 280'%3E%3Crect width='200' height='280' fill='%232d3748'/%3E%3Ctext x='50%25' y='50%25' fill='%23a0aec0' font-size='14' font-family='Arial' text-anchor='middle' dominant-baseline='middle'%3ESin+Portada%3C/text%3E%3C/svg%3E";

const convertirPuntuacionA10 = (valor) => {
  const numero = Number(valor)
  if (Number.isNaN(numero)) return 0
  if (numero > 5) return Math.min(numero, 10)
  return Math.min(numero * 2, 10)
}

const normalizarPuntuacionParaAPI = (valor) => {
  const numero = Math.max(0, Math.min(10, Number(valor) || 0))
  if (numero > 5) {
    return Number((numero / 2).toFixed(2))
  }
  return numero
}

function ListaResenas() {
  const [resenas, setResenas] = useState([])
  const [juegos, setJuegos] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [resenaEditar, setResenaEditar] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [resenasFiltradas, setResenasFiltradas] = useState([])

  const [busqueda, setBusqueda] = useState('')
  const [filtroPlataforma, setFiltroPlataforma] = useState('')
  const [filtroPuntuacion, setFiltroPuntuacion] = useState('')
  const [filtroGenero, setFiltroGenero] = useState('')
  const [filtroPalabrasClave, setFiltroPalabrasClave] = useState('')

  useEffect(() => {
    cargarDatos()
  }, [])

  useEffect(() => {
    const handleAbrirFormulario = () => {
      setMostrarFormulario(true)
    }

    window.addEventListener('abrirFormularioResena', handleAbrirFormulario)

    return () => {
      window.removeEventListener('abrirFormularioResena', handleAbrirFormulario)
    }
  }, [])

  const cargarDatos = async () => {
    try {
      setCargando(true)
      const [juegosResponse, resenasResponse] = await Promise.all([
        juegosAPI.obtenerTodos(),
        resenasAPI.obtenerTodas()
      ])
      
      setJuegos(juegosResponse.data)
      setResenas(resenasResponse.data)
      setResenasFiltradas(resenasResponse.data)
      console.log(resenasResponse.data)
    } catch (error) {
      console.error('Error al cargar datos:', error)
      alert('Error al cargar reseñas y juegos')
    } finally {
      setCargando(false)
    }
  }

  const handleGuardar = async (resena) => {
    try {
      const payload = {
        ...resena,
        puntuacion: normalizarPuntuacionParaAPI(resena.puntuacion)
      }

      if (resenaEditar) {
        await resenasAPI.actualizar(resenaEditar._id, payload)
        alert('Reseña actualizada')
      } else {
        await resenasAPI.crear(payload)
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

  const juegoMap = useMemo(() => crearMapaJuegos(juegos), [juegos])
  const resenasEnriquecidas = useMemo(
    () => enriquecerResenasConJuego(resenas, juegoMap),
    [resenas, juegoMap]
  )

  const aplicarFiltros = () => {
    let resultado = [...resenasEnriquecidas]
    
    const termino = busqueda.trim().toLowerCase()
    if (termino) {
      resultado = resultado.filter(resena => {
        const titulo = String(resena.titulo || '').toLowerCase()
        const juegoTitulo = String(resena.juegoTitulo || '').toLowerCase()
        const contenido = String(resena.contenido || '').toLowerCase()
        return titulo.includes(termino) || juegoTitulo.includes(termino) || contenido.includes(termino)
      })
    }
    
    if (filtroPlataforma) {
      resultado = resultado.filter(resena => 
        resena.juegoPlataforma.toLowerCase().includes(filtroPlataforma.toLowerCase())
      )
    }
    
    if (filtroGenero) {
      resultado = resultado.filter(resena => 
        resena.juegoGenero.toLowerCase().includes(filtroGenero.toLowerCase())
      )
    }
    
    if (filtroPuntuacion) {
      const puntuacionMin = Number(filtroPuntuacion)
      resultado = resultado.filter(resena => resena.puntuacion10 >= puntuacionMin)
    }
    
    setResenasFiltradas(resultado)
  }

  useEffect(() => {
    aplicarFiltros()
  }, [busqueda, filtroPlataforma, filtroGenero, filtroPuntuacion, resenasEnriquecidas])

  const plataformasDisponibles = useMemo(() => {
    const opciones = new Set()
    resenasEnriquecidas.forEach(resena => {
      const lista = (resena.juegoPlataforma || '')
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)
      lista.forEach(op => opciones.add(op))
    })
    return Array.from(opciones).sort((a, b) => a.localeCompare(b))
  }, [resenasEnriquecidas])

  const generosDisponibles = useMemo(() => {
    const opciones = new Set()
    resenasEnriquecidas.forEach(resena => {
      const lista = (resena.juegoGenero || '')
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)
      lista.forEach(op => opciones.add(op))
    })
    return Array.from(opciones).sort((a, b) => a.localeCompare(b))
  }, [resenasEnriquecidas])

  const promedioPuntuacion = useMemo(() => {
    if (!resenasEnriquecidas.length) return '0.0'
    const total = resenasEnriquecidas.reduce((acc, r) => acc + Number(r.puntuacion10 || 0), 0)
    return (total / resenasEnriquecidas.length).toFixed(1)
  }, [resenasEnriquecidas])

  const ultimaActualizacion = useMemo(() => {
    const fechasValidas = resenas
      .map(r => new Date(r.fecha))
      .filter(f => !Number.isNaN(f.getTime()))

    if (!fechasValidas.length) return 'Sin fecha'

    const masReciente = new Date(Math.max(...fechasValidas.map(f => f.getTime())))
    return masReciente.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }, [resenas])

  const renderEstrellas = (p) => {
    const total = Math.max(0, Math.min(10, Math.round(Number(p) || 0)))
    return Array.from({ length: 10 }, (_, index) => (
      <span
        key={`${p}-${index}`}
        className={`resena-star ${index < total ? 'is-filled' : ''}`}
      >
        ★
      </span>
    ))
  }

  const formatearFecha = (fecha) => {
    if (!fecha) return 'Sin fecha'
    const f = new Date(fecha)
    return Number.isNaN(f.getTime())
      ? 'Sin fecha'
      : f.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
  }

  if (cargando) {
    return (
      <div className="cargando">
        Cargando reseñas...
      </div>
    )
  }

  const noHayResenas = resenas.length === 0
  const noCoincidencias = !noHayResenas && resenasFiltradas.length === 0

  return (
    <div className="lista-resenas">
      <div className="resenas-layout">
        <section className="resenas-hero">
          <div className="hero-copy">
            <p className="hero-subtitle">GameTracker Reviews</p>
            <h1 className="hero-title">Tus reseñas</h1>
            <p className="hero-description">
              Describe tus experiencias y mantén una bitácora acrílica sincronizada con tu biblioteca.
            </p>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <span>Total de reseñas</span>
              <strong>{resenas.length}</strong>
            </div>

            <div className="stat-card">
              <span>Promedio general</span>
              <strong>{promedioPuntuacion}</strong>
              <small>de 10</small>
            </div>

            <div className="stat-card">
              <span>Última actualización</span>
              <strong>{ultimaActualizacion}</strong>
            </div>
          </div>
        </section>

        <section className="resenas-main">
          <div className="resenas-header">
            <div>
              <p className="resenas-eyebrow">Panel personal</p>
              <h1>📝 Mis Reseñas</h1>
            </div>

            <button className="btn-resena" onClick={() => abrirFormulario()}>
              Escribir Reseña
            </button>
          </div>

          <div className="resenas-toolbar">
            <div className="search-field search-field-compact">
              <span role="img" aria-hidden="true">🔍</span>
                <input
                  type="search"
                  placeholder="Buscar por juego o reseña..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  aria-label="Buscar reseñas"
              />
            </div>

            <div className="filters-grid" role="group" aria-label="Filtros de reseñas">
                <label className="filter-field">
                  <span>Plataforma</span>
                  <select
                    value={filtroPlataforma}
                    onChange={(e) => setFiltroPlataforma(e.target.value)}
                  >
                    <option value="">Todas</option>
                    {plataformasDisponibles.map(p => (
                      <option key={p} value={p.toLowerCase()}>{p}</option>
                    ))}
                  </select>
                </label>

              <label className="filter-field">
                <span>Puntuación mínima</span>
                <select
                  value={filtroPuntuacion}
                  onChange={(e) => setFiltroPuntuacion(e.target.value)}
                >
                  <option value="">Todas</option>
                  {[9, 8, 7, 6, 5].map(v => (
                    <option key={v} value={v}>{`≥ ${v}`}</option>
                  ))}
                </select>
              </label>

                <label className="filter-field">
                  <span>Género</span>
                  <select value={filtroGenero} onChange={(e) => setFiltroGenero(e.target.value)}>
                    <option value="">Todos</option>
                    {generosDisponibles.map(g => (
                      <option key={g} value={g.toLowerCase()}>{g}</option>
                    ))}
                  </select>
                </label>

              <label className="filter-field keyword-field">
                <span>Palabras clave</span>
                <input
                  type="text"
                  placeholder="Ej. gráficos, narrativa"
                  value={filtroPalabrasClave}
                  onChange={(e) => setFiltroPalabrasClave(e.target.value)}
                />
              </label>
            </div>
          </div>

          {noHayResenas ? (
            <div className="sin-resenas">
              <p>No has escrito ninguna reseña</p>
              <p>¡Comparte tu opinión sobre tus juegos!</p>
            </div>
          ) : noCoincidencias ? (
            <div className="sin-resenas sin-resenas-filtro">
              <p>😔 No se encontraron reseñas que coincidan con la búsqueda.</p>
              <p>Prueba otro término o crea una reseña.</p>
            </div>
          ) : (
            <div className="resenas-grid">
              {resenasFiltradas.map(resena => {
                const puntuacionNumerica = Math.min(10, Math.max(0, Number(resena.puntuacion10) || 0))
                const portadaJuego = resena.juegoPortada || PORTADA_POR_DEFECTO
                const horasJugadasTexto = resena.juegoHorasJugadas != null
                  ? `${resena.juegoHorasJugadas} h`
                  : 'Sin registro'
                const puntuacionJuegoTexto = resena.juegoPuntuacion != null
                  ? `${Math.max(0, Math.min(10, resena.juegoPuntuacion)).toFixed(1)} / 10`
                  : 'Sin puntuar'

                const juego = resena.juegoRelacionado || {}

                return (
                  <article key={resena._id} className="tarjeta-resena">
                    <div className="resena-header">
                      <div className="resena-score-block" aria-label={`Puntuación ${puntuacionNumerica.toFixed(1)} de 10`}>
                        <span className="resena-score-number">{puntuacionNumerica.toFixed(1)}</span>
                        <small>de 10</small>
                        <div className="resena-stars" aria-hidden="true">
                          {renderEstrellas(resena.puntuacion10)}
                        </div>
                      </div>

                      <div className="resena-header-textos">
                        <h3 className="resena-title">“{resena.titulo}”</h3>
                        {juego.titulo && (
                          <p className="resena-game-name">{juego.titulo}</p>
                        )}
                      </div>
                    </div>

                    <div className="resena-juego-detalle">
                      <div className="resena-juego-portada">
                        <img
                          src={portadaJuego}
                          alt={`Portada de ${juego.titulo || 'Juego no encontrado'}`}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null
                            e.currentTarget.src = PORTADA_POR_DEFECTO
                          }}
                        />
                      </div>

                      <div className="resena-juego-meta-grid">
                        <div className="resena-juego-meta-item">
                          <span>Desarrollador</span>
                          <strong>{resena.juegoDesarrollador || 'Sin registro'}</strong>
                        </div>
                        <div className="resena-juego-meta-item">
                          <span>Año</span>
                          <strong>{resena.juegoAnio || 'Sin dato'}</strong>
                        </div>
                        <div className="resena-juego-meta-item">
                          <span>Horas jugadas</span>
                          <strong>{horasJugadasTexto}</strong>
                        </div>
                        <div className="resena-juego-meta-item">
                          <span>Puntuación del juego</span>
                          <strong>{puntuacionJuegoTexto}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="resena-meta">
                      <span className="meta-pill">{resena.juegoPlataforma}</span>
                      <span className="meta-pill ghost">{resena.juegoGenero}</span>
                    </div>

                    <p className="resena-fecha">
                      📅 {formatearFecha(resena.fecha)}
                    </p>

                    <div className="descripcion-horizontal">
                      <p>{resena.contenido}</p>
                    </div>

                    <div className="resena-footer">
                      <div className="resena-acciones">
                        <BotonEditar onClick={() => abrirFormulario(resena)} />
                        <BotonEliminar onClick={() => {
                          if (window.confirm('Eliminar esta reseña?')) {
                            handleEliminar(resena._id)
                          }
                        }} />
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>

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
