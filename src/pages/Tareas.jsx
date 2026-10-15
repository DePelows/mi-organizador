import { useState } from 'react'
import { useApp } from '../context/AppContext'
import FormularioTarea from '../components/FormularioTarea'
import TareaItem from '../components/TareaItem'

function Tareas() {
  const { tareas, agregarTarea, toggleTarea, eliminarTarea } = useApp()
  const [filtro, setFiltro] = useState('todas')

  const tareasFiltradas = tareas.filter((t) => {
    if (filtro === 'pendientes') return !t.completada
    if (filtro === 'completadas') return t.completada
    return true
  })

  const pendientes = tareas.filter((t) => !t.completada).length

  return (
    <div className="tareas-page">
      <div className="tareas-header">
        <h2>📋 Mis Tareas</h2>
        <span className="contador">{pendientes} pendientes</span>
      </div>

      <FormularioTarea onAgregar={agregarTarea} />

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
    </div>
  )
}

export default Tareas