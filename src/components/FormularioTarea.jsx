import { useState } from 'react'

const DIAS_SEMANA_CORTOS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

function FormularioTarea({ onAgregar }) {
  const [titulo, setTitulo] = useState('')
  const [prioridad, setPrioridad] = useState('media')
  const [fechaLimite, setFechaLimite] = useState('')
  const [recurrencia, setRecurrencia] = useState('ninguna')
  const [diasSemana, setDiasSemana] = useState([])

  const [mostrarFecha, setMostrarFecha] = useState(false)
  const [mostrarRecurrencia, setMostrarRecurrencia] = useState(false)

  const toggleDia = (dia) => {
    setDiasSemana(
      diasSemana.includes(dia)
        ? diasSemana.filter((d) => d !== dia)
        : [...diasSemana, dia]
    )
  }

  const manejarSubmit = (e) => {
    e.preventDefault()
    if (!titulo.trim()) return

    onAgregar({
      id: Date.now(),
      titulo: titulo.trim(),
      prioridad,
      fechaLimite: fechaLimite || null,
      recurrencia: recurrencia === 'ninguna' ? null : recurrencia,
      diasSemana: recurrencia === 'dias-semana' ? diasSemana : [],
      completada: false,
      completadaEn: null,
      subtareas: [],
      fecha: new Date().toISOString(),
    })

    setTitulo('')
    setPrioridad('media')
    setFechaLimite('')
    setRecurrencia('ninguna')
    setDiasSemana([])
    setMostrarFecha(false)
    setMostrarRecurrencia(false)
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
          className={`btn-fecha ${mostrarFecha ? 'activo' : ''}`}
          onClick={() => setMostrarFecha((v) => !v)}
          title="Fecha límite"
        >
          📅
        </button>
        <button
          type="button"
          className={`btn-fecha ${mostrarRecurrencia ? 'activo' : ''}`}
          onClick={() => setMostrarRecurrencia((v) => !v)}
          title="Repetir"
        >
          🔁
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

      {mostrarRecurrencia && (
        <div className="formulario-recurrencia">
          <label>Repetir:</label>
          <div className="recurrencia-opciones">
            <button
              type="button"
              className={`recurrencia-chip ${
                recurrencia === 'ninguna' ? 'activo' : ''
              }`}
              onClick={() => setRecurrencia('ninguna')}
            >
              No repetir
            </button>
            <button
              type="button"
              className={`recurrencia-chip ${
                recurrencia === 'diaria' ? 'activo' : ''
              }`}
              onClick={() => setRecurrencia('diaria')}
            >
              🔁 Diaria
            </button>
            <button
              type="button"
              className={`recurrencia-chip ${
                recurrencia === 'semanal' ? 'activo' : ''
              }`}
              onClick={() => setRecurrencia('semanal')}
            >
              📅 Semanal
            </button>
            <button
              type="button"
              className={`recurrencia-chip ${
                recurrencia === 'mensual' ? 'activo' : ''
              }`}
              onClick={() => setRecurrencia('mensual')}
            >
              🗓️ Mensual
            </button>
            <button
              type="button"
              className={`recurrencia-chip ${
                recurrencia === 'dias-semana' ? 'activo' : ''
              }`}
              onClick={() => setRecurrencia('dias-semana')}
            >
              🎯 Días específicos
            </button>
          </div>

          {recurrencia === 'dias-semana' && (
            <div className="dias-semana-recurrencia">
              {DIAS_SEMANA_CORTOS.map((letra, i) => (
                <button
                  key={i}
                  type="button"
                  className={`dia-semana-btn ${
                    diasSemana.includes(i) ? 'activo' : ''
                  }`}
                  onClick={() => toggleDia(i)}
                >
                  {letra}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </form>
  )
}

export default FormularioTarea