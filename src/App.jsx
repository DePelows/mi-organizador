import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import HeaderMobile from './components/HeaderMobile'
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
import useNotificacionesProgramadas from './hooks/useNotificacionesProgramadas'
import './App.css'

function ContenidoApp() {
  useNotificacionesProgramadas()

  const [sidebarAbierto, setSidebarAbierto] = useState(false)
  const [sidebarColapsado, setSidebarColapsado] = useState(false)
  const [esMobile, setEsMobile] = useState(window.innerWidth < 900)

  // Detectar cambios de tamaño
  useEffect(() => {
    const manejarResize = () => {
      setEsMobile(window.innerWidth < 900)
    }
    window.addEventListener('resize', manejarResize)
    return () => window.removeEventListener('resize', manejarResize)
  }, [])

  return (
    <div className={`app-layout ${sidebarColapsado ? 'sidebar-colapsado' : ''}`}>
      <Sidebar
        abierto={sidebarAbierto}
        onCerrar={() => setSidebarAbierto(false)}
        colapsado={sidebarColapsado && !esMobile}
        onToggleColapsar={() => setSidebarColapsado((v) => !v)}
      />

      <div className="app-contenido">
        <HeaderMobile onAbrirSidebar={() => setSidebarAbierto(true)} />

        <main className="app-main">
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
      </div>

      <Toasts />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ContenidoApp />
    </BrowserRouter>
  )
}

export default App