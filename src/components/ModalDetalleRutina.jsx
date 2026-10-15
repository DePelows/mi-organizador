import { useState } from 'react'
import { useApp } from '../context/AppContext'

function ModalDetalleRutina({ rutina, onCerrar }) {
  const { agregarEjercicio, eliminarEjercicio, editarEjercicio, editarRutina } =
    useApp()

  const [mostrarForm, setMostrarForm] = useState(false)
  const [editandoId, setEditandoId] = useState(null)

  const [nombre, setNombre] = useState('')
  const [series, setSeries] = useState('3')
  const [reps, setReps] = useState('10')
  const [peso, setPeso] = useState('')
  const [notas, setNotas] = useState('')

  const resetForm = () => {
    setNombre('')
    setSeries('3')
    setReps('10')
    setPeso('')
    setNotas('')
    setMostrarForm(false)
    setEditandoId(null)
  }

  const manejarSubmit = (e) => {
    e.preventDefault()
    if (!nombre.trim()) return

    if (editandoId) {
      editarEjercicio(rutina.id, editandoId, {
        nombre: nombre.trim(),
        series,
        reps,
        peso,
        notas,
      })
    } else {
      agregarEjercicio(rutina.id, nombre.trim(), series, reps, peso, notas)
    }
    resetForm()
  }

  const manejarEditar = (ejercicio) => {
    setEditandoId(ejercicio.id)
    setNombre(ejercicio.nombre)
    setSeries(ejercicio.series)
    setReps(ejercicio.reps)
    setPeso(ejercicio.peso)
    setNotas(ejercicio.notas)
    setMostrarForm(true)
  }

  const diasTexto = rutina.dias
    .map((d) => d.slice(0, 3).toUpperCase())
    .join(' · ')

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div
        className="modal-contenido modal-grande"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>
            {rutina.emoji} {rutina.nombre}
          </h2>
          <button className="btn-cerrar" onClick={onCerrar}>
            ✕
          </button>
        </div>

        <div className="detalle-meta">
          <span>📅 {diasTexto}</span>
          <span>⏱️ {rutina.duracionEstimada} min</span>
        </div>

        <div className="detalle-ejercicios">
          <div className="detalle-titulo-fila">
            <h3>Ejercicios ({rutina.ejercicios.length})</h3>
            {!mostrarForm && (
              <button
                className="btn-primario btn-small"
                onClick={() => setMostrarForm(true)}
              >
                + Agregar
              </button>
            )}
          </div>

          {rutina.ejercicios.length === 0 && !mostrarForm && (
            <div className="ejercicios-vacio">
              <span className="vacio-emoji-small">🏋️</span>
              <p>No tienes ejercicios todavía</p>
              <button
                className="btn-primario btn-small"
                onClick={() => setMostrarForm(true)}
              >
                + Agregar primer ejercicio
              </button>
            </div>
          )}

          {rutina.ejercicios.length > 0 && (
            <div className="lista-ejercicios">
              {rutina.ejercicios.map((e, i) => (
                <div key={e.id} className="ejercicio-item">
                  <span className="ej-numero">{i + 1}</span>
                  <div className="ej-info">
                    <span className="ej-nombre">{e.nombre}</span>
                    <span className="ej-detalle">
                      {e.series} series × {e.reps} reps
                      {e.peso && ` · ${e.peso} kg`}
                    </span>
                    {e.notas && (
                      <span className="ej-notas">📝 {e.notas}</span>
                    )}
                  </div>
                  <div className="ej-acciones">
                    <button
                      className="btn-editar-small"
                      onClick={() => manejarEditar(e)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-eliminar-small"
                      onClick={() => eliminarEjercicio(rutina.id, e.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {mostrarForm && (
            <form className="form-ejercicio" onSubmit={manejarSubmit}>
              <div className="campo">
                <label>Nombre del ejercicio *</label>
                <input
                  type="text"
                  placeholder="Ej: Press banca, Sentadilla..."
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  autoFocus
                  maxLength={50}
                />
              </div>

              <div className="campo-doble">
                <div className="campo">
                  <label>Series</label>
                  <input
                    type="text"
                    placeholder="4"
                    value={series}
                    onChange={(e) => setSeries(e.target.value)}
                    maxLength={10}
                  />
                </div>
                <div className="campo">
                  <label>Reps</label>
                  <input
                    type="text"
                    placeholder="8-10"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    maxLength={10}
                  />
                </div>
              </div>

              <div className="campo">
                <label>Peso (opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: 60, 20 por lado, corporal..."
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  maxLength={20}
                />
              </div>

              <div className="campo">
                <label>Notas (opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: última serie al fallo"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  maxLength={100}
                />
              </div>

              <div className="form-botones">
                <button
                  type="button"
                  className="btn-secundario btn-small"
                  onClick={resetForm}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primario btn-small"
                  disabled={!nombre.trim()}
                  style={{ opacity: !nombre.trim() ? 0.5 : 1 }}
                >
                  {editandoId ? 'Guardar cambios' : 'Agregar ejercicio'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ModalDetalleRutina