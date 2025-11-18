import heroVideo from '../assets/Axiom.mp4'
import './Inicio.css'

function Inicio() {
  return (
    <div className="inicio-page">
      <section className="hero-section hero-focus">
        <video
          className="hero-video"
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="hero-overlay" />

        <div className="hero-logo-focus" aria-hidden="true">
          <div className="logo-ring" />
          <div className="logo-core" />
          <div className="logo-glow" />
        </div>

        <div className="hero-wordmark" aria-hidden="true">
          <span>A</span>
          <span>X</span>
          <span>I</span>
          <span>O</span>
          <span>M</span>
        </div>

        <div className="hero-content hero-centered">
          <span className="hero-tag">Axiom focus</span>
          <h1>El hub donde tu logo toma el protagonismo</h1>
          <p className="hero-description">
            Un backdrop luminoso inspirado en la interfaz que viste. Mantuvimos el video como textura pero ahora el
            circulo orbital dirige todas las miradas hacia la marca, con CTA listos para accionar.
          </p>
          <div className="hero-actions hero-centered-actions">
            <a href="/biblioteca" className="btn hero-btn-primary">
              Explorar Axiom
            </a>
            <a href="/resenas" className="btn hero-btn-secondary">
              Ver funcionalidades
            </a>
          </div>
          <p className="hero-guarantee">Experiencia fluida en desktop y mobile - Animacion permanente sin distracciones</p>
        </div>
      </section>

      <section className="hero-metrics">
        <div className="metric">
          <h3>Biblioteca viva</h3>
          <p>Clasifica lanzamientos, pendientes y joyas retro con filtros por plataforma y estado.</p>
        </div>
        <div className="metric">
          <h3>Resenas enfocadas</h3>
          <p>Captura impresiones con plantillas rapidas para que cada resena quede lista al instante.</p>
        </div>
        <div className="metric">
          <h3>Datos accionables</h3>
          <p>Identifica patrones de juego gracias a estadisticas personales y paneles comparativos.</p>
        </div>
      </section>

      <section className="panel-grid">
        <article className="panel destaque">
          <p className="panel-label">01</p>
          <h4>Biblioteca curada</h4>
          <p>
            Lista y ordena cada juego con filtros por plataforma, genero y estado. Disenado para mantener el backlog bajo control.
          </p>
          <a href="/biblioteca" className="panel-link">
            Abrir biblioteca
          </a>
        </article>

        <article className="panel">
          <p className="panel-label">02</p>
          <h4>Resenas sin friccion</h4>
          <p>
            Define tu plantilla, captura impresiones y guarda que tan lejos llegaste. Cada resena alimenta tus estadisticas.
          </p>
          <a href="/resenas" className="panel-link">
            Ir a resenas
          </a>
        </article>

        <article className="panel">
          <p className="panel-label">03</p>
          <h4>Estadisticas personales</h4>
          <p>
            Detecta tus generos preferidos y el tiempo que dedicas a cada plataforma para decidir tu proximo run.
          </p>
          <a href="/estadisticas" className="panel-link">
            Ver panel
          </a>
        </article>
      </section>

      <section className="workflow-section">
        <div className="workflow-steps">
          <article className="step-card">
            <span className="step-number">1</span>
            <h5>Registra tus titulos</h5>
            <p>Completa el formulario de juegos, agrega portadas y etiqueta tu progreso actual.</p>
          </article>
          <article className="step-card">
            <span className="step-number">2</span>
            <h5>Escribe tus resenas</h5>
            <p>Comparte lo que te gusto y lo que no, adjunta plataformas y mantente consistente.</p>
          </article>
          <article className="step-card">
            <span className="step-number">3</span>
            <h5>Analiza tus habitos</h5>
            <p>Visita estadisticas personales para convertir los registros en decisiones con sentido.</p>
          </article>
        </div>

        <div className="workflow-cta">
          <h3>Listo para tu siguiente sesion</h3>
          <p>
            La nueva pantalla de Inicio mezcla video y datos para inspirarte a seguir documentando tu recorrido gamer.
            Inicia sesion, registra un juego o escribe una resena y mantente al dia.
          </p>
          <div className="cta-actions">
            <a href="/biblioteca" className="btn hero-btn-primary">
              Registrar juego
            </a>
            <a href="/resenas" className="btn hero-btn-secondary">
              Crear resena
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Inicio
