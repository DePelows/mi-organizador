import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import ModalPeriodo from '../components/ModalPeriodo'
import ModalCurso from '../components/ModalCurso'
import ModalCerrarPeriodo from '../components/ModalCerrarPeriodo'
import HistorialPeriodos from '../components/HistorialPeriodos'

function Cursos() {
  const { periodoActivo } = useApp()
  const [modalPeriodo, setModalPeriodo] = useState(false)
  const [modalCurso, setModalCurso] = useState(false)
  const [modalCerrar, setModalCerrar] = useState(false)
  const [cursoEditar, setCursoEditar] = useState(null)
  const navigate = useNavigate()

  const estudiar = (cursoId) => {
    navigate(`/enfoque?curso=${cursoId}`)
  }

  const abrirNuevoCurso = () => {
    setCursoEditar(null)
    setModalCurso(true)
  }

  const abrirEditarCurso = (curso) => {
    setCursoEditar(curso)
    setModalCurso(true)
  }

  return (
    <div className="cursos-page">
      {!periodoActivo ? (
        <div className="cursos-vacio">
          <div className="vacio-emoji">📚</div>
          <h2>Aún no tienes un periodo activo</h2>
          <p>Crea tu primer periodo para empezar a organizar tus cursos.</p>
          <button
            className="btn-primario"
            onClick={() => setModalPeriodo(true)}
          >
            + Nuevo periodo
          </button>
        </div>
      ) : (
        <>
          <div className="periodo-header">
            <div>
              <h2>📅 {periodoActivo.nombre}</h2>
              <p className="periodo-info">
                {periodoActivo.cursos.length} cursos
                {periodoActivo.fechaInicio && periodoActivo.fechaFin && (
                  <>
                    {' '}
                    · {periodoActivo.fechaInicio} → {periodoActivo.fechaFin}
                  </>
                )}
              </p>
            </div>
            <div className="periodo-acciones">
              <button
                className="btn-secundario-small"
                onClick={() => setModalCerrar(true)}
              >
                📦 Cerrar periodo
              </button>
              <button className="btn-primario" onClick={abrirNuevoCurso}>
                + Nuevo curso
              </button>
            </div>
          </div>

          {periodoActivo.cursos.length === 0 ? (
            <div className="cursos-vacio">
              <div className="vacio-emoji">📖</div>
              <h3>No tienes cursos todavía</h3>
              <p>Agrega tu primer curso a este periodo.</p>
              <button className="btn-primario" onClick={abrirNuevoCurso}>
                + Agregar curso
              </button>
            </div>
          ) : (
            <div className="lista-cursos">
              {periodoActivo.cursos.map((curso) => (
                <div
                  key={curso.id}
                  className="curso-card"
                  style={{ '--curso-color': curso.color }}
                >
                  <div className="curso-header">
                    <span className="curso-emoji">{curso.emoji}</span>
                    <h3>{curso.nombre}</h3>
                    <button
                      className="btn-editar-small"
                      onClick={() => abrirEditarCurso(curso)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                  </div>
                  <div className="curso-stats">
                    <span>🔥 Racha: {curso.racha} días</span>
                    <span>🍅 {curso.pomodoros} pomodoros</span>
                  </div>
                  <button
                    className="btn-estudiar"
                    onClick={() => estudiar(curso.id)}
                  >
                    ▶ Estudiar
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <HistorialPeriodos />

      <ModalPeriodo
        abierto={modalPeriodo}
        onCerrar={() => setModalPeriodo(false)}
      />

      {periodoActivo && (
        <>
          <ModalCurso
            abierto={modalCurso}
            onCerrar={() => {
              setModalCurso(false)
              setCursoEditar(null)
            }}
            periodoId={periodoActivo.id}
            cursoEditar={cursoEditar}
          />
          <ModalCerrarPeriodo
            abierto={modalCerrar}
            onCerrar={() => setModalCerrar(false)}
            periodo={periodoActivo}
          />
        </>
      )}
    </div>
  )
}

export default Cursos