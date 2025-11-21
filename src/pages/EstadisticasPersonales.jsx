import { useState, useEffect } from 'react'
import { juegosAPI, resenasAPI } from '../services/api'
import TextoCargando from '../assets/AnimacionesExtra/TextoCargando'
import './EstadisticasPersonales.css'

function EstadisticasPersonales() {
  const [juegos, setJuegos] = useState([])
  const [resenas, setResenas] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true)
        const [juegosResp, resenasResp] = await Promise.all([
          juegosAPI.obtenerTodos(),
          resenasAPI.obtenerTodas()
        ])
        setJuegos(juegosResp.data || [])
        setResenas(resenasResp.data || [])
      } catch (error) {
        console.error('Error al cargar estadisticas:', error)
        alert('Error al cargar las estadisticas')
      } finally {
        setCargando(false)
      }
    }

    cargarDatos()
  }, [])

  useEffect(() => {
    document.body.classList.add('bg-estadisticas')
    return () => {
      document.body.classList.remove('bg-estadisticas')
    }
  }, [])

  if (cargando) {
    return <TextoCargando texto="Cargando estadisticas" />
  }

  const rawNumero = valor => {
    const fuente = valor?.puntuacion10 ?? valor?.puntuacion ?? valor
    if (typeof fuente === 'number') return Number.isFinite(fuente) ? fuente : 0
    const match = String(fuente || '').replace(',', '.').match(/-?\d*\.?\d+/)
    return match ? Number(match[0]) : 0
  }

  // Normaliza cualquier puntuacion a escala /10
  const puntuacionResena10 = resena => {
    const base = rawNumero(resena)
    if (base <= 0) return 0
    if (base <= 5) return Math.min(base * 2, 10)
    return Math.min(base, 10)
  }

  const totalJuegos = juegos.length
  const juegosCompletados = juegos.filter(j => j.completado).length
  const backlog = Math.max(0, totalJuegos - juegosCompletados)
  const horasTotales = juegos.reduce((acc, j) => acc + (Number(j.horasJugadas) || 0), 0)
  const horasPromedio = totalJuegos ? horasTotales / totalJuegos : 0
  const plataformasUnicas = new Set(
    juegos.flatMap(j =>
      String(j.plataforma || '')
        .split(',')
        .map(p => p.trim())
        .filter(Boolean)
    )
  ).size
  const puntuacionMedia =
    totalJuegos > 0
      ? juegos.reduce((acc, j) => acc + (Number(j.puntuacion) || 0), 0) / totalJuegos
      : 0
  const porcentajeCompletado = totalJuegos ? (juegosCompletados / totalJuegos) * 100 : 0

  const resenasNormalizadas = resenas.map(r => ({
    ...r,
    puntaje10: puntuacionResena10(r)
  }))

  const totalResenas = resenasNormalizadas.length
  const promedioResenasValor =
    totalResenas > 0
      ? resenasNormalizadas.reduce((acc, r) => acc + r.puntaje10, 0) / totalResenas
      : 0
  const resenasAltas = resenasNormalizadas.filter(r => r.puntaje10 >= 8).length
  const resenasBajas = resenasNormalizadas.filter(r => {
    const p = r.puntaje10
    return p > 0 && p <= 5
  }).length
  const resenasConJuego = new Set(
    resenasNormalizadas.map(r => r.juegoId || r.juegoRelacionado?._id || r.juegoTitulo || r.titulo)
  ).size
  const ultimaResena = resenas
    .map(r => new Date(r.fecha || r.createdAt || 0))
    .filter(f => !Number.isNaN(f.getTime()))
    .sort((a, b) => b - a)[0]

  const juegosRecientes = [...juegos]
    .sort(
      (a, b) =>
        new Date(b.fechaAgregado || b.createdAt || 0) - new Date(a.fechaAgregado || a.createdAt || 0)
    )
    .slice(0, 5)
  const ultimoAgregado = juegosRecientes[0]

  const resenasRecientes = [...resenasNormalizadas]
    .sort((a, b) => new Date(b.fecha || b.createdAt || 0) - new Date(a.fecha || a.createdAt || 0))
    .slice(0, 5)

  const juegoMap = new Map(
    juegos
      .filter(j => j?._id)
      .map(j => [j._id.toString(), j])
  )

  const obtenerTituloJuego = resena => {
    const idRelacionado = resena.juegoId || resena.juego?._id || resena.juego
    if (idRelacionado && juegoMap.has(String(idRelacionado))) {
      return juegoMap.get(String(idRelacionado))?.titulo
    }
    return resena.juegoTitulo || resena.juego?.titulo || 'Juego sin titulo'
  }

  const juegosPorPlataformaMap = {}
  juegos.forEach(j => {
    const plataformas = (j.plataforma || '')
      .split(',')
      .map(p => p.trim())
      .filter(Boolean)
    if (plataformas.length === 0) plataformas.push('Sin plataforma')
    plataformas.forEach(p => {
      juegosPorPlataformaMap[p] = (juegosPorPlataformaMap[p] || 0) + 1
    })
  })
  const juegosPorPlataforma = Object.entries(juegosPorPlataformaMap)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)

  const juegosPorGeneroMap = {}
  juegos.forEach(j => {
    const generos = (j.genero || '')
      .split(',')
      .map(g => g.trim())
      .filter(Boolean)
    if (generos.length === 0) generos.push('Sin genero')
    generos.forEach(g => {
      juegosPorGeneroMap[g] = (juegosPorGeneroMap[g] || 0) + 1
    })
  })
  const juegosPorGenero = Object.entries(juegosPorGeneroMap)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)

  if (!juegos || juegos.length === 0) {
    return (
      <div className="estadisticas">
        <h1>Estadisticas</h1>
        <div className="acrylic-card-empty">
          <p>No hay juegos en la biblioteca para calcular estadisticas.</p>
          <p>Agrega algunos juegos desde la Biblioteca para ver tus datos aqui.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="estadisticas">
      <div className="estadisticas-header">
        <h1>Estadisticas</h1>
        <p className="estadisticas-subtitle">
          Vista rapida de tu biblioteca y reseñas en un solo tablero.
        </p>
      </div>

      <div className="estadisticas-main-grid columns-four">
        <div className="panel panel-general">
          <h2>Informacion General</h2>
          <div className="grid-cards">
            <div className="stat-card acrylic-card">
              <div className="stat-label">Juegos totales</div>
              <div className="stat-numero">{totalJuegos}</div>
              <div className="stat-extra">Registrados en tu biblioteca</div>
            </div>
            <div className="stat-card acrylic-card">
              <div className="stat-label">Juegos completados</div>
              <div className="stat-numero">{juegosCompletados}</div>
              <div className="stat-extra">Terminados en tu biblioteca</div>
            </div>
            <div className="stat-card acrylic-card">
              <div className="stat-label">No completados</div>
              <div className="stat-numero">{backlog}</div>
              <div className="stat-extra">Pendientes por terminar</div>
            </div>
            <div className="stat-card acrylic-card">
              <div className="stat-label">Ultimo agregado</div>
              <div className="stat-numero">{ultimoAgregado?.titulo || 'Sin datos'}</div>
              <div className="stat-extra">
                {ultimoAgregado?.fechaAgregado
                  ? new Date(ultimoAgregado.fechaAgregado).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })
                  : 'Sin fecha'}
              </div>
            </div>
          </div>
        </div>

        <div className="panel panel-juegos">
          <h2>Juegos</h2>
          <div className="grid-cards">
            <div className="stat-card acrylic-card">
              <div className="stat-label">Puntuacion media</div>
              <div className="stat-badge-score">
                <span className="stat-badge-score-star">*</span>
                <span className="stat-badge-score-value">{puntuacionMedia.toFixed(1)}</span>
                <span className="stat-badge-score-max">/10</span>
              </div>
              <div className="stat-extra">Basado en tus juegos</div>
            </div>
            <div className="stat-card acrylic-card">
              <div className="stat-label">Mejor plataforma</div>
              <div className="stat-numero">
                {juegosPorPlataforma[0]?.nombre || 'Sin datos'} ({juegosPorPlataforma[0]?.cantidad || 0})
              </div>
              <div className="stat-extra">Plataformas mas jugadas</div>
            </div>
            <div className="stat-card acrylic-card">
              <div className="stat-label">Genero top</div>
              <div className="stat-numero">
                {juegosPorGenero[0]?.nombre || 'Sin datos'} ({juegosPorGenero[0]?.cantidad || 0})
              </div>
              <div className="stat-extra">Mas frecuente en tu biblioteca</div>
            </div>
            <div className="stat-card acrylic-card">
              <div className="stat-label">% completado</div>
              <div className="stat-numero">{porcentajeCompletado.toFixed(1)}%</div>
              <div className="stat-extra">Sobre el total</div>
            </div>
            <div className="stat-card acrylic-card">
              <div className="stat-label">Horas jugadas</div>
              <div className="stat-numero">{horasTotales.toFixed(1)}</div>
              <div className="stat-extra">Promedio: {horasPromedio.toFixed(1)}h</div>
            </div>
          </div>
        </div>

        <div className="panel panel-resenas">
          <h2>Reseñas</h2>
          <div className="grid-cards">
            <div className="stat-card acrylic-card">
              <div className="stat-label">Reseñas totales</div>
              <div className="stat-numero">{totalResenas}</div>
              <div className="stat-extra">Publicadas en el sistema</div>
            </div>
            <div className="stat-card acrylic-card">
              <div className="stat-label">Promedio reseñas</div>
              <div className="stat-badge-score">
                <span className="stat-badge-score-star">*</span>
                <span className="stat-badge-score-value">{promedioResenasValor.toFixed(1)}</span>
                <span className="stat-badge-score-max">/10</span>
              </div>
              <div className="stat-extra">Basado en puntuacion /10</div>
            </div>
            <div className="stat-card acrylic-card">
              <div className="stat-label">Ultima reseña</div>
              <div className="stat-numero">
                {ultimaResena
                  ? ultimaResena.toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })
                  : 'Sin fecha'}
              </div>
              <div className="stat-extra">Fecha de publicacion mas reciente</div>
            </div>
            <div className="stat-card acrylic-card">
              <div className="stat-label">Reseñas altas (&#8805;8)</div>
              <div className="stat-numero">{resenasAltas}</div>
              <div className="stat-extra">Mejor valoradas</div>
            </div>
            <div className="stat-card acrylic-card">
              <div className="stat-label">Reseñas bajas (&#8804;5)</div>
              <div className="stat-numero">{resenasBajas}</div>
              <div className="stat-extra">Pendientes de mejorar</div>
            </div>
          </div>
        </div>

        <div className="recientes-col acrylic-card recientes-juegos grid-col-recientes">
          <div className="recientes-header">Juegos recien añadidos</div>
          <div className="lista-recientes">
            {juegosRecientes.map(juego => (
              <div key={juego._id} className="item-reciente">
                <img
                  src={juego.portada || 'https://via.placeholder.com/80x110?text=Sin+Portada'}
                  alt={juego.titulo}
                  onError={e => {
                    e.target.src = 'https://via.placeholder.com/80x110?text=Error'
                  }}
                />
                <div className="info-reciente">
                  <h4>{juego.titulo}</h4>
                  <p>{juego.plataforma} | {juego.genero}</p>
                  <p>Horas: {juego.horasJugadas || 0} | Puntuacion: {(Number(juego.puntuacion) || 0).toFixed(1)}/10</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="recientes-col acrylic-card recientes-resenas grid-col-recientes-resenas">
          <div className="recientes-header">Reseñas recien añadidas</div>
          <div className="lista-recientes">
            {resenasRecientes.map(resena => (
              <div key={resena._id} className="item-reciente">
                <div className="info-reciente">
                  <h4>{resena.titulo || 'Sin titulo'}</h4>
                  <p>{obtenerTituloJuego(resena)}</p>
                  <p>Puntuacion: {puntuacionResena10(resena).toFixed(1)}/10</p>
                  <p>
                    {resena.fecha
                      ? new Date(resena.fecha).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })
                      : 'Sin fecha'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EstadisticasPersonales
