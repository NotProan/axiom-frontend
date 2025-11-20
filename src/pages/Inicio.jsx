import { useEffect, useRef, useState } from 'react'
import './Inicio.css'
import AxiomInicioVideo from '../assets/AnimacionesExtra/AxiomInicio.mp4'
import { juegosAPI, resenasAPI } from '../services/api'

const highlightCards = [
  {
    title: 'Biblioteca viva',
    description: 'Organiza lanzamientos, pendientes y joyas retro con etiquetas por plataforma y estado.',
    link: '/biblioteca',
    action: 'Ver biblioteca',
  },
  {
    title: 'Resenas expresas',
    description: 'Captura impresiones rápidas, puntuaciones y referencias visuales sin salir del flujo de juego.',
    link: '/resenas',
    action: 'Escribir resena',
  },
  {
    title: 'Panel personal',
    description: 'Estadisticas de hábitos, plataformas favoritas y sesiones completadas para decidir tu próximo run.',
    link: '/estadisticas',
    action: 'Revisar datos',
  },
]

function Inicio() {
  const videoRef = useRef(null)
  const [metricas, setMetricas] = useState({
    totalJuegos: 0,
    totalResenas: 0,
    horasTotales: 0,
    plataformasUnicas: 0,
  })
  const [cargandoMetricas, setCargandoMetricas] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.loop = true
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const cargarMetricas = async () => {
      try {
        const [juegosResp, resenasResp] = await Promise.all([
          juegosAPI.obtenerTodos(),
          resenasAPI.obtenerTodas(),
        ])

        const juegos = juegosResp.data || []
        const resenas = resenasResp.data || []

        const horasTotales = juegos.reduce(
          (acc, juego) => acc + (Number(juego.horasJugadas) || 0),
          0
        )

        const plataformas = new Set()
        juegos.forEach((juego) => {
          String(juego.plataforma || '')
            .split(',')
            .map((p) => p.trim())
            .filter(Boolean)
            .forEach((p) => plataformas.add(p.toLowerCase()))
        })

        setMetricas({
          totalJuegos: juegos.length,
          totalResenas: resenas.length,
          horasTotales,
          plataformasUnicas: plataformas.size,
        })
      } catch (error) {
        console.error('No se pudieron cargar métricas de inicio', error)
      } finally {
        setCargandoMetricas(false)
      }
    }

    cargarMetricas()
  }, [])

  const formatearNumero = (valor) =>
    typeof valor === 'number' ? valor.toLocaleString('es-ES') : valor

  const stats = [
    { label: 'Juegos en biblioteca', value: formatearNumero(metricas.totalJuegos) },
    { label: 'Resenas publicadas', value: formatearNumero(metricas.totalResenas) },
    { label: 'Horas registradas', value: `${formatearNumero(metricas.horasTotales)} h` },
  ]

  return (
    <div className="inicio-page">
      <section className="hero-video-section" aria-hidden="true">
        <video
          ref={videoRef}
          className="hero-video"
          src={AxiomInicioVideo}
          autoPlay
          muted
          playsInline
        />
      </section>

      <div className="inicio-content">
        <section className="landing-hero fade-in">
          <div className="hero-gradient" aria-hidden="true" />
          <div className="hero-copy">
            <p className="hero-eyebrow">Gametracker</p>
            <h1>Un solo lugar para tus juegos</h1>
            <p className="hero-description">
              {cargandoMetricas
                ? 'Sincronizando tu biblioteca...'
                : `Juegos: ${formatearNumero(metricas.totalJuegos)} · Reseñas: ${formatearNumero(metricas.totalResenas)} · Horas: ${formatearNumero(metricas.horasTotales)} · Plataformas: ${formatearNumero(metricas.plataformasUnicas)}`}
            </p>
            <div className="hero-actions">
              <a href="/biblioteca" className="btn primary">
                Registrar juego
              </a>
              <a href="/resenas" className="btn secondary">
                Escribir reseña
              </a>
            </div>
            <div className="hero-tags">
              <span>Biblioteca</span>
              <span>Reseñas</span>
              <span>Estadísticas</span>
              <span>Rutinas</span>
            </div>
          </div>
          <div className="hero-panel">
            <div className="hero-panel-header">
              <p>Resumen semanal</p>
              <span>Actualizado hace 8 min</span>
            </div>
            <div className="hero-panel-body">
              <div className="hero-panel-bar" style={{ width: '74%' }}>
                <span>Mis horas de juego</span>
              </div>
              <p className="hero-panel-text">
                Tendencia positiva contra la semana anterior. Tus reseñas subieron un 18%.
              </p>
            </div>
          <div className="hero-panel-foot">
            <div>
              <strong>+37</strong>
              <span>Sesiones conectadas</span>
            </div>
            <div>
              <strong>12</strong>
              <span>Títulos en progreso</span>
            </div>
            <div>
              <strong>45%</strong>
              <span>Tiempo de juego activo</span>
            </div>
            <div>
              <strong>28</strong>
              <span>Metas semanales</span>
            </div>
          </div>
        </div>
      </section>

        <section className="inicio-stats">
          {stats.map(({ label, value }) => (
            <article key={label} className="fade-in-card">
              <p className="stat-value">{value}</p>
              <p className="stat-label">{label}</p>
            </article>
          ))}
        </section>

        <section className="inicio-highlights">
          {highlightCards.map(({ title, description, link, action }) => (
            <article key={title} className="highlight-card fade-in-card">
              <h3>{title}</h3>
              <p>{description}</p>
              <a className="highlight-link" href={link}>
                {action}
              </a>
            </article>
          ))}
        </section>

        <section className="inicio-cta fade-in">
          <div>
            <h3>Mantén la constancia</h3>
            <p>
              Planifica sesiones, registra cada batalla y comparte impresiones detalladas. La página de inicio ahora concentra
              tus métricas esenciales para que decidas qué jugar y cuándo pausar.
            </p>
          </div>
          <div className="inicio-cta-actions">
            <a href="/biblioteca" className="btn primary">
              Abrir biblioteca
            </a>
            <a href="/resenas" className="btn ghost">
              Crear reseña
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Inicio
