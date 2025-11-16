import { useState } from 'react'
import './FiltrosJuegos.css'

function FiltrosJuegos({ onFiltrar, juegos }) {
  const [filtros, setFiltros] = useState({
    plataforma: '',
    anio: '',
    genero: '',
    horasMin: '',
    horasMax: '',
    puntuacionMin: '',
    puntuacionMax: ''
  })

  // Extraer opciones únicas de los juegos
  const plataformasUnicas = [...new Set(
    juegos.flatMap(j => j.plataforma?.split(', ') || [])
  )].filter(Boolean).sort()

  const generosUnicos = [...new Set(
    juegos.flatMap(j => j.genero?.split(', ') || [])
  )].filter(Boolean).sort()

  const aniosUnicos = [...new Set(
    juegos.map(j => j.anio).filter(Boolean)
  )].sort((a, b) => b - a)

  const handleChange = (campo, valor) => {
    const nuevosFiltros = {
      ...filtros,
      [campo]: valor
    }
    setFiltros(nuevosFiltros)
    onFiltrar(nuevosFiltros)
  }

  const limpiarFiltros = () => {
    const filtrosVacios = {
      plataforma: '',
      anio: '',
      genero: '',
      horasMin: '',
      horasMax: '',
      puntuacionMin: '',
      puntuacionMax: ''
    }
    setFiltros(filtrosVacios)
    onFiltrar(filtrosVacios)
  }

  return (
    <div className="filtros-container">
      <div className="filtros-header">
        <h3>Filtros</h3>
        <button onClick={limpiarFiltros} className="btn-limpiar">
          Limpiar
        </button>
      </div>

      <div className="filtro-grupo">
        <label>Plataforma</label>
        <select 
          value={filtros.plataforma} 
          onChange={(e) => handleChange('plataforma', e.target.value)}
        >
          <option value="">Todas</option>
          {plataformasUnicas.map(plat => (
            <option key={plat} value={plat}>{plat}</option>
          ))}
        </select>
      </div>

      <div className="filtro-grupo">
        <label>Género</label>
        <select 
          value={filtros.genero} 
          onChange={(e) => handleChange('genero', e.target.value)}
        >
          <option value="">Todos</option>
          {generosUnicos.map(gen => (
            <option key={gen} value={gen}>{gen}</option>
          ))}
        </select>
      </div>

      <div className="filtro-grupo">
        <label>Año</label>
        <select 
          value={filtros.anio} 
          onChange={(e) => handleChange('anio', e.target.value)}
        >
          <option value="">Todos</option>
          {aniosUnicos.map(anio => (
            <option key={anio} value={anio}>{anio}</option>
          ))}
        </select>
      </div>

      <div className="filtro-grupo">
        <label>Horas jugadas</label>
        <div className="filtro-rango">
          <input 
            type="number" 
            placeholder="Min"
            value={filtros.horasMin}
            onChange={(e) => handleChange('horasMin', e.target.value)}
            min="0"
          />
          <span>-</span>
          <input 
            type="number" 
            placeholder="Max"
            value={filtros.horasMax}
            onChange={(e) => handleChange('horasMax', e.target.value)}
            min="0"
          />
        </div>
      </div>

  <div className="filtro-grupo">
    <label>Puntuación</label>
    <div className="filtro-puntuacion-rango">
      <div className="puntuacion-input-wrapper">
        <span className="label-min">Min.</span>
        <input
          type="number"
          min="0"
          max="10"
          step="0.1"
          placeholder="0.0"
          value={filtros.puntuacionMin}
          onChange={(e) => handleChange('puntuacionMin', e.target.value)}
        />
      </div>
      <span className="separador">-</span>
      <div className="puntuacion-input-wrapper">
        <span className="label-max">Max.</span>
        <input
          type="number"
          min="0"
          max="10"
          step="0.1"
          placeholder="10.0"
          value={filtros.puntuacionMax}
          onChange={(e) => handleChange('puntuacionMax', e.target.value)}
        />
      </div>
    </div>
    <div className="badge-puntuacion-ejemplo">
      <span className="estrella-ejemplo">★</span>
      <span>1.0 - 10.0</span>
    </div>
  </div>
</div>
  )
}

export default FiltrosJuegos