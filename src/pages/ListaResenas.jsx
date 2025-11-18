import { useState, useEffect, useMemo } from 'react'
import { resenasAPI, juegosAPI } from '../services/api'
import FormularioResena from '../components/FormularioResena'
import './ListaResenas.css'

const PORTADA_POR_DEFECTO = 'https://via.placeholder.com/200x280?text=Sin+Portada'

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

const normalizarColeccionDeJuego = (valor) => {
  if (!valor) return []
  if (Array.isArray(valor)) {
    return valor.filter(Boolean)
  }
  if (typeof valor === 'string') {
    return valor
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)
  }
  return []
}

const obtenerNumeroSeguro = (valor) => {
  const numero = Number(valor)
  return Number.isFinite(numero) ? numero : null
}

const esObjetoPlano = (valor) => Boolean(valor) && typeof valor === 'object' && !Array.isArray(valor)

const limpiarPosibleId = (valor) => {
  if (!valor) return ''
  if (typeof valor === 'string') return valor
  if (typeof valor === 'number') return String(valor)
  if (typeof valor === 'object') {
    if (valor.$oid) return valor.$oid
    if (typeof valor.toString === 'function') return valor.toString()
  }
  return ''
}

const obtenerPrimerValor = (...valores) => {
  for (const valor of valores) {
    if (valor !== undefined && valor !== null && valor !== '') {
      return valor
    }
  }
  return undefined
}

const obtenerJuegoRelacionado = (resena, juegos) => {
  if (esObjetoPlano(resena.juego)) {
    return resena.juego
  }

  const posiblesIds = [
    resena.juegoId,
    resena.juego?._id,
    resena.juego?._id?.$oid,
    resena.juego?._id?.toString?.()
  ]
    .map(limpiarPosibleId)
    .filter(Boolean)

  for (const id of posiblesIds) {
    const juegoEncontrado = juegos.find(j => j._id === id)
    if (juegoEncontrado) {
      return juegoEncontrado
    }
  }

  if (typeof resena.juego === 'string') {
    const juegoPorNombre = juegos.find(
      j => j.titulo?.toLowerCase() === resena.juego.toLowerCase()
    )
    if (juegoPorNombre) {
      return juegoPorNombre
    }
  }

  return null
}

