import { useState, useEffect } from 'react'
import { juegosAPI } from '../services/api'
import TarjetaJuego from '../components/TarjetaJuego'
import FormularioJuego from '../components/FormularioJuego'
import ModalVerJuego from '../components/ModalVerJuego'
import TextoCargando from '../assets/AnimacionesExtra/TextoCargando'
import './BibliotecaJuegos.css'
import FiltrosJuegos from '../components/FiltrosJuegos'

function BibliotecaJuegos() {
  const [juegos, setJuegos] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [juegoEditar, setJuegoEditar] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [juegoVer, setJuegoVer] = useState(null)
const [juegosFiltrados, setJuegosFiltrados] = useState([])


  useEffect(() => {
    cargarJuegos()
  }, [])

  useEffect(() => {
    document.body.classList.add('bg-biblioteca')
    return () => {
      document.body.classList.remove('bg-biblioteca')
    }
  }, [])

  
  useEffect(() => {
    const handleAbrirFormulario = () => {
      setMostrarFormulario(true)
    }

    window.addEventListener('abrirFormularioJuego', handleAbrirFormulario)

    return () => {
      window.removeEventListener('abrirFormularioJuego', handleAbrirFormulario)
    }
  }, [])

  const cargarJuegos = async () => {
    try {
      setCargando(true)
      const response = await juegosAPI.obtenerTodos()
      setJuegos(response.data)
      setJuegosFiltrados(response.data)
    } catch (error) {
      console.error('Error al cargar juegos:', error)
      alert('Error al cargar los juegos')
    } finally {
      setCargando(false)
    }
  }
  const aplicarFiltros = (filtros) => {
  let resultado = [...juegos]

  if (filtros.plataforma) {
    resultado = resultado.filter(j => 
      j.plataforma?.includes(filtros.plataforma)
    )
  }

  if (filtros.genero) {
    resultado = resultado.filter(j => 
      j.genero?.includes(filtros.genero)
    )
  }

  if (filtros.anio) {
    resultado = resultado.filter(j => 
      j.anio === parseInt(filtros.anio)
    )
  }

  if (filtros.horasMin) {
    resultado = resultado.filter(j => 
      (j.horasJugadas || 0) >= parseInt(filtros.horasMin)
    )
  }

  if (filtros.horasMax) {
    resultado = resultado.filter(j => 
      (j.horasJugadas || 0) <= parseInt(filtros.horasMax)
    )
  }

  if (filtros.puntuacionMin) {
  resultado = resultado.filter(j => 
    (j.puntuacion || 0) >= parseFloat(filtros.puntuacionMin)
  )
}

if (filtros.puntuacionMax) {
  resultado = resultado.filter(j => 
    (j.puntuacion || 0) <= parseFloat(filtros.puntuacionMax)
  )
}
  setJuegosFiltrados(resultado)
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



  if (cargando) {
  return <TextoCargando texto="Cargando biblioteca, espera un segundo..." />
}

return (
  <div className="biblioteca">
    <div className="biblioteca-header">
      <h1>Tu Biblioteca</h1>
    </div>

    <div className="biblioteca-contenido">
      <FiltrosJuegos onFiltrar={aplicarFiltros} juegos={juegos} />

      <div className="biblioteca-juegos">
        {juegosFiltrados.length === 0 ? (
          <div className="sin-juegos">
            <p>No se encontraron juegos con esos filtros</p>
          </div>
        ) : (
          <div className="grid-juegos">
            {juegosFiltrados.map(juego => (
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
      </div>
    </div>

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
