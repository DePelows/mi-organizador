import { useApp } from '../context/AppContext'

function ModalCerrarPeriodo({ abierto, onCerrar, periodo }) {
  const { cerrarPeriodo } = useApp()

  if (!abierto || !periodo) return null

  // Calcula stats del periodo
  const totalPomodoros = periodo.cursos.reduce(
    (acc, c) => acc + c.pomodoros,
    0
  )
  const totalMinutos = periodo.cursos.reduce(
    (acc, c) => acc + c.minutosTotales,
    0
  )
  const totalHoras = (totalMinutos / 60).toFixed(1)

  const mejorRacha = periodo.cursos.reduce(
    (max, c) => Math.max(max, c.racha),
    0
  )

  const mejorCurso =
    periodo.cursos.length > 0
      ? [...periodo.cursos].sort((a, b) => b.pomodoros - a.pomodoros)[0]
      : null

  const manejarCerrar = () => {
    cerrarPeriodo(periodo.id)
    onCerrar()
  }

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📦 Cerrar periodo</h2>
          <button className="btn-cerrar" onClick={onCerrar}>
            ✕
          </button>
        </div>

        <p className="modal-descripcion">
          ¿Estás seguro de cerrar <strong>"{periodo.nombre}"</strong>?
        </p>

        <div className="resumen-periodo">
          <div className="resumen-item">
            <span className="resumen-label">📚 Cursos</span>
            <span className="resumen-valor">{periodo.cursos.length}</span>
          </div>
          <div className="resumen-item">
            <span className="resumen-label">🍅 Pomodoros</span>
            <span className="resumen-valor">{totalPomodoros}</span>
          </div>
          <div className="resumen-item">
            <span className="resumen-label">⏱️ Horas</span>
            <span className="resumen-valor">{totalHoras}h</span>
          </div>
          <div className="resumen-item">
            <span className="resumen-label">🔥 Mejor racha</span>
            <span className="resumen-valor">{mejorRacha} días</span>
          </div>
        </div>

        {mejorCurso && (
          <div className="mejor-curso">
            <span className="mejor-curso-label">🏆 Mejor curso:</span>
            <span className="mejor-curso-nombre">
              {mejorCurso.emoji} {mejorCurso.nombre}
            </span>
            <span className="mejor-curso-poms">
              {mejorCurso.pomodoros} 🍅
            </span>
          </div>
        )}

        <p className="modal-aviso">
          ⚠️ El periodo se archivará en el historial y ya no podrás editarlo.
        </p>

        <div className="modal-botones">
          <button className="btn-secundario" onClick={onCerrar}>
            Cancelar
          </button>
          <button className="btn-peligro" onClick={manejarCerrar}>
            Cerrar periodo
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalCerrarPeriodo