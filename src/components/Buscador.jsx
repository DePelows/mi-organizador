import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function Buscador() {
  const {
    tareas,
    habitos,
    periodoActivo,
    rutinas,
    periodos,
  } = useApp()

  const [abierto, setAbierto] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()

  // Atajo de teclado: Ctrl+K / Cmd+K
  useEffect(() => {
    const manejar = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setAbierto((a) => !a)
      }
      if (e.key === 'Escape') {
        setAbierto(false)
      }
    }
    window.addEventListener('keydown', manejar)
    return () => window.removeEventListener('keydown', manejar)
  }, [])

  // Auto-focus al abrir
  useEffect(() => {
    if (abierto && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
    if (!abierto) setQuery('')
  }, [abierto])

  // Buscar en todo
  const q = query.toLowerCase().trim()

  const resultados = []

  if (q.length >= 1) {
    // Tareas
    tareas.forEach((t) => {
      if (t.titulo.toLowerCase().includes(q)) {
        resultados.push({
          tipo: 'tarea',
          emoji: '📋',
          titulo: t.titulo,
          subtitulo: `Tarea · ${t.prioridad} ${
            t.completada ? '· ✅ completada' : ''
          }`,
          ruta: '/tareas',
          color: t.completada ? '#10b981' : '#6366f1',
        })
      }
    })

    // Hábitos
    habitos.forEach((h) => {
      if (h.nombre.toLowerCase().includes(q)) {
        resultados.push({
          tipo: 'habito',
          emoji: h.emoji,
          titulo: h.nombre,
          subtitulo: `Hábito · 🔥 ${h.racha} días · 🏆 ${h.record}`,
          ruta: '/habitos',
          color: '#10b981',
        })
      }
    })

    // Cursos
    if (periodoActivo?.cursos) {
      periodoActivo.cursos.forEach((c) => {
        if (c.nombre.toLowerCase().includes(q)) {
          resultados.push({
            tipo: 'curso',
            emoji: c.emoji,
            titulo: c.nombre,
            subtitulo: `Curso · 🍅 ${c.pomodoros} · 🔥 ${c.racha} días`,
            ruta: '/cursos',
            color: c.color,
          })
        }
      })
    }

    // Periodos cerrados
    periodos.forEach((p) => {
      if (
        p.cerrado &&
        p.nombre.toLowerCase().includes(q)
      ) {
        resultados.push({
          tipo: 'periodo',
          emoji: '📦',
          titulo: p.nombre,
          subtitulo: `Periodo cerrado · ${p.cursos.length} cursos`,
          ruta: '/cursos',
          color: '#a0a0b0',
        })
      }
    })

    // Rutinas
    rutinas.forEach((r) => {
      if (r.nombre.toLowerCase().includes(q)) {
        resultados.push({
          tipo: 'rutina',
          emoji: r.emoji,
          titulo: r.nombre,
          subtitulo: `Rutina · ${r.ejercicios.length} ejercicios`,
          ruta: '/gym',
          color: r.color,
        })
      }
    })

    // Ejercicios
    rutinas.forEach((r) => {
      r.ejercicios.forEach((e) => {
        if (e.nombre.toLowerCase().includes(q)) {
          resultados.push({
            tipo: 'ejercicio',
            emoji: '🏋️',
            titulo: e.nombre,
            subtitulo: `Ejercicio en ${r.nombre} · ${e.series}×${e.reps}`,
            ruta: '/gym',
            color: r.color,
          })
        }
      })
    })
  }

  const irA = (ruta) => {
    navigate(ruta)
    setAbierto(false)
  }

  return (
    <>
      <button
        className="btn-buscar"
        onClick={() => setAbierto(true)}
        title="Buscar (Ctrl+K)"
      >
        🔍
        <span className="btn-buscar-hint">Ctrl+K</span>
      </button>

      {abierto && (
        <div className="buscador-overlay" onClick={() => setAbierto(false)}>
          <div
            className="buscador-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="buscador-input-wrapper">
              <span className="buscador-icono">🔍</span>
              <input
                ref={inputRef}
                type="text"
                placeholder="Buscar tareas, hábitos, cursos, rutinas..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="buscador-input"
              />
              <button
                className="buscador-cerrar"
                onClick={() => setAbierto(false)}
              >
                ✕
              </button>
            </div>

            {q.length === 0 && (
              <div className="buscador-vacio">
                <p className="buscador-hint-titulo">
                  💡 Escribí algo para buscar
                </p>
                <p className="buscador-hint">
                  Buscá en tareas, hábitos, cursos, rutinas y ejercicios
                </p>
              </div>
            )}

            {q.length > 0 && resultados.length === 0 && (
              <div className="buscador-vacio">
                <span className="vacio-emoji-small">🤔</span>
                <p>No encontré nada con "{query}"</p>
              </div>
            )}

            {resultados.length > 0 && (
              <div className="buscador-resultados">
                {resultados.slice(0, 20).map((r, i) => (
                  <button
                    key={i}
                    className="buscador-resultado"
                    onClick={() => irA(r.ruta)}
                    style={{ '--res-color': r.color }}
                  >
                    <span className="res-emoji">{r.emoji}</span>
                    <div className="res-info">
                      <span className="res-titulo">{r.titulo}</span>
                      <span className="res-subtitulo">{r.subtitulo}</span>
                    </div>
                    <span className="res-flecha">→</span>
                  </button>
                ))}
                {resultados.length > 20 && (
                  <p className="buscador-mas">
                    + {resultados.length - 20} resultados más...
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Buscador