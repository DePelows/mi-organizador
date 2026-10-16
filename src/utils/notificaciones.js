// 🔔 Sistema de notificaciones del navegador

export async function pedirPermisoNotificaciones() {
  if (!('Notification' in window)) {
    console.warn('Este navegador no soporta notificaciones')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission === 'denied') {
    return false
  }

  // Pedir permiso
  const permiso = await Notification.requestPermission()
  return permiso === 'granted'
}

export function tienePermiso() {
  return 'Notification' in window && Notification.permission === 'granted'
}

export function enviarNotificacion(titulo, opciones = {}) {
  if (!tienePermiso()) return null

  const notif = new Notification(titulo, {
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    ...opciones,
  })

  // Auto-cerrar en 8 segundos
  setTimeout(() => notif.close(), 8000)

  return notif
}

// 🍅 Notificación de pomodoro terminado
export function notificarPomodoroTerminado(modo) {
  const esEnfoque = modo === 'enfoque'
  enviarNotificacion(
    esEnfoque ? '🍅 ¡Pomodoro completado!' : '☕ ¡Descanso terminado!',
    {
      body: esEnfoque
        ? 'Tomate un descanso de 5 minutos. ¡Te lo ganaste!'
        : 'Volvamos al enfoque. ¡Arrancá otro pomodoro!',
      tag: 'pomodoro',
      requireInteraction: true,
    }
  )
}

// 🔥 Recordatorio de hábitos
export function notificarRecordatorioHabitos(habitosSinMarcar) {
  if (habitosSinMarcar.length === 0) return

  const texto =
    habitosSinMarcar.length === 1
      ? `Te falta marcar: ${habitosSinMarcar[0].nombre}`
      : `Te faltan marcar ${habitosSinMarcar.length} hábitos hoy`

  enviarNotificacion('🔥 ¡No rompas la racha!', {
    body: texto,
    tag: 'habitos',
  })
}

// ⚠️ Recordatorio de tareas urgentes
export function notificarTareasUrgentes(tareas) {
  if (tareas.length === 0) return

  const texto =
    tareas.length === 1
      ? `Tienes 1 tarea urgente: ${tareas[0].titulo}`
      : `Tienes ${tareas.length} tareas urgentes pendientes`

  enviarNotificacion('⚠️ Tareas urgentes', {
    body: texto,
    tag: 'tareas',
  })
}