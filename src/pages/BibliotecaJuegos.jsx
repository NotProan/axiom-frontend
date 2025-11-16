import { useState, useEffect } from 'react'
import { juegosAPI } from '../services/api'
import TarjetaJuego from '../components/TarjetaJuego'
import FormularioJuego from '../components/FormularioJuego'
import ModalVerJuego from '../components/ModalVerJuego'
import TextoCargando from '../assets/AnimacionesExtra/TextoCargando'
import './BibliotecaJuegos.css'

function BibliotecaJuegos() {
  const [juegos, setJuegos] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [juegoEditar, setJuegoEditar] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [juegoVer, setJuegoVer] = useState(null)

  // Cargar juegos al iniciar
  useEffect(() => {
    cargarJuegos()
  }, [])

  // Escuchar el evento para abrir formulario
  useEffect(() => {
    const handleAbrirFormulario = () => {
      setMostrarFormulario(true)
    }

    window.addEventListener('abrirFormularioJuego', handleAbrirFormulario)

    return () => {
      window.removeEventListener('abrirFormularioJuego', handleAbrirFormulario)
    }
  }, [])

  // --------------------------
  //     FUNCIONES CRUD
  // --------------------------

  const cargarJuegos = async () => {
    try {
      setCargando(true)
      const response = await juegosAPI.obtenerTodos()
      setJuegos(response.data)
    } catch (error) {
      console.error('Error al cargar juegos:', error)
      alert('Error al cargar los juegos')
    } finally {
      setCargando(false)
    }
  }

  const handleGuardar = async (juego) => {
    try {
      if (juegoEditar) {
        await juegosAPI.actualizar(juegoEditar._id, juego)
        alert('Juego actualizado exitosamente')
      } else {
        await juegosAPI.crear(juego)
        alert('Juego agregado exitosamente')
      }
      cargarJuegos()
      setMostrarFormulario(false)
      setJuegoEditar(null)
    } catch (error) {
      console.error('Error al guardar:', error)
      alert('Error al guardar el juego')
    }
  }

  const handleEliminar = async (id) => {
    try {
      await juegosAPI.eliminar(id)
      alert('Juego eliminado')
      cargarJuegos()
    } catch (error) {
      console.error('Error al eliminar:', error)
      alert('Error al eliminar el juego')
    }
  }

  const handleEditar = (juego) => {
    setJuegoEditar(juego)
    setMostrarFormulario(true)
  }

  const handleCancelar = () => {
    setMostrarFormulario(false)
    setJuegoEditar(null)
  }

  const handleVer = (juego) => {
    setJuegoVer(juego)
  }

  // --------------------------
  //     RENDER
  // --------------------------

  if (cargando) {
    return <TextoCargando texto="Cargando biblioteca, espera un segundo..." />
  }

  return (
    <div className="biblioteca">
      <div className="biblioteca-header">
        <h1>Mi Biblioteca de Juegos</h1>
      </div>

      {juegos.length === 0 ? (
        <div className="sin-juegos">
          <p>No tienes juegos en tu biblioteca</p>
          <p>Agrega tu primer juego</p>
        </div>
      ) : (
        <div className="grid-juegos">
          {juegos.map(juego => (
            <TarjetaJuego
              key={juego._id}
              juego={juego}
              onEliminar={handleEliminar}
              onEditar={handleEditar}
              onVer={handleVer}
            />
          ))}
        </div>
      )}

      {mostrarFormulario && (
        <FormularioJuego
          juegoEditar={juegoEditar}
          onGuardar={handleGuardar}
          onCancelar={handleCancelar}
        />
      )}

      {juegoVer && (
        <ModalVerJuego
          juego={juegoVer}
          onCerrar={() => setJuegoVer(null)}
        />
      )}
    </div>
  )
}

export default BibliotecaJuegos
