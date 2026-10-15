import { useState } from 'react'
import { useApp, fechaHoy } from '../context/AppContext'

function TareaItem({ tarea, onToggle, onEliminar }) {
  const {
    editarTarea,
    agregarSubtarea,
    toggleSubtarea,
    eliminarSubtarea,
  } = useApp()

  const [editando, setEditando] = useState(false)
  const [titulo, setTitulo] = useState(tarea.titulo)
  const [prioridad, setPrioridad] = useState(tarea.prioridad)
  const [fechaLimite, setFechaLimite] = useState(tarea.fechaLimite || '')
  const [expandida, setExpandida] = useState(false)
  const [nuevaSubtarea, setNuevaSubtarea] = useState('')

  const colores = {
    alta: '#ef4444',
    media: '#f59e0b',
    baja: '#10b981',
  }

  const subtareas = tarea.subtareas || []
  const completadasSub = subtareas.filter((s) => s.completada).length

  // Verificar si la fecha límite venció
  const hoy = fechaHoy()
  const vencida =
    tarea.fechaLimite && !tarea.completada && tarea.fechaLimite < hoy
  const esHoy = tarea.fechaLimite === hoy

  const manejarGuardar = () => {
    if (!titulo.trim()) return
    editarTarea(tarea.id, {
      titulo: titulo.trim(),
      prioridad,
      fechaLimite: fechaLimite || null,
    })
    setEditando(false)
  }

  const manejarCancelar = () => {
    setTitulo(tarea.titulo)
    setPrioridad(tarea.prioridad)
    setFechaLimite(tarea.fechaLimite || '')
    setEditando(false)
  }

  const manejarAgregarSubtarea = (e) => {
    e.preventDefault()
    if (!nuevaSubtarea.trim()) return
    agregarSubtarea(tarea.id, nuevaSubtarea.trim())
    setNuevaSubtarea('')
  }

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return ''
    const [y, m, d] = fechaStr.split('-')
    const date = new Date(Number(y), Number(m) - 1, Number(d))
    return date.toLocaleDateString('es', { day: 'numeric', month: 'short' })
  }

  if (editando) {
    return (
      <div className="tarea-item editando">
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          autoFocus
          maxLength={100}
          onKeyDown={(e) => {
            if (e.key === 'Enter') manejarGuardar()
            if (e.key === 'Escape') manejarCancelar()
          }}
        />
        <select
          value={prioridad}
          onChange={(e) => setPrioridad(e.target.value)}
        >
          <option value="alta">🔴 Alta</option>
          <option value="media">🟡 Media</option>
          <option value="baja">🟢 Baja</option>
        </select>
        <input
          type="date"
          value={fechaLimite}
          onChange={(e) => setFechaLimite(e.target.value)}
          className="input-fecha-edit"
        />
        <button className="btn-small btn-primario" onClick={manejarGuardar}>
          ✓
        </button>
        <button className="btn-small btn-secundario" onClick={manejarCancelar}>
          ✕
        </button>
      </div>
    )
  }

  return (
    <div
      className={`tarea-item ${tarea.completada ? 'completada' : ''} ${
        vencida ? 'vencida' : ''
      }`}
    >
      <div className="tarea-main">
        <div className="tarea-info">
          <input
            type="checkbox"
            checked={tarea.completada}
            onChange={() => onToggle(tarea.id)}
          />
          <div className="tarea-contenido">
            <span className="tarea-titulo">{tarea.titulo}</span>
            <div className="tarea-meta">
              <span
                className="prioridad"
                style={{ background: colores[tarea.prioridad] }}
              >
                {tarea.prioridad}
              </span>
              {tarea.fechaLimite && (
                <span
                  className={`tarea-fecha ${vencida ? 'vencida' : ''} ${
                    esHoy ? 'hoy' : ''
                  }`}
                >
                  📅 {formatearFecha(tarea.fechaLimite)}
                  {vencida && ' · vencida'}
                  {esHoy && ' · hoy'}
                </span>
              )}
              {subtareas.length > 0 && (
                <button
                  className="tarea-subtareas-badge"
                  onClick={() => setExpandida((v) => !v)}
                >
                  📌 {completadasSub}/{subtareas.length}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="tarea-acciones">
          <button
            className="btn-editar-small"
            onClick={() => setExpandida((v) => !v)}
            title={expandida ? 'Contraer' : 'Subtareas'}
          >
            📌
          </button>
          <button
            className="btn-editar-small"
            onClick={() => setEditando(true)}
            title="Editar"
          >
            ✏️
          </button>
          <button className="btn-eliminar" onClick={() => onEliminar(tarea.id)}>
            🗑️
          </button>
        </div>
      </div>

      {expandida && (
        <div className="subtareas-container">
          {subtareas.length > 0 && (
            <div className="subtareas-lista">
              {subtareas.map((s) => (
                <div key={s.id} className="subtarea-item">
                  <input
                    type="checkbox"
                    checked={s.completada}
                    onChange={() => toggleSubtarea(tarea.id, s.id)}
                  />
                  <span
                    className={`subtarea-texto ${
                      s.completada ? 'completada' : ''
                    }`}
                  >
                    {s.texto}
                  </span>
                  <button
                    className="btn-eliminar-small"
                    onClick={() => eliminarSubtarea(tarea.id, s.id)}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}

          <form className="form-subtarea" onSubmit={manejarAgregarSubtarea}>
            <input
              type="text"
              placeholder="+ Nueva subtarea"
              value={nuevaSubtarea}
              onChange={(e) => setNuevaSubtarea(e.target.value)}
              maxLength={80}
            />
            <button type="submit" className="btn-small btn-primario">
              Agregar
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default TareaItem