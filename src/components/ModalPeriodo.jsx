import { useState } from 'react'
import { useApp } from '../context/AppContext'

function ModalPeriodo({ abierto, onCerrar }) {
  const { crearPeriodo } = useApp()
  const [nombre, setNombre] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')

  if (!abierto) return null

  const manejarSubmit = (e) => {
    e.preventDefault()
    if (!nombre.trim()) return
    crearPeriodo(nombre.trim(), fechaInicio, fechaFin)
    setNombre('')
    setFechaInicio('')
    setFechaFin('')
    onCerrar()
  }

  const manejarCerrar = () => {
    setNombre('')
    setFechaInicio('')
    setFechaFin('')
    onCerrar()
  }

  return (
    <div className="modal-overlay" onClick={manejarCerrar}>
      <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📅 Nuevo periodo</h2>
          <button className="btn-cerrar" onClick={manejarCerrar}>
            ✕
          </button>
        </div>

        <form onSubmit={manejarSubmit}>
          <div className="campo">
            <label>Nombre del periodo</label>
            <input
              type="text"
              placeholder="Ej: 2026-2, Semestre B, Ciclo 5..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoFocus
              maxLength={30}
            />
          </div>

          <div className="campo-doble">
            <div className="campo">
              <label>Fecha inicio (opcional)</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div className="campo">
              <label>Fecha fin (opcional)</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-botones">
            <button
              type="button"
              className="btn-secundario"
              onClick={manejarCerrar}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primario">
              Crear periodo
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalPeriodo