export const crearMapaJuegos = (juegos = []) => {
  const map = new Map()
  juegos.forEach(juego => {
    if (!juego) return
    const id = juego._id?.toString()
    if (id) {
      map.set(id, juego)
    }
  })
  return map
}

const obtenerIdJuegoRelacionado = (resena) => {
  const fuente = resena?.juegoId || resena?.juego
  if (!fuente) return null
  if (typeof fuente === 'string') return fuente
  if (typeof fuente === 'object') {
    if (fuente._id) return fuente._id.toString()
    if (typeof fuente.toString === 'function') {
      const texto = fuente.toString()
      if (texto) return texto
    }
  }
  return null
}

export const enriquecerResenasConJuego = (resenas = [], juegoMap) => {
  return resenas.map(resena => {
    const idRelacionado = obtenerIdJuegoRelacionado(resena)
    const juegoRelacionado = idRelacionado ? juegoMap.get(idRelacionado) : null
    return {
      ...resena,
      juegoRelacionado,
      juegoTitulo: juegoRelacionado?.titulo || 'Juego no encontrado',
      juegoPortada: juegoRelacionado?.portada || '',
      juegoGenero: juegoRelacionado?.genero || 'Género no indicado',
      juegoPlataforma: juegoRelacionado?.plataforma || 'Plataforma desconocida',
      juegoAnio: juegoRelacionado?.anio || 'Sin dato',
      juegoDesarrollador: juegoRelacionado?.desarrollador || 'Sin registro',
      juegoPuntuacion: juegoRelacionado?.puntuacion || 0,
      juegoHorasJugadas: juegoRelacionado?.horasJugadas || 0,
      puntuacion10: convertirPuntuacionA10(resena.puntuacion)
    }
  })
}

const convertirPuntuacionA10 = (valor) => {
  const numero = Number(valor)
  if (Number.isNaN(numero)) return 0
  if (numero > 5) return Math.min(numero, 10)
  return Math.min(numero * 2, 10)
}
