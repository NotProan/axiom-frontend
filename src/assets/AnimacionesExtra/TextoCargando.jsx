import './TextoCargando.css'

function TextoCargando({ texto = "Cargando  reseñas...", emoji = "" }) {
  return (
    <div className="contenedor-cargando">
      <div className="texto-animado">
        {texto.split('').map((letra, index) => (
          <span 
            key={index}
            style={{ animationDelay: `${index * 0.02}s` }}
          >
            {letra === ' ' ? '\u00A0' : letra}
          </span>
        ))}
      </div>
      <div className="emoji-cargando">{emoji}</div>
    </div>
  )
}

export default TextoCargando