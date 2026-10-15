import { useState } from 'react'
import { useApp } from '../context/AppContext'
import ModalRutina from '../components/ModalRutina'
import ModalDetalleRutina from '../components/ModalDetalleRutina'

function Gym() {
  const {
    rutinas,
    rutinasDeHoy,
    entrenos,
    entreneHoy,
    rachaGym,
    recordGym,
    registrarEntreno,
    eliminarRutina,
    eliminarEntreno,
  } = useApp()

  const [modalRutina, setModalRutina] = useState(false)
  const [rutinaEditar, setRutinaEditar] = useState(null)
  const [rutinaSeleccionadaId, setRutinaSeleccionadaId] = useState(null)
  const [seccionActiva, setSeccionActiva] = useState('rutinas')

  const rutinaSeleccionada = rutinas.find((r) => r.id === rutinaSeleccionadaId)

  const hoy = new Date().toLocaleDateString('es', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  })

  const manejarCompletar = (rutina) => {
    if (
      confirm(
        `¿Completar el entreno de "${rutina.nombre}"? Se marcará la racha de hoy.`
      )
    ) {
      registrarEntreno(rutina.id, rutina.duracionEstimada)
    }
  }

  const entrenosOrdenados = [...entrenos].sort((a, b) =>
    b.fecha.localeCompare(a.fecha)
  )

  const obtenerRutina = (id) => rutinas.find((r) => r.id === id)

  const formatearFecha = (fecha) => {
    const [y, m, d] = fecha.split('-')
    const date = new Date(Number(y), Number(m) - 1, Number(d))
    return date.toLocaleDateString('es', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    })
  }

  const abrirNuevaRutina = () => {
    setRutinaEditar(null)
    setModalRutina(true)
  }

  return (
    <div className="gym-page">
      <div className="gym-header">
        <div>
          <h2>💪 Mi Gimnasio</h2>
          <p className="gym-fecha">📅 Hoy: {hoy}</p>
        </div>
        <button className="btn-primario" onClick={abrirNuevaRutina}>
          + Nueva rutina
        </button>
      </div>

      <div className="gym-stats-global">
        <div className="gym-stat-item">
          <span className="gs-icon">🔥</span>
          <div>
            <span className="gs-valor">{rachaGym}</span>
            <span className="gs-label">Racha actual</span>
          </div>
        </div>
        <div className="gym-stat-item">
          <span className="gs-icon">🏆</span>
          <div>
            <span className="gs-valor">{recordGym}</span>
            <span className="gs-label">Récord</span>
          </div>
        </div>
        <div className="gym-stat-item">
          <span className="gs-icon">{entreneHoy ? '✅' : '⏳'}</span>
          <div>
            <span className="gs-valor">{entreneHoy ? 'Sí' : 'No'}</span>
            <span className="gs-label">Entrené hoy</span>
          </div>
        </div>
      </div>

      {rutinasDeHoy.length > 0 && (
        <div className="gym-seccion">
          <h3 className="gym-seccion-titulo">⚡ Rutina de hoy</h3>
          {rutinasDeHoy.map((r) => (
            <div
              key={r.id}
              className={`rutina-hoy-card ${entreneHoy ? 'completada' : ''}`}
              style={{ '--rutina-color': r.color }}
            >
              <div className="rh-header">
                <span className="rh-emoji">{r.emoji}</span>
                <div>
                  <h4>{r.nombre}</h4>
                  <p className="rh-duracion">⏱️ {r.duracionEstimada} min</p>
                </div>
              </div>

              {r.ejercicios.length > 0 && (
                <div className="rh-ejercicios">
                  {r.ejercicios.map((e) => (
                    <div key={e.id} className="rh-ejercicio">
                      <span className="rh-ej-nombre">{e.nombre}</span>
                      <span className="rh-ej-detalle">
                        {e.series}×{e.reps}
                        {e.peso && ` · ${e.peso}kg`}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {entreneHoy ? (
                <div className="rh-completado">
                  ✅ ¡Entrenamiento completado hoy!
                </div>
              ) : (
                <button
                  className="rh-btn-completar"
                  onClick={() => manejarCompletar(r)}
                >
                  ✓ Completar entrenamiento
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {rutinasDeHoy.length === 0 && rutinas.length > 0 && (
        <div className="gym-descanso">
          <span className="descanso-emoji">😴</span>
          <h3>Hoy es día de descanso</h3>
          <p>No tienes rutinas programadas para hoy</p>
        </div>
      )}

      <div className="gym-tabs">
        <button
          className={`gym-tab ${seccionActiva === 'rutinas' ? 'activo' : ''}`}
          onClick={() => setSeccionActiva('rutinas')}
        >
          📋 Mis rutinas ({rutinas.length})
        </button>
        <button
          className={`gym-tab ${seccionActiva === 'historial' ? 'activo' : ''}`}
          onClick={() => setSeccionActiva('historial')}
        >
          📜 Historial ({entrenos.length})
        </button>
      </div>

      {seccionActiva === 'rutinas' && (
        <div className="gym-seccion">
          {rutinas.length === 0 ? (
            <div className="cursos-vacio">
              <div className="vacio-emoji">💪</div>
              <h3>No tienes rutinas todavía</h3>
              <p>Crea tu primera rutina con los días que entrenas.</p>
              <button className="btn-primario" onClick={abrirNuevaRutina}>
                + Crear rutina
              </button>
            </div>
          ) : (
            <div className="lista-rutinas">
              {rutinas.map((r) => (
                <div
                  key={r.id}
                  className="rutina-card"
                  style={{ '--rutina-color': r.color }}
                >
                  <div className="rc-header">
                    <span className="rc-emoji">{r.emoji}</span>
                    <h4
                      onClick={() => setRutinaSeleccionadaId(r.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {r.nombre}
                    </h4>
                    <button
                      className="btn-editar-small"
                      onClick={(e) => {
                        e.stopPropagation()
                        setRutinaEditar(r)
                      }}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-eliminar"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm(`¿Eliminar "${r.nombre}"?`)) {
                          eliminarRutina(r.id)
                        }
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                  <div
                    className="rc-dias"
                    onClick={() => setRutinaSeleccionadaId(r.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((letra, i) => {
                      const dia = [
                        'lunes',
                        'martes',
                        'miercoles',
                        'jueves',
                        'viernes',
                        'sabado',
                        'domingo',
                      ][i]
                      const activo = r.dias.includes(dia)
                      return (
                        <span
                          key={dia}
                          className={`rc-dia ${activo ? 'activo' : ''}`}
                        >
                          {letra}
                        </span>
                      )
                    })}
                  </div>
                  <div
                    className="rc-info"
                    onClick={() => setRutinaSeleccionadaId(r.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {r.ejercicios.length}{' '}
                    {r.ejercicios.length === 1 ? 'ejercicio' : 'ejercicios'} · ⏱️{' '}
                    {r.duracionEstimada} min
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {seccionActiva === 'historial' && (
        <div className="gym-seccion">
          {entrenosOrdenados.length === 0 ? (
            <div className="cursos-vacio">
              <div className="vacio-emoji">📜</div>
              <h3>Aún no tienes entrenos registrados</h3>
              <p>Cuando completes tu primer entreno aparecerá aquí.</p>
            </div>
          ) : (
            <div className="lista-entrenos">
              {entrenosOrdenados.map((e) => {
                const rutina = obtenerRutina(e.rutinaId)
                if (!rutina) return null
                return (
                  <div
                    key={e.id}
                    className="entreno-item"
                    style={{ '--rutina-color': rutina.color }}
                  >
                    <div className="entreno-emoji">{rutina.emoji}</div>
                    <div className="entreno-info">
                      <span className="entreno-nombre">{rutina.nombre}</span>
                      <span className="entreno-fecha">
                        {formatearFecha(e.fecha)}
                      </span>
                    </div>
                    <span className="entreno-duracion">
                      ⏱️ {e.duracion} min
                    </span>
                    <button
                      className="btn-eliminar-small"
                      onClick={() => {
                        if (confirm('¿Eliminar este entreno del historial?')) {
                          eliminarEntreno(e.id)
                        }
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      <ModalRutina
        abierto={modalRutina || !!rutinaEditar}
        onCerrar={() => {
          setModalRutina(false)
          setRutinaEditar(null)
        }}
        rutinaEditar={rutinaEditar}
      />

      {rutinaSeleccionada && (
        <ModalDetalleRutina
          rutina={rutinaSeleccionada}
          onCerrar={() => setRutinaSeleccionadaId(null)}
        />
      )}
    </div>
  )
}

export default Gym