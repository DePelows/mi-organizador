import { useEffect, useState } from 'react'
import { proximaFrase } from '../utils/frases'

function ModoEnfoqueTotal({
  minutos,
  segundos,
  corriendo,
  onPausar,
  onReanudar,
  onAbandonar,
  onTerminar,
  modo,
}) {
  const [frase, setFrase] = useState(null)
  const [confirmandoAbandonar, setConfirmandoAbandonar] = useState(false)
  const [aviso, setAviso] = useState('')

  // Elegir frase al abrir
  useEffect(() => {
    setFrase(proximaFrase())
  }, [])

  // ⛔ Aviso temporal
  const lanzarAviso = (texto) => {
    setAviso(texto)
    setTimeout(() => setAviso(''), 2500)
  }

  // 🚫 Bloquear teclas que puedan romper el enfoque
  useEffect(() => {
    const bloquear = (e) => {
      // Esc → aviso
      if (e.key === 'Escape') {
        e.preventDefault()
        lanzarAviso('🚫 Esc no funciona en modo enfoque')
        return
      }
      // F5 → aviso
      if (e.key === 'F5') {
        e.preventDefault()
        lanzarAviso('🚫 No podés recargar en modo enfoque')
        return
      }
      // Ctrl+R / Cmd+R → aviso
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault()
        lanzarAviso('🚫 No podés recargar en modo enfoque')
        return
      }
      // Ctrl+W / Cmd+W → aviso
      if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
        e.preventDefault()
        lanzarAviso('🚫 No podés cerrar la pestaña')
        return
      }
      // Clic derecho
      if (e.type === 'contextmenu') {
        e.preventDefault()
        return
      }
    }

    document.addEventListener('keydown', bloquear)
    document.addEventListener('contextmenu', bloquear)

    return () => {
      document.removeEventListener('keydown', bloquear)
      document.removeEventListener('contextmenu', bloquear)
    }
  }, [])

  // 🖥️ Fullscreen al entrar
  useEffect(() => {
    const entrar = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen()
        }
      } catch (e) {
        console.warn('No se pudo entrar a fullscreen:', e)
      }
    }
    entrar()

    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {})
      }
    }
  }, [])

  // 🎯 Detectar si terminó el timer
  useEffect(() => {
    if (minutos === 0 && segundos === 0 && modo === 'enfoque') {
      onTerminar()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minutos, segundos])

  const formato = `${String(minutos).padStart(2, '0')}:${String(
    segundos
  ).padStart(2, '0')}`

  const manejarAbandonar = () => {
    if (confirmandoAbandonar) {
      onAbandonar()
    } else {
      setConfirmandoAbandonar(true)
      setTimeout(() => setConfirmandoAbandonar(false), 5000)
    }
  }

  // Progreso circular
  const totalSegundos = 25 * 60
  const transcurridos = totalSegundos - (minutos * 60 + segundos)
  const progreso = Math.min(100, (transcurridos / totalSegundos) * 100)

  return (
    <div className="modo-enfoque-total">
      {/* Frase arriba */}
      <div className="met-frase-container">
        {frase && (
          <>
            <p className="met-frase-texto">"{frase.texto}"</p>
            <p className="met-frase-autor">— {frase.autor}</p>
          </>
        )}
      </div>

      {/* Timer en el medio */}
      <div className="met-centro">
        <div className="met-timer-wrapper">
          <svg className="met-progreso-svg" viewBox="0 0 200 200">
            <circle
              className="met-progreso-fondo"
              cx="100"
              cy="100"
              r="90"
              fill="none"
              strokeWidth="6"
            />
            <circle
              className="met-progreso-barra"
              cx="100"
              cy="100"
              r="90"
              fill="none"
              strokeWidth="6"
              strokeDasharray={`${2 * Math.PI * 90}`}
              strokeDashoffset={`${2 * Math.PI * 90 * (1 - progreso / 100)}`}
              transform="rotate(-90 100 100)"
            />
          </svg>
          <div className="met-timer-texto">
            <span className="met-tiempo">{formato}</span>
            <span className="met-label">🔥 CONCÉNTRATE</span>
          </div>
        </div>
      </div>

      {/* Botones abajo */}
      <div className="met-botones">
        {corriendo ? (
          <button className="met-btn met-btn-pausar" onClick={onPausar}>
            ⏸ Pausar
          </button>
        ) : (
          <button className="met-btn met-btn-reanudar" onClick={onReanudar}>
            ▶ Reanudar
          </button>
        )}

        <button
          className={`met-btn met-btn-abandonar ${
            confirmandoAbandonar ? 'confirmando' : ''
          }`}
          onClick={manejarAbandonar}
        >
          {confirmandoAbandonar
            ? "⚠️ Confirmá de nuevo pa' abandonar"
            : '🚪 Abandonar misión'}
        </button>
      </div>

      {/* Aviso temporal */}
      {aviso && <div className="met-aviso">{aviso}</div>}

      {/* Aviso de confirmación */}
      {confirmandoAbandonar && (
        <div className="met-confirmacion">
          Si abandonás ahora, <strong>perdés el pomodoro actual</strong>.
        </div>
      )}
    </div>
  )
}

export default ModoEnfoqueTotal