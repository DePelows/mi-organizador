import { useApp } from '../context/AppContext'

function Toasts() {
  const { toasts } = useApp()

  if (toasts.length === 0) return null

  return (
    <div className="toasts-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.tipo}`}>
          <div className="toast-icono">
            {t.tipo === 'xp' && '⚡'}
            {t.tipo === 'logro' && '🏆'}
            {t.tipo === 'nivel' && '⭐'}
          </div>
          <div className="toast-contenido">
            <span className="toast-titulo">{t.titulo}</span>
            <span className="toast-mensaje">{t.mensaje}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Toasts