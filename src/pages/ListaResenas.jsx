import { useState, useEffect } from 'react'
import { resenasAPI, juegosAPI } from '../services/api'
import FormularioResena from '../components/FormularioResena'
import './ListaResenas.css'

function ListaResenas() {
  const [resenas, setResenas] = useState([])
  const [juegos, setJuegos] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [resenaEditar, setResenaEditar] = useState(null)

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

  const renderEstrellas = (puntuacion) => {
    return '⭐'.repeat(puntuacion)
  }

  const obtenerNombreJuego = (juegoId) => {
    const juego = juegos.find(j => j._id === juegoId)
    return juego ? juego.titulo : 'Juego no encontrado'
  }

  return (
    <div className="lista-resenas">
      <div className="resenas-header">
        <h1>📝 Mis Reseñas</h1>
        <button 
          className="btn-primary"
          onClick={() => setMostrarFormulario(true)}
        >
          ➕ Escribir Reseña
        </button>
      </div>

      {resenas.length === 0 ? (
        <div className="sin-resenas">
          <p>No has escrito ninguna reseña</p>
          <p>¡Comparte tu opinión sobre tus juegos!</p>
        </div>
      ) : (
        <div className="resenas-grid">
          {resenas.map(resena => (
            <div key={resena._id} className="tarjeta-resena">
              <div className="resena-header">
                <h3>{resena.titulo}</h3>
                <span className="resena-puntuacion">
                  {renderEstrellas(resena.puntuacion)}
                </span>
              </div>
              <p className="resena-juego">
                🎮 {obtenerNombreJuego(resena.juegoId)}
              </p>
              <p className="resena-contenido">{resena.contenido}</p>
              <p className="resena-fecha">
                📅 {new Date(resena.fecha).toLocaleDateString()}
              </p>
              <div className="resena-acciones">
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setResenaEditar(resena)
                    setMostrarFormulario(true)
                  }}
                >
                  ✏️ Editar
                </button>
                <button 
                  className="btn-danger"
                  onClick={() => handleEliminar(resena._id)}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {mostrarFormulario && (
        <FormularioResena
          juegos={juegos}
          resenaEditar={resenaEditar}
          onGuardar={handleGuardar}
          onCancelar={() => {
            setMostrarFormulario(false)
            setResenaEditar(null)
          }}
        />
      )}
    </div>
  )
}

export default ListaResenas