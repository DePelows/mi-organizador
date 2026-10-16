import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { StatusBar, Style } from '@capacitor/status-bar'
import { AppProvider } from './context/AppContext'
import App from './App.jsx'
import './index.css'

// 🎯 FIX: Quitar sombreado al toque en mobile
document.addEventListener(
  'touchstart',
  function (e) {
    const target = e.target.closest(
      'button, a, [role="button"], .dash-card, .curso-card, .rutina-card, .habito-item, .logro-card, .sidebar-item, .accion-btn, .dash-tarea, .racha-item, .stat-metrica, .record-item'
    )
    if (target) {
      target.blur()
    }
  },
  { passive: true }
)

// 🎯 FIX extra: remover cualquier focus outline raro en mobile
document.addEventListener('focusin', (e) => {
  if (
    e.target.tagName === 'BUTTON' ||
    e.target.tagName === 'A' ||
    e.target.getAttribute('role') === 'button'
  ) {
    e.target.blur()
  }
})

// 🎯 FIX: Configurar StatusBar (barra de hora/batería)
// 🎯 FIX: Configurar StatusBar (barra de hora/batería)
const configurarStatusBar = async () => {
  try {
    await StatusBar.show()
    await StatusBar.setStyle({ style: Style.Dark })
    await StatusBar.setBackgroundColor({ color: '#0f0f14' })
    // 🔑 CLAVE: overlay TRUE para que la app ocupe TODO
    // y podamos controlar el espacio con safe-area-inset
    await StatusBar.setOverlaysWebView({ overlay: true })
  } catch (e) {
    console.log('StatusBar no disponible:', e)
  }
}

configurarStatusBar()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>
)