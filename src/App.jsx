import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Inicio from './pages/Inicio'
import BibliotecaJuegos from './pages/BibliotecaJuegos'
import ListaResenas from './pages/ListaResenas'
import EstadisticasPersonales from './pages/EstadisticasPersonales'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/biblioteca" element={<BibliotecaJuegos />} />
            <Route path="/resenas" element={<ListaResenas />} />
            <Route path="/estadisticas" element={<EstadisticasPersonales />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App