function ListaResenas() {
  const [resenas, setResenas] = useState([])
  const [juegos, setJuegos] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [resenaEditar, setResenaEditar] = useState(null)

  const [busqueda, setBusqueda] = useState('')
  const [filtroPlataforma, setFiltroPlataforma] = useState('')
  const [filtroPuntuacion, setFiltroPuntuacion] = useState('')
  const [filtroGenero, setFiltroGenero] = useState('')
  const [filtroPalabrasClave, setFiltroPalabrasClave] = useState('')

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

  const resenasEnriquecidas = useMemo(() => {
    return resenas.map(resena => {
      const juegoRelacionado = obtenerJuegoRelacionado(resena, juegos)
      const plataformas = normalizarColeccionDeJuego(
        juegoRelacionado?.plataformas ||
        juegoRelacionado?.plataforma ||
        resena.plataformas ||
        resena.plataforma ||
        resena.juegoPlataforma
      )
      const generos = normalizarColeccionDeJuego(
        juegoRelacionado?.generos ||
        juegoRelacionado?.genero ||
        resena.generos ||
        resena.genero ||
        resena.juegoGenero
      )
      const horasJugadas = obtenerNumeroSeguro(
        obtenerPrimerValor(
          juegoRelacionado?.horasJugadas,
          resena.juegoHorasJugadas,
          resena.horasJugadasJuego,
          resena.horasJuego
        )
      )
      const puntuacionJuego = obtenerNumeroSeguro(
        obtenerPrimerValor(
          juegoRelacionado?.puntuacion,
          resena.juegoPuntuacion,
          resena.puntuacionJuego
        )
      )

      const juegoTitulo = obtenerPrimerValor(
        juegoRelacionado?.titulo,
        resena.juegoTitulo,
        resena.tituloJuego,
        resena.nombreJuego
      ) || 'Juego no encontrado'

      const juegoPortada = obtenerPrimerValor(
        juegoRelacionado?.portada,
        resena.juegoPortada,
        resena.portadaJuego
      ) || ''

      const juegoAnio = obtenerPrimerValor(
        juegoRelacionado?.anio,
        resena.juegoAnio,
        resena.anioJuego
      ) || ''

      const juegoDesarrollador = obtenerPrimerValor(
        juegoRelacionado?.desarrollador,
        resena.juegoDesarrollador,
        resena.desarrolladorJuego
      ) || ''

      const plataformaTexto = plataformas.length
        ? plataformas.join(', ')
        : (obtenerPrimerValor(resena.plataforma, resena.juegoPlataforma) || 'Plataforma desconocida')

      const generoTexto = generos.length
        ? generos.join(', ')
        : (obtenerPrimerValor(resena.genero, resena.juegoGenero) || 'Género no indicado')

      return {
        ...resena,
        juegoTitulo,
        juegoPortada,
        juegoAnio,
        juegoDesarrollador,
        juegoHorasJugadas: horasJugadas,
        juegoPuntuacion: puntuacionJuego,
        plataformas,
        generos,
        plataforma: plataformaTexto,
        genero: generoTexto,
        puntuacion10: convertirPuntuacionA10(resena.puntuacion)
      }
    })
  }, [resenas, juegos])
  const plataformasDisponibles = useMemo(() => {
    return Array.from(
      new Set(
        resenasEnriquecidas.flatMap(resena => {
          if (resena.plataformas?.length) return resena.plataformas
          return resena.plataforma ? [resena.plataforma] : []
        })
      )
    )
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
  }, [resenasEnriquecidas])

  const generosDisponibles = useMemo(() => {
    return Array.from(
      new Set(
        resenasEnriquecidas.flatMap(resena => {
          if (resena.generos?.length) return resena.generos
          return resena.genero ? [resena.genero] : []
        })
      )
    )
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
  }, [resenasEnriquecidas])

  const resenasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    const keywordInput = filtroPalabrasClave.trim().toLowerCase()
    const puntuacionMinima = filtroPuntuacion ? Number(filtroPuntuacion) : null

    return resenasEnriquecidas.filter(resena => {
      const titulo = String(resena.titulo || '').toLowerCase()
      const juegoTitulo = String(resena.juegoTitulo || '').toLowerCase()
      const contenido = String(resena.contenido || '').toLowerCase()
      const plataformas = (resena.plataformas?.length
        ? resena.plataformas
        : (resena.plataforma ? [resena.plataforma] : [])
      ).map(item => item.toLowerCase())
      const generos = (resena.generos?.length
        ? resena.generos
        : (resena.genero ? [resena.genero] : [])
      ).map(item => item.toLowerCase())
      const datosJuegoExtras = [
        resena.juegoDesarrollador,
        resena.juegoAnio,
        resena.juegoHorasJugadas != null ? `${resena.juegoHorasJugadas}h` : '',
        resena.juegoPuntuacion != null ? resena.juegoPuntuacion : ''
      ]
        .join(' ')
        .toLowerCase()

      const coincideBusqueda = !termino
        ? true
        : (
            titulo.includes(termino) ||
            juegoTitulo.includes(termino) ||
            contenido.includes(termino) ||
            plataformas.some(plat => plat.includes(termino)) ||
            generos.some(gen => gen.includes(termino)) ||
            datosJuegoExtras.includes(termino)
          )

      const coincidePlataforma = filtroPlataforma
        ? plataformas.some(pl => pl.includes(filtroPlataforma))
        : true

      const coincideGenero = filtroGenero
        ? generos.some(gen => gen.includes(filtroGenero))
        : true

      const coincidePuntuacion = puntuacionMinima !== null
        ? resena.puntuacion10 >= puntuacionMinima
        : true

      const coincidePalabrasClave = keywordInput
        ? keywordInput
            .split(/\s+/)
            .filter(Boolean)
            .every(p =>
              contenido.includes(p) ||
              titulo.includes(p) ||
              juegoTitulo.includes(p) ||
              datosJuegoExtras.includes(p)
            )
        : true

      return (
        coincideBusqueda &&
        coincidePlataforma &&
        coincideGenero &&
        coincidePuntuacion &&
        coincidePalabrasClave
      )
    })
  }, [
    busqueda,
    resenasEnriquecidas,
    filtroPlataforma,
    filtroPuntuacion,
    filtroGenero,
    filtroPalabrasClave
  ])

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
    return '⭐'.repeat(total)
  }

  const formatearFecha = (fecha) => {
    if (!fecha) return 'Sin fecha'
    const f = new Date(fecha)
    return Number.isNaN(f.getTime())
      ? 'Sin fecha'
      : f.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
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
                placeholder="Buscar por juego, título o plataforma..."
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
                const plataformasParaMostrar = resena.plataformas?.length
                  ? resena.plataformas
                  : ['Plataforma desconocida']
                const generosParaMostrar = resena.generos?.length
                  ? resena.generos
                  : ['Género no indicado']
                const horasJugadasTexto = resena.juegoHorasJugadas != null
                  ? `${resena.juegoHorasJugadas} h`
                  : 'Sin registro'
                const puntuacionJuegoTexto = resena.juegoPuntuacion != null
                  ? `${Math.max(0, Math.min(10, resena.juegoPuntuacion)).toFixed(1)} / 10`
                  : 'Sin puntuar'
                const portadaJuego = resena.juegoPortada || PORTADA_POR_DEFECTO

                return (
                  <article key={resena._id} className="tarjeta-resena">
                    <div className="resena-header">
                      <div className="resena-header-textos">
                        <p className="resena-juego-subtitle">{resena.juegoTitulo}</p>
                        <h3>{resena.titulo}</h3>
                      </div>

                      <div className="resena-score" aria-label={`Puntuación ${puntuacionNumerica.toFixed(1)} de 10`}>
                        <span>{puntuacionNumerica.toFixed(1)}</span>
                        <small>de 10</small>
                      </div>

                      <span className="resena-puntuacion" aria-hidden="true">
                        {renderEstrellas(resena.puntuacion10)}
                      </span>
                    </div>

                    <p className="resena-juego">
                      🎮 {resena.juegoTitulo}
                    </p>

                    <div className="resena-juego-detalle">
                      <div className="resena-juego-portada">
                        <img
                          src={portadaJuego}
                          alt={`Portada de ${resena.juegoTitulo}`}
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
                      {plataformasParaMostrar.map(plat => (
                        <span key={`${resena._id}-plat-${plat}`} className="meta-pill">
                          {plat}
                        </span>
                      ))}
                      {generosParaMostrar.map(gen => (
                        <span key={`${resena._id}-gen-${gen}`} className="meta-pill ghost">
                          {gen}
                        </span>
                      ))}
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
