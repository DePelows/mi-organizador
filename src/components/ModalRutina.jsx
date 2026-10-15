import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'

const EMOJIS = ['💪', '🏋️', '🤸', '🏃', '🚴', '🧘', '🥊', '⚽']
const COLORES = [
  '#ef4444', '#f97316', '#f59e0b', '#10b981',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
]

function ModalRutina({ abierto, onCerrar, rutinaEditar }) {
  const { agregarRutina, editarRutina, DIAS_SEMANA } = useApp()
  const [nombre, setNombre] = useState('')
  const [emoji, setEmoji] = useState('💪')
  const [color, setColor] = useState('#ef4444')
  const [dias, setDias] = useState([])
  const [duracion, setDuracion] = useState(45)

  const esEdicion = !!rutinaEditar

  useEffect(() => {
    if (abierto && rutinaEditar) {
      setNombre(rutinaEditar.nombre)
      setEmoji(rutinaEditar.emoji)
      setColor(rutinaEditar.color)
      setDias(rutinaEditar.dias)
      setDuracion(rutinaEditar.duracionEstimada)
    } else if (abierto) {
      setNombre('')
      setEmoji('💪')
      setColor('#ef4444')
      setDias([])
      setDuracion(45)
    }
  }, [abierto, rutinaEditar])

  if (!abierto) return null

  const toggleDia = (d) => {
    setDias(dias.includes(d) ? dias.filter((x) => x !== d) : [...dias, d])
  }

  const manejarSubmit = (e) => {
    e.preventDefault()
    if (!nombre.trim() || dias.length === 0) return

    if (esEdicion) {
      editarRutina(rutinaEditar.id, {
        nombre: nombre.trim(),
        emoji,
        color,
        dias,
        duracionEstimada: Number(duracion),
      })
    } else {
      agregarRutina(nombre.trim(), emoji, color, dias, Number(duracion))
    }
    resetYcerrar()
  }

  const resetYcerrar = () => {
    setNombre('')
    setEmoji('💪')
    setColor('#ef4444')
    setDias([])
    setDuracion(45)
    onCerrar()
  }

  return (
    <div className="modal-overlay" onClick={resetYcerrar}>
      <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{esEdicion ? '✏️ Editar rutina' : '💪 Nueva rutina'}</h2>
          <button className="btn-cerrar" onClick={resetYcerrar}>
            ✕
          </button>
        </div>

        <form onSubmit={manejarSubmit}>
          <div className="campo">
            <label>Nombre de la rutina</label>
            <input
              type="text"
              placeholder="Ej: Empuje, Día A, Full Body..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoFocus
              maxLength={30}
            />
          </div>

          <div className="campo">
            <label>Emoji</label>
            <div className="emojis-grid">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  className={`emoji-opcion ${emoji === e ? 'activo' : ''}`}
                  onClick={() => setEmoji(e)}
                  style={{
                    borderColor: emoji === e ? color : '#2a2a35',
                    boxShadow: emoji === e ? `0 0 15px ${color}80` : 'none',
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
              {COLORES.map((c) => (
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

          <div className="campo">
            <label>¿Qué días la haces?</label>
            <div className="dias-semana">
              {DIAS_SEMANA.map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`dia-btn ${dias.includes(d) ? 'activo' : ''}`}
                  onClick={() => toggleDia(d)}
                  style={{
                    borderColor: dias.includes(d) ? color : '#2a2a35',
                    background: dias.includes(d) ? color : '#0f0f14',
                  }}
                >
                  {d.slice(0, 3).toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="campo">
            <label>Duración estimada (min)</label>
            <input
              type="number"
              min="5"
              max="180"
              value={duracion}
              onChange={(e) => setDuracion(e.target.value)}
            />
          </div>

          {dias.length === 0 && (
            <p className="modal-aviso-mini">⚠️ Elige al menos un día</p>
          )}

          <div className="modal-botones">
            <button
              type="button"
              className="btn-secundario"
              onClick={resetYcerrar}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primario"
              disabled={!nombre.trim() || dias.length === 0}
              style={{
                opacity: !nombre.trim() || dias.length === 0 ? 0.5 : 1,
              }}
            >
              {esEdicion ? 'Guardar cambios' : 'Crear rutina'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalRutina