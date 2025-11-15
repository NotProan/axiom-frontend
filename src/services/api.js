import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// API de Juegos
export const juegosAPI = {
  obtenerTodos: () => api.get('/api/juegos'),
  obtenerPorId: (id) => api.get(`/api/juegos/${id}`),
  crear: (juego) => api.post('/api/juegos', juego),
  actualizar: (id, juego) => api.put(`/api/juegos/${id}`, juego),
  eliminar: (id) => api.delete(`/api/juegos/${id}`)
}

// API de Reseñas
export const resenasAPI = {
  obtenerTodas: () => api.get('/api/resenas'),
  obtenerPorJuego: (juegoId) => api.get(`/api/resenas/juego/${juegoId}`),
  crear: (resena) => api.post('/api/resenas', resena),
  actualizar: (id, resena) => api.put(`/api/resenas/${id}`, resena),
  eliminar: (id) => api.delete(`/api/resenas/${id}`)
}

export default api