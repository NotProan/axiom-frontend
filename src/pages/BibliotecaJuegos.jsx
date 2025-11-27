import { useState, useEffect } from 'react'
import { juegosAPI } from '../services/api'
import TarjetaJuego from '../components/TarjetaJuego'
import FormularioJuego from '../components/FormularioJuego'
import ModalVerJuego from '../components/ModalVerJuego'
import TextoCargando from '../assets/AnimacionesExtra/TextoCargando'
import './BibliotecaJuegos.css'
import FiltrosJuegos from '../components/FiltrosJuegos'
import ModalConfirmacion from '../components/ModalConfirmacion'

function BibliotecaJuegos() {
  const [juegos, setJuegos] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [juegoEditar, setJuegoEditar] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [juegoVer, setJuegoVer] = useState(null)
  const [juegosFiltrados, setJuegosFiltrados] = useState([])
  const [modalConfig, setModalConfig] = useState({
    abierto: false,
    titulo: '',
    mensaje: '',
    tipo: 'info',
    confirmText: 'Guardar',
    cancelText: 'Cancelar',
    okText: 'Ok',
    onConfirm: null,
    onCancel: null
  })

  const cerrarModal = () => {
    setModalConfig(prev => ({
      ...prev,
      abierto: false,
      onConfirm: null,
      onCancel: null
    }))
  }

  const mostrarModal = (config) => {
    setModalConfig({
      abierto: true,
      titulo: config.titulo || '',
      mensaje: config.mensaje || '',
      tipo: config.tipo || 'info',
      confirmText: config.confirmText,
      cancelText: config.cancelText,
      okText: config.okText,
      onConfirm: config.onConfirm || null,
      onCancel: config.onCancel || null
    })
  }


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
      mostrarModal({
        titulo: 'Error al cargar juegos',
        mensaje: 'No pudimos cargar tu biblioteca. Intenta de nuevo en un momento.',
        tipo: 'info',
        onConfirm: cerrarModal
      })
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
        mostrarModal({
          titulo: 'Juego editado',
          mensaje: 'Los cambios del juego se guardaron correctamente.',
          tipo: 'info',
          onConfirm: cerrarModal
        })
      } else {
        await juegosAPI.crear(juego)
        mostrarModal({
          titulo: 'Juego creado',
          mensaje: 'El juego se agrego a tu biblioteca.',
          tipo: 'info',
          onConfirm: cerrarModal
        })
      }
      cargarJuegos()
      setMostrarFormulario(false)
      setJuegoEditar(null)
    } catch (error) {
      console.error('Error al guardar:', error)
      mostrarModal({
        titulo: 'Error al guardar',
        mensaje: 'No se pudo guardar el juego. Revisa la informacion e intenta nuevamente.',
        tipo: 'info',
        onConfirm: cerrarModal
      })
    }
  }

  const solicitarEliminar = (juego) => {
    mostrarModal({
      titulo: 'Eliminar juego',
      mensaje: `Eliminar "${juego.titulo}" de tu biblioteca?`,
      tipo: 'confirm',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        cerrarModal()
        try {
          await juegosAPI.eliminar(juego._id)
          await cargarJuegos()
          mostrarModal({
            titulo: 'Juego eliminado',
            mensaje: `"${juego.titulo}" se elimino correctamente.`,
            tipo: 'info',
            onConfirm: cerrarModal
          })
        } catch (error) {
          console.error('Error al eliminar:', error)
          mostrarModal({
            titulo: 'No se pudo eliminar',
            mensaje: 'Ocurrio un problema al eliminar el juego. Intenta nuevamente.',
            tipo: 'info',
            onConfirm: cerrarModal
          })
        }
      },
      onCancel: cerrarModal
    })
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
                onEliminar={solicitarEliminar}
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

    <ModalConfirmacion
      abierto={modalConfig.abierto}
      titulo={modalConfig.titulo}
      mensaje={modalConfig.mensaje}
      tipo={modalConfig.tipo}
      confirmText={modalConfig.confirmText}
      cancelText={modalConfig.cancelText}
      okText={modalConfig.okText}
      onConfirm={modalConfig.onConfirm}
      onCancel={modalConfig.onCancel}
      onClose={cerrarModal}
    />
  </div>
)
}

export default BibliotecaJuegos
