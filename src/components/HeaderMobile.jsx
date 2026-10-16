import { useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const TITULOS = {
  '/': '🏠 Hoy',
  '/tareas': '📋 Tareas',
  '/cursos': '📚 Cursos',
  '/gym': '💪 Gym',
  '/enfoque': '⏱️ Enfoque',
  '/habitos': '🔥 Hábitos',
  '/logros': '🏆 Logros',
  '/stats': '📊 Stats',
  '/config': '⚙️ Config',
}

function HeaderMobile({ onAbrirSidebar }) {
  const location = useLocation()
  const { tema, toggleTema } = useApp()

  const titulo = TITULOS[location.pathname] || '🎯 Focus'

  return (
    <header className="header-mobile">
      <button
        className="header-btn-menu"
        onClick={onAbrirSidebar}
        aria-label="Abrir menú"
      >
        ☰
      </button>

      <h1 className="header-titulo">{titulo}</h1>

      <button
        className="header-btn-tema"
        onClick={toggleTema}
        aria-label="Cambiar tema"
      >
        {tema === 'oscuro' ? '☀️' : '🌙'}
      </button>
    </header>
  )
}

export default HeaderMobile