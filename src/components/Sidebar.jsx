import { NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { COLORES_DISPONIBLES } from '../utils/colores'
import { useState } from 'react'

const ITEMS_MENU = [
  { ruta: '/', emoji: '🏠', nombre: 'Hoy', end: true },
  { ruta: '/tareas', emoji: '📋', nombre: 'Tareas' },
  { ruta: '/cursos', emoji: '📚', nombre: 'Cursos' },
  { ruta: '/gym', emoji: '💪', nombre: 'Gym' },
  { ruta: '/enfoque', emoji: '⏱️', nombre: 'Enfoque' },
  { ruta: '/habitos', emoji: '🔥', nombre: 'Hábitos' },
  { ruta: '/logros', emoji: '🏆', nombre: 'Logros' },
  { ruta: '/stats', emoji: '📊', nombre: 'Stats' },
  { ruta: '/config', emoji: '⚙️', nombre: 'Config' },
]

function Sidebar({ abierto, onCerrar, colapsado, onToggleColapsar }) {
  const { nivelInfo, rachaApp, tema, toggleTema, colorPrincipal, setColorPrincipal } = useApp()
  const [mostrarColores, setMostrarColores] = useState(false)

  const manejarCerrarSiEsMobile = () => {
    if (window.innerWidth < 900) {
      onCerrar()
    }
  }

  return (
    <>
      {/* Overlay pa' mobile */}
      {abierto && (
        <div className="sidebar-overlay" onClick={onCerrar} />
      )}

      <aside
        className={`sidebar ${abierto ? 'abierto' : ''} ${
          colapsado ? 'colapsado' : ''
        }`}
      >
        {/* Header del sidebar */}
        <div className="sidebar-header">
          {!colapsado && (
            <div className="sidebar-logo">
              <span className="sidebar-logo-emoji">🎯</span>
              <span className="sidebar-logo-texto">Focus</span>
            </div>
          )}

          <button
            className="sidebar-btn-cerrar"
            onClick={() => {
              if (window.innerWidth < 900) {
                onCerrar()
              } else {
                onToggleColapsar()
              }
            }}
            title={colapsado ? 'Expandir' : 'Colapsar'}
          >
            {colapsado ? '☰' : '◀'}
          </button>
        </div>

        {/* Nivel */}
        {!colapsado && (
          <div className="sidebar-nivel">
            <div className="sn-info">
              <span className="sn-nivel">⭐ Nivel {nivelInfo.nivel}</span>
              <span className="sn-xp">
                {nivelInfo.xpEnNivel}/{nivelInfo.xpNecesario}
              </span>
            </div>
            <div className="sn-barra">
              <div
                className="sn-barra-fill"
                style={{ width: `${nivelInfo.progreso}%` }}
              />
            </div>
          </div>
        )}

        {/* Menú principal */}
        <nav className="sidebar-menu">
          {ITEMS_MENU.map((item) => (
            <NavLink
              key={item.ruta}
              to={item.ruta}
              end={item.end}
              className="sidebar-item"
              onClick={manejarCerrarSiEsMobile}
              title={colapsado ? item.nombre : ''}
            >
              <span className="sidebar-item-emoji">{item.emoji}</span>
              {!colapsado && (
                <span className="sidebar-item-texto">{item.nombre}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Separador */}
        <div className="sidebar-sep" />

        {/* Acciones extras */}
        <div className="sidebar-extras">
          {/* Racha de la app */}
          {rachaApp > 0 && !colapsado && (
            <div className="sidebar-racha">
              <span className="sr-emoji">📱</span>
              <span className="sr-texto">
                Racha: <strong>{rachaApp} días</strong>
              </span>
            </div>
          )}

          {/* Toggle tema */}
          <button className="sidebar-btn" onClick={toggleTema}>
            <span className="sidebar-btn-emoji">
              {tema === 'oscuro' ? '☀️' : '🌙'}
            </span>
            {!colapsado && (
              <span className="sidebar-btn-texto">
                {tema === 'oscuro' ? 'Modo claro' : 'Modo oscuro'}
              </span>
            )}
          </button>

          {/* Selector de color */}
          <button
            className="sidebar-btn"
            onClick={() => setMostrarColores((v) => !v)}
          >
            <span className="sidebar-btn-emoji">🎨</span>
            {!colapsado && (
              <span className="sidebar-btn-texto">Color principal</span>
            )}
          </button>

          {mostrarColores && !colapsado && (
            <div className="sidebar-colores">
              {COLORES_DISPONIBLES.map((c) => (
                <button
                  key={c.id}
                  className={`sidebar-color-btn ${
                    colorPrincipal === c.id ? 'activo' : ''
                  }`}
                  onClick={() => setColorPrincipal(c.id)}
                  style={{ background: c.primario }}
                  title={c.nombre}
                >
                  {colorPrincipal === c.id && '✓'}
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

export default Sidebar