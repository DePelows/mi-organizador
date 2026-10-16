// 🔔 Sistema de notificaciones (Android + Web)

import { LocalNotifications } from '@capacitor/local-notifications'
import { Capacitor } from '@capacitor/core'

// 🎯 Detecta si estamos en Android (APK) o en Web
const esNativo = Capacitor.isNativePlatform()

// 🔔 Pedir permiso (funciona en Android y Web)
export async function pedirPermisoNotificaciones() {
  try {
    if (esNativo) {
      // 📱 Android nativo → usar plugin de Capacitor
      const permiso = await LocalNotifications.requestPermissions()
      return permiso.display === 'granted'
    } else {
      // 🌐 Web → usar API del navegador
      if (!('Notification' in window)) {
        console.warn('Este navegador no soporta notificaciones')
        return false
      }

      if (Notification.permission === 'granted') return true
      if (Notification.permission === 'denied') return false

      const permiso = await Notification.requestPermission()
      return permiso === 'granted'
    }
  } catch (e) {
    console.error('Error pidiendo permiso:', e)
    return false
  }
}

// 🔍 Verificar si hay permiso
export async function tienePermiso() {
  try {
    if (esNativo) {
      const permiso = await LocalNotifications.checkPermissions()
      return permiso.display === 'granted'
    } else {
      return 'Notification' in window && Notification.permission === 'granted'
    }
  } catch (e) {
    return false
  }
}

// 📩 Enviar notificación
export async function enviarNotificacion(titulo, opciones = {}) {
  try {
    const permiso = await tienePermiso()
    if (!permiso) return null

    if (esNativo) {
      // 📱 Android nativo
      await LocalNotifications.schedule({
        notifications: [
          {
            id: Math.floor(Math.random() * 100000),
            title: titulo,
            body: opciones.body || '',
            schedule: { at: new Date(Date.now() + 100) },
            sound: null,
            attachments: null,
            actionTypeId: '',
            extra: null,
          },
        ],
      })
    } else {
      // 🌐 Web
      const notif = new Notification(titulo, {
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        ...opciones,
      })
      setTimeout(() => notif.close(), 8000)
    }
    return true
  } catch (e) {
    console.error('Error enviando notificación:', e)
    return null
  }
}

// 🍅 Notificación de pomodoro terminado
export async function notificarPomodoroTerminado(modo) {
  const esEnfoque = modo === 'enfoque'
  await enviarNotificacion(
    esEnfoque ? '🍅 ¡Pomodoro completado!' : '☕ ¡Descanso terminado!',
    {
      body: esEnfoque
        ? 'Tomate un descanso de 5 minutos. ¡Te lo ganaste!'
        : 'Volvamos al enfoque. ¡Arrancá otro pomodoro!',
      tag: 'pomodoro',
    }
  )
}

// 🔥 Recordatorio de hábitos
export async function notificarRecordatorioHabitos(habitosSinMarcar) {
  if (habitosSinMarcar.length === 0) return

  const texto =
    habitosSinMarcar.length === 1
      ? `Te falta marcar: ${habitosSinMarcar[0].nombre}`
      : `Te faltan marcar ${habitosSinMarcar.length} hábitos hoy`

  await enviarNotificacion('🔥 ¡No rompas la racha!', {
    body: texto,
    tag: 'habitos',
  })
}

// ⚠️ Recordatorio de tareas urgentes
export async function notificarTareasUrgentes(tareas) {
  if (tareas.length === 0) return

  const texto =
    tareas.length === 1
      ? `Tienes 1 tarea urgente: ${tareas[0].titulo}`
      : `Tienes ${tareas.length} tareas urgentes pendientes`

  await enviarNotificacion('⚠️ Tareas urgentes', {
    body: texto,
    tag: 'tareas',
  })
}