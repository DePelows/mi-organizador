import { useRef, useState } from 'react'
import { useApp, fechaHoy } from '../context/AppContext'
import { COLORES_DISPONIBLES } from '../utils/colores'
import { ESTILOS_DISPONIBLES } from '../utils/estilos'

function Config() {
  const {
    exportarDatos,
    importarDatos,
    resetearDatos,
    xpTotal,
    nivelInfo,
    tareas,
    habitos,
    periodos,
    rutinas,
    entrenos,
    primerUso,
    sonidosActivos,
    toggleSonidos,
    notificacionesActivas,
    toggleNotificaciones,
    colorPrincipal,
    setColorPrincipal,
    calcularXPRetroactivo,
    reclamarXPRetroactivo,
    estiloVisual,
    setEstiloVisual,
  } = useApp()

  const fileInputRef = useRef(null)
  const [confirmReset, setConfirmReset] = useState(false)

  const manejarImportar = (e) => {
    const archivo = e.target.files[0]
    if (!archivo) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const datos = JSON.parse(event.target.result)
        if (
          confirm(
            '⚠️ Esto va a REEMPLAZAR todos tus datos actuales. ¿Continuar?'
          )
        ) {
          importarDatos(datos)
        }
      } catch {
        alert('❌ El archivo no es válido')
      }
    }
    reader.readAsText(archivo)
    e.target.value = ''
  }

  const manejarReset = () => {
    if (confirmReset) {
      resetearDatos()
      setConfirmReset(false)
    } else {
      setConfirmReset(true)
      setTimeout(() => setConfirmReset(false), 5000)
    }
  }

  const diasUsando = Math.floor(
    (Date.now() - new Date(primerUso).getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="config-page">
      <div className="config-header">
        <h2>⚙️ Configuración</h2>
        <p className="config-subtitulo">Datos, backup y ajustes</p>
      </div>

      {/* Info del usuario */}
      <div className="config-seccion">
        <h3 className="config-seccion-titulo">👤 Tu resumen</h3>
        <div className="config-resumen-grid">
          <div className="config-resumen-item">
            <span className="cri-valor">⭐ {nivelInfo.nivel}</span>
            <span className="cri-label">Nivel</span>
          </div>
          <div className="config-resumen-item">
            <span className="cri-valor">⚡ {xpTotal}</span>
            <span className="cri-label">XP total</span>
          </div>
          <div className="config-resumen-item">
            <span className="cri-valor">📅 {diasUsando}</span>
            <span className="cri-label">Días usando la app</span>
          </div>
        </div>
      </div>

      {/* 🆕 Preferencias */}
      <div className="config-seccion">
        <h3 className="config-seccion-titulo">🎛️ Preferencias</h3>

        <div className="config-preferencia">
          <div className="config-pref-info">
            <span className="config-pref-titulo">🔊 Sonidos</span>
            <span className="config-pref-desc">
              Sonidos al subir de nivel, desbloquear logros y completar
              pomodoros
            </span>
          </div>
          <button
            className={`config-toggle ${sonidosActivos ? 'activo' : ''}`}
            onClick={toggleSonidos}
          >
            <span className="config-toggle-bola" />
          </button>
        </div>

        <div className="config-preferencia">
          <div className="config-pref-info">
            <span className="config-pref-titulo">🔔 Notificaciones</span>
            <span className="config-pref-desc">
              Recordatorios de hábitos, tareas urgentes y fin de pomodoro
            </span>
          </div>
          <button
            className={`config-toggle ${
              notificacionesActivas ? 'activo' : ''
            }`}
            onClick={toggleNotificaciones}
          >
            <span className="config-toggle-bola" />
          </button>
        </div>
      </div>
      
      {/* 🎯 XP Retroactivo */}
      <div className="config-seccion">
        <h3 className="config-seccion-titulo">⚡ XP Retroactivo</h3>
        <p className="config-descripcion">
          Calculá el XP de todo lo que ya hiciste antes de tener el sistema de niveles.
          Solo podés reclamarlo una vez.
        </p>

        <div className="config-xp-preview">
          <div className="config-xp-item">
            <span className="config-xp-label">XP actual</span>
            <span className="config-xp-valor">{xpTotal}</span>
          </div>
          <div className="config-xp-item">
            <span className="config-xp-label">XP pendiente</span>
            <span className="config-xp-valor">
              {Math.max(0, calcularXPRetroactivo() - xpTotal)}
            </span>
          </div>
        </div>

        <button
          className="btn-primario"
          onClick={reclamarXPRetroactivo}
          disabled={calcularXPRetroactivo() <= xpTotal}
          style={{
            opacity: calcularXPRetroactivo() <= xpTotal ? 0.5 : 1,
            cursor: calcularXPRetroactivo() <= xpTotal ? 'not-allowed' : 'pointer',
          }}
        >
          ⚡ Reclamar XP retroactivo
        </button>
      </div>

      <div className="config-preferencia config-preferencia-colores">
        <div className="config-pref-info">
          <span className="config-pref-titulo">🎨 Color principal</span>
          <span className="config-pref-desc">
            Elegí el color de acento de la app
          </span>
        </div>
        <div className="colores-app-grid">
          {COLORES_DISPONIBLES.map((c) => (
            <button
              key={c.id}
              className={`color-app-btn ${
                colorPrincipal === c.id ? 'activo' : ''
              }`}
              onClick={() => setColorPrincipal(c.id)}
              title={c.nombre}
              style={{ background: c.primario }}
            >
              {colorPrincipal === c.id && '✓'}
            </button>
          ))}
        </div>
      </div>
      
      <div className="config-preferencia config-preferencia-colores">
        <div className="config-pref-info">
          <span className="config-pref-titulo">🎭 Estilo visual</span>
          <span className="config-pref-desc">
            Cambiá el look & feel completo de la app
          </span>
        </div>
        <div className="estilos-visuales-grid">
          {ESTILOS_DISPONIBLES.map((e) => (
            <button
              key={e.id}
              className={`estilo-btn ${estiloVisual === e.id ? 'activo' : ''}`}
              onClick={() => setEstiloVisual(e.id)}
            >
              <span className="estilo-emoji">{e.emoji}</span>
              <span className="estilo-nombre">{e.nombre}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Estado de datos */}
      <div className="config-seccion">
        <h3 className="config-seccion-titulo">📊 Tus datos actuales</h3>
        <div className="config-datos-lista">
          <div className="config-dato">
            <span>📋 Tareas</span>
            <span className="config-dato-valor">{tareas.length}</span>
          </div>
          <div className="config-dato">
            <span>🔥 Hábitos</span>
            <span className="config-dato-valor">{habitos.length}</span>
          </div>
          <div className="config-dato">
            <span>📚 Periodos</span>
            <span className="config-dato-valor">{periodos.length}</span>
          </div>
          <div className="config-dato">
            <span>💪 Rutinas</span>
            <span className="config-dato-valor">{rutinas.length}</span>
          </div>
          <div className="config-dato">
            <span>🏋️ Entrenos</span>
            <span className="config-dato-valor">{entrenos.length}</span>
          </div>
        </div>
      </div>

      {/* Backup */}
      <div className="config-seccion">
        <h3 className="config-seccion-titulo">💾 Backup y restauración</h3>
        <p className="config-descripcion">
          Exportá tus datos pa' guardarlos en un lugar seguro. Si cambiás de
          navegador o PC, podés importarlos.
        </p>

        <div className="config-botones">
          <button className="btn-primario" onClick={exportarDatos}>
            💾 Exportar datos
          </button>
          <button
            className="btn-secundario"
            onClick={() => fileInputRef.current.click()}
          >
            📂 Importar datos
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={manejarImportar}
            style={{ display: 'none' }}
          />
        </div>

        <div className="config-aviso">
          ⚠️ <strong>Recomendación:</strong> Hacé un backup una vez por semana.
          Exportá el archivo y guardalo en Google Drive, OneDrive o un
          pendrive.
        </div>
      </div>

      {/* Zona de peligro */}
      <div className="config-seccion config-peligro">
        <h3 className="config-seccion-titulo">🚨 Zona de peligro</h3>
        <p className="config-descripcion">
          Esto borra TODOS tus datos permanentemente. No se puede deshacer.
        </p>
        <button
          className={confirmReset ? 'btn-peligro' : 'btn-secundario'}
          onClick={manejarReset}
        >
          {confirmReset
            ? "⚠️ ¿SEGURO? Clic de nuevo pa' confirmar"
            : '🗑️ Resetear todos los datos'}
        </button>
      </div>

      {/* Info */}
      <div className="config-footer">
        <p>Focus v1.0</p>
        <p>Hecho con ❤️ para uso personal</p>
        <p>Hoy: {fechaHoy()}</p>
      </div>
    </div>
  )
}

export default Config