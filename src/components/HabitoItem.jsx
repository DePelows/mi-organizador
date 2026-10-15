import { useState } from 'react'
import { fechaHoy, useApp } from '../context/AppContext'

const coloresPorEmoji = {
  '📚': '#8b5cf6',
  '💧': '#06b6d4',
  '🏃': '#f97316',
  '🧘': '#10b981',
  '🥗': '#84cc16',
  '😴': '#6366f1',
  '🎸': '#ec4899',
  '💪': '#ef4444',
}

function HabitoItem({ habito, onToggle, onEliminar }) {
  const { editarHabito } = useApp()
  const [editando, setEditando] = useState(false)
  const [nombre, setNombre] = useState(habito.nombre)
  const [emoji, setEmoji] = useState(habito.emoji)

  const hoy = fechaHoy()
  const marcadoHoy = habito.fechas.includes(hoy)
  const color = coloresPorEmoji[habito.emoji] || '#6366f1'

  const emojisDisponibles = ['📚', '💧', '🏃', '🧘', '🥗', '😴', '🎸', '💪']

  const ultimos7 = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const dia = String(d.getDate()).padStart(2, '0')
    const fecha = `${y}-${m}-${dia}`
    const inicial = ['D', 'L', 'M', 'X', 'J', 'V', 'S'][d.getDay()]
    ultimos7.push({
      fecha,
      inicial,
      cumplido: habito.fechas.includes(fecha),
      esHoy: fecha === hoy,
    })
  }

  const manejarGuardar = () => {
    if (!nombre.trim()) return
    editarHabito(habito.id, { nombre: nombre.trim(), emoji })
    setEditando(false)
  }

  const manejarCancelar = () => {
    setNombre(habito.nombre)
    setEmoji(habito.emoji)
    setEditando(false)
  }

  if (editando) {
    return (
      <div className="habito-item editando">
        <div className="emojis" style={{ marginBottom: '0.75rem' }}>
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
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            autoFocus
            maxLength={40}
            onKeyDown={(e) => {
              if (e.key === 'Enter') manejarGuardar()
              if (e.key === 'Escape') manejarCancelar()
            }}
          />
          <button
            className="btn-small btn-primario"
            onClick={manejarGuardar}
          >
            ✓
          </button>
          <button
            className="btn-small btn-secundario"
            onClick={manejarCancelar}
          >
            ✕
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="habito-item"
      style={{ '--habito-color': color }}
    >
      <div className="habito-header">
        <div className="habito-info">
          <div className="habito-emoji-wrapper">
            <span className="habito-emoji">{habito.emoji}</span>
          </div>
          <div>
            <h3 className="habito-nombre">{habito.nombre}</h3>
            <div className="habito-stats">
              <span className="stat-racha">
                🔥 <strong>{habito.racha}</strong> días
              </span>
              <span className="stat-record">
                🏆 Récord: <strong>{habito.record}</strong>
              </span>
            </div>
          </div>
        </div>
        <div className="tarea-acciones">
          <button
            className="btn-editar-small"
            onClick={() => setEditando(true)}
            title="Editar"
          >
            ✏️
          </button>
          <button
            className="btn-eliminar"
            onClick={() => onEliminar(habito.id)}
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="habito-dias">
        {ultimos7.map((d) => (
          <div
            key={d.fecha}
            className={`dia ${d.cumplido ? 'cumplido' : ''} ${
              d.esHoy ? 'hoy' : ''
            }`}
          >
            <span className="dia-letra">{d.inicial}</span>
            <span className="dia-marca">{d.cumplido ? '✓' : ''}</span>
          </div>
        ))}
      </div>

      <button
        className={`btn-marcar ${marcadoHoy ? 'marcado' : ''}`}
        onClick={() => onToggle(habito.id)}
      >
        {marcadoHoy ? '✓ Hecho hoy' : 'Marcar hoy'}
      </button>
    </div>
  )
}

export default HabitoItem