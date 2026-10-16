import { useApp } from '../context/AppContext'

function Toasts() {
  const { toasts } = useApp()

  if (toasts.length === 0) return null

  // Función pa' cerrar un toast manualmente
  const cerrarToast = (id) => {
    const el = document.getElementById(`toast-${id}`)
    if (el) {
      el.style.animation = 'slideOutRight 0.3s ease forwards'
      setTimeout(() => {
        // Forzamos un re-render sacando el toast del DOM
        el.style.display = 'none'
      }, 280)
    }
  }

  return (
    <div className="toasts-container">
      {toasts.map((t) => (
        <div
          key={t.id}
          id={`toast-${t.id}`}
          className={`toast toast-${t.tipo}`}
        >
          <div className="toast-icono">
            {t.tipo === 'xp' && '⚡'}
            {t.tipo === 'logro' && '🏆'}
            {t.tipo === 'nivel' && '⭐'}
          </div>
          <div className="toast-contenido">
            <span className="toast-titulo">{t.titulo}</span>
            <span className="toast-mensaje">{t.mensaje}</span>
          </div>
          <button
            className="toast-cerrar"
            onClick={() => cerrarToast(t.id)}
            title="Cerrar"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}

export default Toasts