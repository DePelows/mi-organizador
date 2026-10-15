import { useState } from 'react'
import { useApp } from '../context/AppContext'
import HabitoItem from '../components/HabitoItem'

function Habitos() {
  const { habitos, agregarHabito, eliminarHabito, toggleDiaHabito } = useApp()

  const [nombre, setNombre] = useState('')
  const [emoji, setEmoji] = useState('📚')

  const emojisDisponibles = ['📚', '💧', '🏃', '🧘', '🥗', '😴', '🎸', '💪']

  const manejarSubmit = (e) => {
    e.preventDefault()
    if (!nombre.trim()) return
    agregarHabito(nombre.trim(), emoji)
    setNombre('')
    setEmoji('📚')
  }

  return (
    <div className="habitos-page">
      <div className="habitos-header">
        <h2>🔥 Mis Hábitos</h2>
        <span className="contador">{habitos.length} hábitos</span>
      </div>

      <form className="formulario-habito" onSubmit={manejarSubmit}>
        <div className="emojis">
          {emojisDisponibles.map((e) => (
            <button
              key={e}
              type="button"
              className={`emoji-btn ${emoji === e ? 'activo' : ''}`}
              onClick={() => setEmoji(e)}
            >
              {e}
            </button>
          ))}
        </div>
        <div className="fila-habito">
          <input
            type="text"
            placeholder="¿Qué hábito quieres crear?"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <button type="submit">Crear</button>
        </div>
      </form>

      <div className="lista-habitos">
        {habitos.length === 0 ? (
          <p className="vacio">
            No tienes hábitos todavía. ¡Crea el primero! 🚀
          </p>
        ) : (
          habitos.map((h) => (
            <HabitoItem
              key={h.id}
              habito={h}
              onToggle={toggleDiaHabito}
              onEliminar={eliminarHabito}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default Habitos