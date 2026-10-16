import { useEffect } from 'react'
import { useApp, fechaHoy } from '../context/AppContext'
import {
  notificarRecordatorioHabitos,
  notificarTareasUrgentes,
  tienePermiso,
} from '../utils/notificaciones'

// 🕐 Hook que programa recordatorios automáticos
function useNotificacionesProgramadas() {
  const {
    notificacionesActivas,
    habitos,
    tareas,
    ultimaNotifHabitos,
    setUltimaNotifHabitos,
    ultimaNotifTareas,
    setUltimaNotifTareas,
  } = useApp()

  useEffect(() => {
    if (!notificacionesActivas || !tienePermiso()) return

    const revisar = () => {
      const hoy = fechaHoy()
      const hora = new Date().getHours()

      // 🔥 Recordatorio de hábitos: solo entre 18:00 y 22:00
      if (hora >= 18 && hora <= 22) {
        if (ultimaNotifHabitos !== hoy) {
          const sinMarcar = habitos.filter((h) => !h.fechas.includes(hoy))
          if (sinMarcar.length > 0) {
            notificarRecordatorioHabitos(sinMarcar)
            setUltimaNotifHabitos(hoy)
          }
        }
      }

      // ⚠️ Recordatorio de tareas urgentes: solo entre 9:00 y 12:00
      if (hora >= 9 && hora <= 12) {
        if (ultimaNotifTareas !== hoy) {
          const urgentes = tareas.filter(
            (t) => !t.completada && t.prioridad === 'alta'
          )
          if (urgentes.length > 0) {
            notificarTareasUrgentes(urgentes)
            setUltimaNotifTareas(hoy)
          }
        }
      }
    }

    // Revisar al inicio
    revisar()

    // Revisar cada 30 minutos
    const intervalo = setInterval(revisar, 30 * 60 * 1000)

    return () => clearInterval(intervalo)
  }, [
    notificacionesActivas,
    habitos,
    tareas,
    ultimaNotifHabitos,
    ultimaNotifTareas,
    setUltimaNotifHabitos,
    setUltimaNotifTareas,
  ])
}

export default useNotificacionesProgramadas