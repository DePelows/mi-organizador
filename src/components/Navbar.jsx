import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" end>🏠 Hoy</NavLink>
      <NavLink to="/tareas">📋 Tareas</NavLink>
      <NavLink to="/cursos">📚 Cursos</NavLink>
      <NavLink to="/gym">💪 Gym</NavLink>
      <NavLink to="/enfoque">⏱️ Enfoque</NavLink>
      <NavLink to="/habitos">🔥 Hábitos</NavLink>
      <NavLink to="/logros">🏆 Logros</NavLink>
      <NavLink to="/stats">📊 Stats</NavLink>
      <NavLink to="/config">⚙️ Config</NavLink>
    </nav>
  )
}

export default Navbar