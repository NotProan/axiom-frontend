import { useState, useEffect } from 'react'
import { juegosAPI } from '../services/api'
import TextoCargando from '../assets/AnimacionesExtra/TextoCargando'
import './EstadisticasPersonales.css'

function EstadisticasPersonales() {
  const [juegos, setJuegos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargarJuegos = async () => {
      try {
        setCargando(true)
        const response = await juegosAPI.obtenerTodos()
        setJuegos(response.data || [])
      } catch (error) {
        console.error('Error al cargar estadísticas:', error)
        alert('Error al cargar las estadísticas')
      } finally {
        setCargando(false)
      }
    }

    cargarJuegos()
  }, [])

  if (cargando) {
    return <TextoCargando texto="Cargando estadísticas" />
  }

  // Evitar división por cero
  if (!juegos || juegos.length === 0) {
    return (
      <div className="estadisticas">
        <h1>Estadísticas personales</h1>
        <div className="acrylic-card-empty">
          <p>No hay juegos en la biblioteca para calcular estadísticas.</p>
          <p>Agrega algunos juegos desde la Biblioteca para ver tus datos aquí.</p>
        </div>
      </div>
    )
  }

  // Cálculos principales
  const totalJuegos = juegos.length
  const juegosCompletados = juegos.filter(j => j.completado).length
  const backlog = totalJuegos - juegosCompletados

  const horasTotales = juegos.reduce((acc, j) => acc + (j.horasJugadas || 0), 0)
  const horasPromedio = totalJuegos ? horasTotales / totalJuegos : 0

  const puntuacionMedia = totalJuegos
    ? juegos.reduce((acc, j) => acc + (j.puntuacion || 0), 0) / totalJuegos
    : 0

  const juegosRecientes = [...juegos]
    .sort((a, b) => new Date(b.fechaAgregado || b.createdAt || 0) - new Date(a.fechaAgregado || a.createdAt || 0))
    .slice(0, 5)

  // Agrupación por plataforma (string separado por comas)
  const horasPorPlataformaMap = {}
  juegos.forEach(j => {
    const plataformas = (j.plataforma || '').split(',').map(p => p.trim()).filter(Boolean)
    if (plataformas.length === 0) {
      plataformas.push('Sin plataforma')
    }
    plataformas.forEach(p => {
      if (!horasPorPlataformaMap[p]) horasPorPlataformaMap[p] = 0
      horasPorPlataformaMap[p] += j.horasJugadas || 0
    })
  })
  const horasPorPlataforma = Object.entries(horasPorPlataformaMap)
    .map(([nombre, horas]) => ({ nombre, horas }))
    .sort((a, b) => b.horas - a.horas)

  // Agrupación por género
  const juegosPorGeneroMap = {}
  juegos.forEach(j => {
    const generos = (j.genero || '').split(',').map(g => g.trim()).filter(Boolean)
    if (generos.length === 0) {
      generos.push('Sin género')
    }
    generos.forEach(g => {
      if (!juegosPorGeneroMap[g]) juegosPorGeneroMap[g] = 0
      juegosPorGeneroMap[g] += 1
    })
  })
  const juegosPorGenero = Object.entries(juegosPorGeneroMap)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)

  // Distribución de puntuaciones 1.0 - 10.0
  const rangos = [
    { label: '9.0 - 10.0', min: 9, max: 10.01 },
    { label: '7.0 - 8.9', min: 7, max: 8.91 },
    { label: '5.0 - 6.9', min: 5, max: 6.91 },
    { label: '3.0 - 4.9', min: 3, max: 4.91 },
    { label: '0 - 2.9', min: 0, max: 2.91 }
  ]

  const distribucionPuntuacion = rangos.map(rango => {
    const cantidad = juegos.filter(j => {
      const p = j.puntuacion || 0
      return p >= rango.min && p < rango.max
    }).length
    return { ...rango, cantidad }
  })

  const maxBarDistribucion =
    Math.max(...distribucionPuntuacion.map(r => r.cantidad), 1)
  const maxBarHoras =
    Math.max(...horasPorPlataforma.map(p => p.horas), 1)
  const maxBarGeneros =
    Math.max(...juegosPorGenero.map(g => g.cantidad), 1)

  return (
    <div className="estadisticas">
      <h1>Estadísticas personales</h1>

      <div className="estadisticas-layout">
        {/* Columna izquierda: bloques de estadísticas + recientes */}
        <div className="estadisticas-col-izquierda">
          <div className="estadisticas-grid">
            <div className="stat-card acrylic-card">
              <div className="stat-label">Juegos totales</div>
              <div className="stat-numero">{totalJuegos}</div>
              <div className="stat-extra">Todos los juegos de tu biblioteca</div>
            </div>

            <div className="stat-card acrylic-card">
              <div className="stat-label">Completados</div>
              <div className="stat-numero">{juegosCompletados}</div>
              <div className="stat-extra">
                Backlog: {backlog < 0 ? 0 : backlog} juegos pendientes
              </div>
            </div>

            <div className="stat-card acrylic-card">
              <div className="stat-label">Horas jugadas</div>
              <div className="stat-numero">{horasTotales.toFixed(1)}</div>
              <div className="stat-extra">
                Promedio por juego: {horasPromedio.toFixed(1)} h
              </div>
            </div>

            <div className="stat-card acrylic-card">
              <div className="stat-label">Puntuación media</div>
              <div className="stat-badge-score">
                <span className="stat-badge-score-star">★</span>
                <span className="stat-badge-score-value">
                  {puntuacionMedia.toFixed(1)}
                </span>
                <span className="stat-badge-score-max">/10</span>
              </div>
              <div className="stat-extra">
                Basado en todas tus puntuaciones
              </div>
            </div>
          </div>

          <div className="juegos-recientes acrylic-card">
            <h2>Juegos recientes</h2>
            <div className="lista-recientes">
              {juegosRecientes.map(juego => (
                <div key={juego._id} className="item-reciente">
                  <img
                    src={
                      juego.portada ||
                      'https://via.placeholder.com/80x110?text=Sin+Portada'
                    }
                    alt={juego.titulo}
                    onError={e => {
                      e.target.src =
                        'https://via.placeholder.com/80x110?text=Error'
                    }}
                  />
                  <div className="info-reciente">
                    <h4>{juego.titulo}</h4>
                    <p>
                      {juego.plataforma} · {juego.genero}
                    </p>
                    <p>
                      Horas: {juego.horasJugadas || 0} · Puntuación:{' '}
                      {(juego.puntuacion || 0).toFixed(1)}/10
                    </p>
                    {juego.completado && (
                      <span className="badge-completado-mini">Completado</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna derecha: "flow charts" acrílicos */}
        <div className="estadisticas-col-derecha">
          <div className="chart-card acrylic-card">
            <h2>Distribución de puntuaciones</h2>
            <div className="chart-bar-list">
              {distribucionPuntuacion.map(rango => (
                <div key={rango.label} className="chart-bar-row">
                  <span className="chart-bar-label">{rango.label}</span>
                  <div className="chart-bar-track">
                    <div
                      className="chart-bar-fill chart-bar-fill-score"
                      style={{
                        width: `${(rango.cantidad / maxBarDistribucion) * 100}%`
                      }}
                    />
                  </div>
                  <span className="chart-bar-value">{rango.cantidad}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card acrylic-card">
            <h2>Horas por plataforma</h2>
            <div className="chart-bar-list">
              {horasPorPlataforma.map(p => (
                <div key={p.nombre} className="chart-bar-row">
                  <span className="chart-bar-label">{p.nombre}</span>
                  <div className="chart-bar-track">
                    <div
                      className="chart-bar-fill chart-bar-fill-platform"
                      style={{
                        width: `${(p.horas / maxBarHoras) * 100}%`
                      }}
                    />
                  </div>
                  <span className="chart-bar-value">
                    {p.horas.toFixed(1)} h
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card acrylic-card">
            <h2>Juegos por género</h2>
            <div className="chart-bar-list">
              {juegosPorGenero.map(g => (
                <div key={g.nombre} className="chart-bar-row">
                  <span className="chart-bar-label">{g.nombre}</span>
                  <div className="chart-bar-track">
                    <div
                      className="chart-bar-fill chart-bar-fill-genre"
                      style={{
                        width: `${(g.cantidad / maxBarGeneros) * 100}%`
                      }}
                    />
                  </div>
                  <span className="chart-bar-value">{g.cantidad}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EstadisticasPersonales
