import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar'
import BibliotecaJuegos from './pages/BibliotecaJuegos'
import ListaResenas from './pages/ListaResenas'
import EstadisticasPersonales from './pages/EstadisticasPersonales'
import './App.css'

function App() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  return (
    <Router>
      <div className="App">
        <Navbar onAgregarClick={() => setMostrarFormulario(true)} />
        <main className="container">
          <Routes>
            <Route 
              path="/" 
              element={<BibliotecaJuegos mostrarFormularioExterno={mostrarFormulario} cerrarFormulario={() => setMostrarFormulario(false)} />} 
            />
            <Route path="/resenas" element={<ListaResenas />} />
            <Route path="/estadisticas" element={<EstadisticasPersonales />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App