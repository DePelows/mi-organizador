import { useRef } from 'react'
import { useApp } from '../context/AppContext'

function Logros() {
  const { logros, nivelInfo, xpTotal } = useApp()

  const desbloqueados = logros.filter((l) => l.desbloqueado).length
  const total = logros.length

  // 📤 Compartir un logro como imagen
  const compartirLogro = async (logro) => {
    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 500
    const ctx = canvas.getContext('2d')

    // Fondo con gradiente
    const grad = ctx.createLinearGradient(0, 0, 800, 500)
    grad.addColorStop(0, '#1a1a24')
    grad.addColorStop(1, '#2a2a3a')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 800, 500)

    // Borde superior decorativo
    const grad2 = ctx.createLinearGradient(0, 0, 800, 0)
    grad2.addColorStop(0, '#6366f1')
    grad2.addColorStop(1, '#ec4899')
    ctx.fillStyle = grad2
    ctx.fillRect(0, 0, 800, 6)

    // Emoji grande
    ctx.font = 'bold 120px system-ui'
    ctx.textAlign = 'center'
    ctx.fillText(logro.emoji, 400, 200)

    // Título del logro
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 42px system-ui'
    ctx.fillText(logro.nombre, 400, 280)

    // Descripción
    ctx.fillStyle = '#a0a0b0'
    ctx.font = '20px system-ui'
    ctx.fillText(logro.descripcion, 400, 320)

    // Badge "Desbloqueado"
    ctx.fillStyle = '#fbbf24'
    ctx.font = 'bold 18px system-ui'
    ctx.fillText('✅ LOGRO DESBLOQUEADO', 400, 370)

    // Nivel y XP
    ctx.fillStyle = '#a78bfa'
    ctx.font = 'bold 16px system-ui'
    ctx.fillText(`⭐ Nivel ${nivelInfo.nivel} · ⚡ ${xpTotal} XP`, 400, 410)

    // Footer
    ctx.fillStyle = '#666'
    ctx.font = '14px system-ui'
    ctx.fillText('Mi Organizador Pro 🚀', 400, 470)

    // Descarga
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `logro-${logro.id}.png`
    a.click()
  }

  return (
    <div className="logros-page">
      <div className="logros-header">
        <div>
          <h2>🏆 Mis Logros</h2>
          <p className="logros-subtitulo">
            {desbloqueados} de {total} desbloqueados
          </p>
        </div>
        <div className="logros-xp-badge">
          <span className="lxb-icono">⚡</span>
          <div>
            <span className="lxb-valor">{xpTotal} XP</span>
            <span className="lxb-label">Nivel {nivelInfo.nivel}</span>
          </div>
        </div>
      </div>

      <div className="logros-barra-global">
        <div
          className="logros-barra-fill"
          style={{ width: `${(desbloqueados / total) * 100}%` }}
        />
      </div>

      <div className="logros-grid">
        {logros.map((logro) => (
          <div
            key={logro.id}
            className={`logro-card ${
              logro.desbloqueado ? 'desbloqueado' : 'bloqueado'
            }`}
          >
            <div className="logro-emoji">
              {logro.desbloqueado ? logro.emoji : '🔒'}
            </div>
            <h3 className="logro-nombre">{logro.nombre}</h3>
            <p className="logro-descripcion">{logro.descripcion}</p>

            {!logro.desbloqueado && (
              <div className="logro-progreso-container">
                <div className="logro-progreso-barra">
                  <div
                    className="logro-progreso-fill"
                    style={{ width: `${logro.porcentaje}%` }}
                  />
                </div>
                <span className="logro-progreso-texto">
                  {logro.progresoActual} / {logro.meta}
                </span>
              </div>
            )}

            {logro.desbloqueado && (
              <div className="logro-acciones">
                <div className="logro-desbloqueado-badge">
                  ✅ Desbloqueado
                </div>
                <button
                  className="btn-compartir-logro"
                  onClick={() => compartirLogro(logro)}
                  title="Descargar imagen"
                >
                  📤
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Logros