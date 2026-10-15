import { useState } from 'react'
import { useApp } from '../context/AppContext'

function HistorialPeriodos() {
  const { periodosCerrados, reactivarPeriodo, eliminarPeriodo } = useApp()
  const [expandido, setExpandido] = useState(null)

  if (periodosCerrados.length === 0) return null

  const toggleExpandir = (id) => {
    setExpandido(expandido === id ? null : id)
  }

  return (
    <div className="historial-seccion">
      <h3 className="historial-titulo">📦 Historial de periodos</h3>

      <div className="historial-lista">
        {periodosCerrados.map((p) => {
          const totalPomodoros = p.cursos.reduce(
            (acc, c) => acc + c.pomodoros,
            0
          )
          const totalMinutos = p.cursos.reduce(
            (acc, c) => acc + c.minutosTotales,
            0
          )
          const totalHoras = (totalMinutos / 60).toFixed(1)
          const mejorRacha = p.cursos.reduce(
            (max, c) => Math.max(max, c.racha),
            0
          )

          return (
            <div key={p.id} className="periodo-cerrado">
              <div
                className="periodo-cerrado-header"
                onClick={() => toggleExpandir(p.id)}
              >
                <div>
                  <span className="periodo-cerrado-nombre">📅 {p.nombre}</span>
                  <span className="periodo-cerrado-badge">cerrado</span>
                </div>
                <span className="periodo-cerrado-toggle">
                  {expandido === p.id ? '▲' : '▼'}
                </span>
              </div>

              <div className="periodo-cerrado-stats">
                <span>📚 {p.cursos.length} cursos</span>
                <span>🍅 {totalPomodoros}</span>
                <span>⏱️ {totalHoras}h</span>
                <span>🔥 {mejorRacha} días</span>
              </div>

              {expandido === p.id && (
                <div className="periodo-cerrado-detalle">
                  {p.cursos.length === 0 ? (
                    <p className="vacio-pequeno">Este periodo no tuvo cursos.</p>
                  ) : (
                    <div className="cursos-historial">
                      {p.cursos.map((c) => (
                        <div
                          key={c.id}
                          className="curso-historial-item"
                          style={{ '--curso-color': c.color }}
                        >
                          <span className="chi-emoji">{c.emoji}</span>
                          <span className="chi-nombre">{c.nombre}</span>
                          <span className="chi-stats">
                            🍅 {c.pomodoros} · ⏱️{' '}
                            {(c.minutosTotales / 60).toFixed(1)}h
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="acciones-periodo">
                    <button
                      className="btn-secundario-small"
                      onClick={() => reactivarPeriodo(p.id)}
                    >
                      ♻️ Reactivar
                    </button>
                    <button
                      className="btn-peligro-small"
                      onClick={() => {
                        if (
                          confirm(
                            `¿Eliminar "${p.nombre}"? No se puede deshacer.`
                          )
                        ) {
                          eliminarPeriodo(p.id)
                        }
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default HistorialPeriodos