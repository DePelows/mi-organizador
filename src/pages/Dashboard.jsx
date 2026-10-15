import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function Dashboard() {
  const {
    tareas,
    pomodoros,
    periodoActivo,
    habitos,
    entreneHoy,
    rachaGym,
    rutinasDeHoy,
    nivelInfo,
    logros,
    rachaApp,
    recordApp,
  } = useApp()

  const navigate = useNavigate()

  const hoy = new Date().toLocaleDateString('es', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const prioridadOrden = { alta: 0, media: 1, baja: 2 }
  const tareasPendientes = tareas
    .filter((t) => !t.completada)
    .sort((a, b) => prioridadOrden[a.prioridad] - prioridadOrden[b.prioridad])

  const tareasCompletadas = tareas.filter((t) => t.completada).length

  const cursosConRacha =
    periodoActivo?.cursos.filter((c) => c.racha > 0) || []

  const habitosConRacha = habitos.filter((h) => h.racha > 0)

  const algoHoy = entreneHoy || pomodoros > 0 || tareasCompletadas > 0

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>🏠 HOY</h2>
        <p className="dashboard-fecha">{hoy}</p>
        <div className="dashboard-nivel-info">
          <span className="dni-nivel">⭐ Nivel {nivelInfo.nivel}</span>
          <span className="dni-xp">
            {nivelInfo.xpTotal} XP · {nivelInfo.xpFaltante} pa' subir
          </span>
        </div>

        {/* 🆕 Racha de la app */}
        {rachaApp > 0 && (
          <div className="dashboard-racha-app">
            <span className="dra-emoji">📱</span>
            <span className="dra-texto">
              <strong>{rachaApp}</strong> días seguidos usando la app
            </span>
            <span className="dra-record">🏆 {recordApp}</span>
          </div>
        )}
      </div>

      <div className="dashboard-grid">
        <div
          className="dash-card dash-card-tareas"
          onClick={() => navigate('/tareas')}
        >
          <div className="dash-icon">📋</div>
          <div className="dash-info">
            <span className="dash-valor">
              {tareasCompletadas}/{tareas.length}
            </span>
            <span className="dash-label">Tareas completadas</span>
          </div>
          {tareasPendientes.length > 0 && (
            <span className="dash-badge">
              {tareasPendientes.length} pendientes
            </span>
          )}
        </div>

        <div
          className="dash-card dash-card-pomodoro"
          onClick={() => navigate('/enfoque')}
        >
          <div className="dash-icon">🍅</div>
          <div className="dash-info">
            <span className="dash-valor">{pomodoros}</span>
            <span className="dash-label">Pomodoros totales</span>
          </div>
        </div>

        <div
          className="dash-card dash-card-gym"
          onClick={() => navigate('/gym')}
        >
          <div className="dash-icon">{entreneHoy ? '✅' : '⏳'}</div>
          <div className="dash-info">
            <span className="dash-valor">
              {entreneHoy
                ? '¡Hecho!'
                : rutinasDeHoy.length > 0
                ? 'Pendiente'
                : 'Libre'}
            </span>
            <span className="dash-label">
              {rutinasDeHoy.length > 0
                ? `${rutinasDeHoy.length} rutina${
                    rutinasDeHoy.length > 1 ? 's' : ''
                  } hoy`
                : 'Sin rutina hoy'}
            </span>
          </div>
        </div>

        <div
          className="dash-card dash-card-cursos"
          onClick={() => navigate('/cursos')}
        >
          <div className="dash-icon">📚</div>
          <div className="dash-info">
            <span className="dash-valor">
              {periodoActivo ? periodoActivo.cursos.length : 0}
            </span>
            <span className="dash-label">
              {periodoActivo
                ? `Cursos en ${periodoActivo.nombre}`
                : 'Sin periodo activo'}
            </span>
          </div>
        </div>
      </div>

      <div className="dashboard-seccion">
        <h3 className="dashboard-titulo">⚡ Acciones rápidas</h3>
        <div className="acciones-grid">
          <button className="accion-btn" onClick={() => navigate('/enfoque')}>
            <span className="accion-icon">⏱️</span>
            <span>Iniciar Pomodoro</span>
          </button>
          <button className="accion-btn" onClick={() => navigate('/cursos')}>
            <span className="accion-icon">📚</span>
            <span>Estudiar un curso</span>
          </button>
          <button className="accion-btn" onClick={() => navigate('/gym')}>
            <span className="accion-icon">💪</span>
            <span>Ir al gym</span>
          </button>
          <button className="accion-btn" onClick={() => navigate('/tareas')}>
            <span className="accion-icon">📋</span>
            <span>Nueva tarea</span>
          </button>
        </div>
      </div>

      {tareasPendientes.length > 0 && (
        <div className="dashboard-seccion">
          <h3 className="dashboard-titulo">📋 Tareas pendientes</h3>
          <div className="dashboard-tareas">
            {tareasPendientes.slice(0, 5).map((t) => (
              <div
                key={t.id}
                className="dash-tarea"
                onClick={() => navigate('/tareas')}
              >
                <span
                  className={`dash-prioridad dash-prioridad-${t.prioridad}`}
                />
                <span className="dash-tarea-titulo">{t.titulo}</span>
              </div>
            ))}
            {tareasPendientes.length > 5 && (
              <button
                className="dash-ver-mas"
                onClick={() => navigate('/tareas')}
              >
                Ver {tareasPendientes.length - 5} más →
              </button>
            )}
          </div>
        </div>
      )}

      {(cursosConRacha.length > 0 ||
        habitosConRacha.length > 0 ||
        rachaGym > 0) && (
        <div className="dashboard-seccion">
          <h3 className="dashboard-titulo">🔥 Rachas activas</h3>
          <div className="rachas-grid">
            {rachaGym > 0 && (
              <div className="racha-item racha-gym">
                <span className="racha-emoji">💪</span>
                <div className="racha-info">
                  <span className="racha-nombre">Gym</span>
                  <span className="racha-dias">{rachaGym} días</span>
                </div>
              </div>
            )}

            {cursosConRacha.map((c) => (
              <div
                key={c.id}
                className="racha-item"
                style={{ '--racha-color': c.color }}
              >
                <span className="racha-emoji">{c.emoji}</span>
                <div className="racha-info">
                  <span className="racha-nombre">{c.nombre}</span>
                  <span className="racha-dias">{c.racha} días</span>
                </div>
              </div>
            ))}

            {habitosConRacha.map((h) => (
              <div key={h.id} className="racha-item racha-habito">
                <span className="racha-emoji">{h.emoji}</span>
                <div className="racha-info">
                  <span className="racha-nombre">{h.nombre}</span>
                  <span className="racha-dias">{h.racha} días</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {logros.filter((l) => l.desbloqueado).length > 0 && (
        <div className="dashboard-seccion">
          <h3 className="dashboard-titulo">🏆 Últimos logros</h3>
          <div className="logros-recientes">
            {logros
              .filter((l) => l.desbloqueado)
              .slice(-4)
              .reverse()
              .map((l) => (
                <div key={l.id} className="logro-reciente">
                  <span className="lr-emoji">{l.emoji}</span>
                  <span className="lr-nombre">{l.nombre}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {!algoHoy &&
        tareasPendientes.length === 0 &&
        cursosConRacha.length === 0 &&
        habitosConRacha.length === 0 && (
          <div className="dashboard-vacio">
            <span className="vacio-emoji">🌅</span>
            <h3>Todo tranquilo por aquí</h3>
            <p>Empieza tu día creando una tarea o estudiando un curso.</p>
          </div>
        )}
    </div>
  )
}

export default Dashboard