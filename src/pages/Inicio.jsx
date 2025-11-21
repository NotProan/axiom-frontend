import { useEffect, useRef, useState } from 'react'
import './Inicio.css'
import AxiomInicioVideo from '../assets/AnimacionesExtra/AxiomInicio.mp4'
import { juegosAPI, resenasAPI } from '../services/api'

const insightCards = [
  {
    title: 'Coleccion inteligente',
    description:
      'Organiza lanzamientos, pendientes y retro; todo se alimenta de tu biblioteca cargada desde juegosAPI.',
    action: 'Ver biblioteca',
    link: '/biblioteca',
  },
  {
    title: 'Resenas express',
    description:
      'Captura impresiones rapidas y puntajes; tus resenas se guardan y se listan directo desde resenasAPI.',
    action: 'Escribir resena',
    link: '/resenas',
  },
  {
    title: 'Panel de estadisticas',
    description:
      'Habitos, plataformas favoritas y sesiones completadas calculadas en vivo con los datos de tus juegos.',
    action: 'Ver estadisticas',
    link: '/estadisticas',
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

        const horasTotales = juegos.reduce((acc, juego) => acc + (Number(juego.horasJugadas) || 0), 0)

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
        console.error('No se pudieron cargar metricas de inicio', error)
      } finally {
        setCargandoMetricas(false)
      }
    }

    cargarMetricas()
  }, [])

  useEffect(() => {
    document.body.classList.add('bg-inicio')
    return () => {
      document.body.classList.remove('bg-inicio')
    }
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

      <div className="inicio-headline-banner">
        <h2>ORGANIZA TUS JUEGOS A OTRO NIVEL</h2>
        <button className="headline-cta">Explora mas</button>
        <p className="headline-subcopy">Organiza, resena y mide todo en un solo lugar</p>
      </div>

      <div className="inicio-content">
        <section className="hero-stack fade-in">
          <div className="hero-glass hero-glass-primary">
            <p className="hero-eyebrow"></p>
            <h1>Tu cuartel general gamer</h1>
            <p className="hero-description">
              {cargandoMetricas
                ? 'Sincronizando tu biblioteca...'
                : `Juegos: ${formatearNumero(metricas.totalJuegos)} | Resenas: ${formatearNumero(metricas.totalResenas)} | Horas: ${formatearNumero(metricas.horasTotales)} | Plataformas: ${formatearNumero(metricas.plataformasUnicas)}`}
            </p>
            <div className="hero-divider">
            </div>
            <div className="hero-actions">
              <a href="/biblioteca" className="btn primary">
                Registrar juego
              </a>
              <a href="/resenas" className="btn secondary">
                Escribir resena
              </a>
            </div>
          </div>

          <div className="hero-glass hero-metrics">
            <div className="hero-metrics-head">
              <p>Actividad en vivo</p>
              <span>Actualizado hace 5 min</span>
            </div>
            <div className="hero-metrics-grid">
              {stats.map(({ label, value }) => (
                <div key={label} className="metric-card">
                  <p className="metric-value">{value || '0'}</p>
                  <p className="metric-label">{label}</p>
                </div>
              ))}
            </div>
            <div className="delta-note">
              Pulso estable: mantiene tus sesiones y resenas en ritmo semanal.
            </div>
          </div>
        </section>

        <section className="orb-section fade-in">
          <div className="orb-card">
            <p className="hero-eyebrow">Guardado automatico</p>
            <h3>Tu progreso, guardado automaticamente</h3>
            <p className="orb-text">
              Respalda partidas, horas y clips con copias seguras. Controla que compartes y que se queda solo contigo.
            </p>
            <div className="orb-tags">
              <span>Copias rapidas</span>
              <span>Sincronizacion segura</span>
            </div>
          </div>
        </section>

        <section className="insight-grid fade-in">
          {insightCards.map(({ title, description, action, link }) => (
            <article key={title} className="insight-card">
              <h3>{title}</h3>
              <p>{description}</p>
              <a className="highlight-link" href={link}>
                {action}
              </a>
            </article>
          ))}
        </section>


      </div>
    </div>
  )
}

export default Inicio
