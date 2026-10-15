import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import usePomodoro from '../hooks/usePomodoro'

const ETIQUETAS_RAPIDAS = [
  { emoji: '📚', nombre: 'Estudio' },
  { emoji: '💻', nombre: 'Trabajo' },
  { emoji: '🎨', nombre: 'Proyecto' },
  { emoji: '📖', nombre: 'Lectura' },
  { emoji: '🧠', nombre: 'Aprendizaje' },
  { emoji: '✍️', nombre: 'Escritura' },
]

function Enfoque() {
  const {
    pomodoros,
    sumarPomodoro,
    periodoActivo,
    registrarPomodoroCurso,
    etiquetasPomodoro,
  } = useApp()

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const cursoId = searchParams.get('curso')
  const cursoIdNum = cursoId ? Number(cursoId) : null

  const cursoSeleccionado =
    cursoIdNum && periodoActivo
      ? periodoActivo.cursos.find((c) => c.id === cursoIdNum)
      : null

  // Etiqueta actual del pomodoro libre
  const [etiqueta, setEtiqueta] = useState('')
  const [mostrarEtiquetas, setMostrarEtiquetas] = useState(false)

  const {
    modo,
    minutos,
    segundos,
    corriendo,
    iniciar,
    pausar,
    reiniciar,
    cambiarModo,
  } = usePomodoro({
    minutosEnfoque: 25,
    minutosDescanso: 5,
    onCompletar: (modoQueTermino) => {
      if (modoQueTermino === 'enfoque') {
        // Si hay curso → lo suma al curso
        if (cursoSeleccionado && periodoActivo) {
          registrarPomodoroCurso(periodoActivo.id, cursoSeleccionado.id, 25)
          sumarPomodoro() // también suma al total
        } else {
          // Pomodoro libre → usa la etiqueta
          sumarPomodoro(etiqueta || '')
        }
      }
    },
  })

  const formato = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`

  const quitarCurso = () => navigate('/enfoque')

  const seleccionarEtiqueta = (nombre) => {
    setEtiqueta(nombre)
    setMostrarEtiquetas(false)
  }

  // Pomodoros por etiqueta
  const pomodorosPorEtiqueta = {}
  etiquetasPomodoro.forEach((p) => {
    const k = p.etiqueta || 'Sin etiqueta'
    pomodorosPorEtiqueta[k] = (pomodorosPorEtiqueta[k] || 0) + 1
  })

  return (
    <div className="enfoque-page">
      <h2>⏱️ Modo Enfoque</h2>

      {cursoSeleccionado ? (
        <div
          className="curso-seleccionado"
          style={{ '--curso-color': cursoSeleccionado.color }}
        >
          <span className="cs-emoji">{cursoSeleccionado.emoji}</span>
          <div className="cs-info">
            <span className="cs-label">Estudiando:</span>
            <span className="cs-nombre">{cursoSeleccionado.nombre}</span>
          </div>
          <button className="cs-quitar" onClick={quitarCurso}>
            ✕
          </button>
        </div>
      ) : (
        <div className="etiqueta-pomodoro">
          {etiqueta ? (
            <div className="etiqueta-seleccionada">
              <span className="etq-label">🏷️ Etiqueta:</span>
              <span className="etq-nombre">{etiqueta}</span>
              <button
                className="etq-quitar"
                onClick={() => setEtiqueta('')}
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              className="btn-agregar-etiqueta"
              onClick={() => setMostrarEtiquetas((v) => !v)}
            >
              🏷️ {mostrarEtiquetas ? 'Cerrar' : 'Agregar etiqueta'}
            </button>
          )}

          {mostrarEtiquetas && !etiqueta && (
            <div className="etiquetas-rapidas">
              {ETIQUETAS_RAPIDAS.map((e) => (
                <button
                  key={e.nombre}
                  className="etiqueta-chip"
                  onClick={() => seleccionarEtiqueta(e.nombre)}
                >
                  {e.emoji} {e.nombre}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="modos">
        <button
          className={modo === 'enfoque' ? 'activo' : ''}
          onClick={() => cambiarModo('enfoque')}
        >
          Enfoque (25 min)
        </button>
        <button
          className={modo === 'descanso' ? 'activo' : ''}
          onClick={() => cambiarModo('descanso')}
        >
          Descanso (5 min)
        </button>
      </div>

      <div className={`timer ${modo}`}>
        <span className="tiempo">{formato}</span>
        <span className="modo-label">
          {modo === 'enfoque' ? '🔥 Concéntrate' : '☕ Descansa'}
        </span>
      </div>

      <div className="botones-timer">
        {corriendo ? (
          <button className="btn-pausar" onClick={pausar}>
            ⏸ Pausar
          </button>
        ) : (
          <button className="btn-iniciar" onClick={iniciar}>
            ▶ Iniciar
          </button>
        )}
        <button className="btn-reiniciar" onClick={reiniciar}>
          🔄 Reiniciar
        </button>
      </div>

      <div className="contador-pomodoros">
        <span className="pomodoro-numero">🍅 {pomodoros}</span>
        <span>pomodoros completados en total</span>
      </div>

      {/* Resumen por etiqueta */}
      {Object.keys(pomodorosPorEtiqueta).length > 0 && (
        <div className="etiquetas-resumen">
          <h3 className="etiquetas-resumen-titulo">🏷️ Por etiqueta</h3>
          <div className="etiquetas-lista">
            {Object.entries(pomodorosPorEtiqueta)
              .sort((a, b) => b[1] - a[1])
              .map(([nombre, cantidad]) => (
                <div key={nombre} className="etiqueta-stat">
                  <span className="etq-stat-nombre">{nombre}</span>
                  <span className="etq-stat-cantidad">{cantidad} 🍅</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Enfoque