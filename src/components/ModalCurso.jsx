import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'

const EMOJIS_DISPONIBLES = [
  '📚', '📐', '💻', '📖', '🧪', '🎨', '🎵', '🌍',
  '⚛️', '🧮', '📊', '🔬', '🧠', '💡', '📝', '🗣️',
]

const COLORES_DISPONIBLES = [
  '#6366f1', '#ec4899', '#ef4444', '#f97316', '#f59e0b',
  '#10b981', '#06b6d4', '#8b5cf6', '#3b82f6', '#84cc16',
]

function ModalCurso({ abierto, onCerrar, periodoId, cursoEditar }) {
  const { agregarCurso, editarCurso } = useApp()
  const [nombre, setNombre] = useState('')
  const [emoji, setEmoji] = useState('📚')
  const [color, setColor] = useState('#6366f1')

  const esEdicion = !!cursoEditar

  // Cargar datos cuando se abre en modo edición
  useEffect(() => {
    if (abierto && cursoEditar) {
      setNombre(cursoEditar.nombre)
      setEmoji(cursoEditar.emoji)
      setColor(cursoEditar.color)
    } else if (abierto) {
      setNombre('')
      setEmoji('📚')
      setColor('#6366f1')
    }
  }, [abierto, cursoEditar])

  if (!abierto) return null

  const manejarSubmit = (e) => {
    e.preventDefault()
    if (!nombre.trim()) return

    if (esEdicion) {
      editarCurso(periodoId, cursoEditar.id, {
        nombre: nombre.trim(),
        emoji,
        color,
      })
    } else {
      agregarCurso(periodoId, nombre.trim(), emoji, color)
    }
    resetYcerrar()
  }

  const resetYcerrar = () => {
    setNombre('')
    setEmoji('📚')
    setColor('#6366f1')
    onCerrar()
  }

  return (
    <div className="modal-overlay" onClick={resetYcerrar}>
      <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{esEdicion ? '✏️ Editar curso' : '📖 Nuevo curso'}</h2>
          <button className="btn-cerrar" onClick={resetYcerrar}>
            ✕
          </button>
        </div>

        <form onSubmit={manejarSubmit}>
          <div className="campo">
            <label>Nombre del curso</label>
            <input
              type="text"
              placeholder="Ej: Cálculo III, React, Inglés..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoFocus
              maxLength={40}
            />
          </div>

          <div className="campo">
            <label>Emoji</label>
            <div className="emojis-grid">
              {EMOJIS_DISPONIBLES.map((e) => (
                <button
                  key={e}
                  type="button"
                  className={`emoji-opcion ${emoji === e ? 'activo' : ''}`}
                  onClick={() => setEmoji(e)}
                  style={{
                    borderColor: emoji === e ? color : '#2a2a35',
                    boxShadow:
                      emoji === e ? `0 0 15px ${color}80` : 'none',
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="campo">
            <label>Color</label>
            <div className="colores-grid">
              {COLORES_DISPONIBLES.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-opcion ${color === c ? 'activo' : ''}`}
                  onClick={() => setColor(c)}
                  style={{ background: c }}
                >
                  {color === c && '✓'}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-botones">
            <button
              type="button"
              className="btn-secundario"
              onClick={resetYcerrar}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primario">
              {esEdicion ? 'Guardar cambios' : 'Crear curso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalCurso