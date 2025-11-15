import { useState, useEffect } from 'react'
import { juegosAPI, resenasAPI } from '../services/api'
import './EstadisticasPersonales.css'

function EstadisticasPersonales() {
  const [estadisticas, setEstadisticas] = useState({
    totalJuegos: 0,
    juegosCompletados: 0,
    totalHoras: 0,
    totalResenas: 0,
    promedioCalificacion: 0,
    plataformaMasUsada: '',
    generoFavorito: ''
  })

  const [juegos, setJuegos] = useState([])
  const [resenas, setResenas] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setCargando(true)
      const [juegosRes, resenasRes] = await Promise.all([
        juegosAPI.obtenerTodos(),
        resenasAPI.obtenerTodas()
      ])
      
      const juegosData = juegosRes.data
      const resenasData = resenasRes.data

      setJuegos(juegosData)
      setResenas(resenasData)
      calcularEstadisticas(juegosData, resenasData)
    } catch (error) {
      console.error('Error al cargar datos:', error)
    } finally {
      setCargando(false)
    }
  }

  const calcularEstadisticas = (juegosData, resenasData) => {
    const totalJuegos = juegosData.length
    const juegosCompletados = juegosData.filter(j => j.completado).length
    const totalHoras = juegosData.reduce((sum, j) => sum + (j.horasJugadas || 0), 0)
    
    const calificaciones = juegosData
      .map(j => j.puntuacion)
      .filter(p => p > 0)
    const promedioCalificacion = calificaciones.length > 0
      ? (calificaciones.reduce((sum, p) => sum + p, 0) / calificaciones.length).toFixed(1)
      : 0

    // Plataforma más usada
    const plataformas = {}
    juegosData.forEach(j => {
      plataformas[j.plataforma] = (plataformas[j.plataforma] || 0) + 1
    })
    const plataformaMasUsada = Object.keys(plataformas).length > 0
      ? Object.keys(plataformas).reduce((a, b) => 
          plataformas[a] > plataformas[b] ? a : b
        )
      : 'N/A'

    // Género favorito
    const generos = {}
    juegosData.forEach(j => {
      generos[j.genero] = (generos[j.genero] || 0) + 1
    })
    const generoFavorito = Object.keys(generos).length > 0
      ? Object.keys(generos).reduce((a, b) => 
          generos[a] > generos[b] ? a : b
        )
      : 'N/A'

    setEstadisticas({
      totalJuegos,
      juegosCompletados,
      totalHoras,
      totalResenas: resenasData.length,
      promedioCalificacion,
      plataformaMasUsada,
      generoFavorito
    })
  }

  const porcentajeCompletado = estadisticas.totalJuegos > 0
    ? ((estadisticas.juegosCompletados / estadisticas.totalJuegos) * 100).toFixed(0)
    : 0

  if (cargando) {
    return <div className="cargando">Cargando estadísticas... 📊</div>
  }

  return (
    <div className="estadisticas">
      <h1>📊 Mis Estadísticas</h1>

      <div className="estadisticas-grid">
        <div className="stat-card">
          <div className="stat-icono">🎮</div>
          <div className="stat-numero">{estadisticas.totalJuegos}</div>
          <div className="stat-label">Total de Juegos</div>
        </div>

        <div className="stat-card">
          <div className="stat-icono">✅</div>
          <div className="stat-numero">{estadisticas.juegosCompletados}</div>
          <div className="stat-label">Juegos Completados</div>
          <div className="stat-extra">{porcentajeCompletado}% del total</div>
        </div>

        <div className="stat-card">
          <div className="stat-icono">⏱️</div>
          <div className="stat-numero">{estadisticas.totalHoras}</div>
          <div className="stat-label">Horas Jugadas</div>
          <div className="stat-extra">
            {(estadisticas.totalHoras / 24).toFixed(1)} días
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icono">📝</div>
          <div className="stat-numero">{estadisticas.totalResenas}</div>
          <div className="stat-label">Reseñas Escritas</div>
        </div>

        <div className="stat-card">
          <div className="stat-icono">⭐</div>
          <div className="stat-numero">{estadisticas.promedioCalificacion}</div>
          <div className="stat-label">Calificación Promedio</div>
          <div className="stat-extra">de 5 estrellas</div>
        </div>

        <div className="stat-card">
          <div className="stat-icono">🎯</div>
          <div className="stat-texto">{estadisticas.plataformaMasUsada}</div>
          <div className="stat-label">Plataforma Favorita</div>
        </div>

        <div className="stat-card">
          <div className="stat-icono">🏆</div>
          <div className="stat-texto">{estadisticas.generoFavorito}</div>
          <div className="stat-label">Género Favorito</div>
        </div>
      </div>

      {juegos.length > 0 && (
        <div className="juegos-recientes">
          <h2>🕒 Últimos Juegos Agregados</h2>
          <div className="lista-recientes">
            {juegos.slice(-5).reverse().map(juego => (
              <div key={juego._id} className="item-reciente">
                <img 
                  src={juego.portada || 'https://via.placeholder.com/100x140?text=Sin+Portada'} 
                  alt={juego.titulo}
                  onError={(e) => e.target.src = 'https://via.placeholder.com/100x140?text=Error'}
                />
                <div className="info-reciente">
                  <h4>{juego.titulo}</h4>
                  <p>{juego.plataforma} • {juego.genero}</p>
                  <p>{'⭐'.repeat(juego.puntuacion || 0)}</p>
                  {juego.completado && <span className="badge-completado-mini">✓ Completado</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default EstadisticasPersonales