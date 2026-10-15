import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HeaderNivel from './components/HeaderNivel'
import Toasts from './components/Toasts'
import Dashboard from './pages/Dashboard'
import Tareas from './pages/Tareas'
import Cursos from './pages/Cursos'
import Gym from './pages/Gym'
import Enfoque from './pages/Enfoque'
import Habitos from './pages/Habitos'
import Logros from './pages/Logros'
import Estadisticas from './pages/Estadisticas'
import Config from './pages/Config'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header>
          <div className="header-top">
            <h1>Mi Organizador Pro 🚀</h1>
            <HeaderNivel />
          </div>
          <Navbar />
        </header>

        <main className="contenido">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tareas" element={<Tareas />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/gym" element={<Gym />} />
            <Route path="/enfoque" element={<Enfoque />} />
            <Route path="/habitos" element={<Habitos />} />
            <Route path="/logros" element={<Logros />} />
            <Route path="/stats" element={<Estadisticas />} />
            <Route path="/config" element={<Config />} />
          </Routes>
        </main>

        <Toasts />
      </div>
    </BrowserRouter>
  )
}

export default App