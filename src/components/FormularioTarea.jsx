import { useState } from 'react'

function FormularioTarea({ onAgregar }) {
  const [titulo, setTitulo] = useState('')
  const [prioridad, setPrioridad] = useState('media')
  const [fechaLimite, setFechaLimite] = useState('')
  const [mostrarFecha, setMostrarFecha] = useState(false)

  const manejarSubmit = (e) => {
    e.preventDefault()
    if (!titulo.trim()) return

    onAgregar({
      id: Date.now(),
      titulo: titulo.trim(),
      prioridad,
      fechaLimite: fechaLimite || null,
      completada: false,
      completadaEn: null,
      subtareas: [],
      fecha: new Date().toISOString(),
    })

    setTitulo('')
    setPrioridad('media')
    setFechaLimite('')
    setMostrarFecha(false)
  }

  return (
    <form className="formulario-tarea" onSubmit={manejarSubmit}>
      <div className="formulario-tarea-fila">
        <input
          type="text"
          placeholder="¿Qué tienes que hacer?"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          maxLength={100}
        />
        <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
          <option value="alta">🔴 Alta</option>
          <option value="media">🟡 Media</option>
          <option value="baja">🟢 Baja</option>
        </select>
        <button
          type="button"
          className="btn-fecha"
          onClick={() => setMostrarFecha((v) => !v)}
          title="Fecha límite"
        >
          📅
        </button>
        <button type="submit">Agregar</button>
      </div>

      {mostrarFecha && (
        <div className="formulario-fecha">
          <label>Fecha límite (opcional):</label>
          <input
            type="date"
            value={fechaLimite}
            onChange={(e) => setFechaLimite(e.target.value)}
          />
          {fechaLimite && (
            <button
              type="button"
              className="btn-quitar-fecha"
              onClick={() => setFechaLimite('')}
            >
              Quitar
            </button>
          )}
        </div>
      )}
    </form>
  )
}

export default FormularioTarea