import { useState } from 'react'
import { useApp, fechaHoy } from '../context/AppContext'
import FormularioTarea from '../components/FormularioTarea'
import TareaItem from '../components/TareaItem'

function Tareas() {
  const { tareas, agregarTarea, toggleTarea, eliminarTarea } = useApp()
  const [filtro, setFiltro] = useState('todas')
  const [vista, setVista] = useState('lista') // 'lista' | 'semana'

  const tareasFiltradas = tareas.filter((t) => {
    if (filtro === 'pendientes') return !t.completada
    if (filtro === 'completadas') return t.completada
    return true
  })

  const pendientes = tareas.filter((t) => !t.completada).length

  // Vista semanal: 7 días desde hoy
  const diasSemana = []
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const dia = String(d.getDate()).padStart(2, '0')
    const fechaStr = `${y}-${m}-${dia}`
    diasSemana.push({
      fecha: fechaStr,
      diaNombre: d.toLocaleDateString('es', { weekday: 'short' }),
      diaNumero: d.getDate(),
      esHoy: fechaStr === fechaHoy(),
    })
  }

  const tareasPorDia = (fecha) => {
    return tareas.filter((t) => t.fechaLimite === fecha)
  }

  const tareasSinFecha = tareas.filter((t) => !t.fechaLimite && !t.completada)

  return (
    <div className="tareas-page">
      <div className="tareas-header">
        <h2>📋 Mis Tareas</h2>
        <span className="contador">{pendientes} pendientes</span>
      </div>

      <FormularioTarea onAgregar={agregarTarea} />

      {/* Toggle Vista Lista / Semana */}
      <div className="vista-tabs">
        <button
          className={`vista-tab ${vista === 'lista' ? 'activo' : ''}`}
          onClick={() => setVista('lista')}
        >
          📋 Lista
        </button>
        <button
          className={`vista-tab ${vista === 'semana' ? 'activo' : ''}`}
          onClick={() => setVista('semana')}
        >
          📅 Semana
        </button>
      </div>

      {vista === 'lista' && (
        <>
          <div className="filtros">
            <button
              className={filtro === 'todas' ? 'activo' : ''}
              onClick={() => setFiltro('todas')}
            >
              Todas
            </button>
            <button
              className={filtro === 'pendientes' ? 'activo' : ''}
              onClick={() => setFiltro('pendientes')}
            >
              Pendientes
            </button>
            <button
              className={filtro === 'completadas' ? 'activo' : ''}
              onClick={() => setFiltro('completadas')}
            >
              Completadas
            </button>
          </div>

          <div className="lista-tareas">
            {tareasFiltradas.length === 0 ? (
              <p className="vacio">No hay tareas aquí 👀</p>
            ) : (
              tareasFiltradas.map((tarea) => (
                <TareaItem
                  key={tarea.id}
                  tarea={tarea}
                  onToggle={toggleTarea}
                  onEliminar={eliminarTarea}
                />
              ))
            )}
          </div>
        </>
      )}

      {vista === 'semana' && (
        <div className="vista-semanal">
          <div className="dias-grid">
            {diasSemana.map((dia) => {
              const tareasDelDia = tareasPorDia(dia.fecha)
              return (
                <div
                  key={dia.fecha}
                  className={`dia-columna ${dia.esHoy ? 'hoy' : ''}`}
                >
                  <div className="dia-header">
                    <span className="dia-nombre">{dia.diaNombre}</span>
                    <span className="dia-numero">{dia.diaNumero}</span>
                  </div>
                  <div className="dia-tareas">
                    {tareasDelDia.length === 0 ? (
                      <span className="dia-vacio">—</span>
                    ) : (
                      tareasDelDia.map((t) => (
                        <div
                          key={t.id}
                          className={`dia-tarea ${
                            t.completada ? 'completada' : ''
                          }`}
                        >
                          <span
                            className={`dia-tarea-punto prioridad-${t.prioridad}`}
                          />
                          <span className="dia-tarea-titulo">{t.titulo}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {tareasSinFecha.length > 0 && (
            <div className="tareas-sin-fecha">
              <h3 className="tareas-sin-fecha-titulo">📌 Sin fecha</h3>
              <div className="tareas-sin-fecha-lista">
                {tareasSinFecha.map((t) => (
                  <div key={t.id} className="tarea-sin-fecha-item">
                    <span
                      className={`dia-tarea-punto prioridad-${t.prioridad}`}
                    />
                    <span>{t.titulo}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Tareas