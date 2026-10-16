import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { sonidoLogro, sonidoSubirNivel } from '../utils/sonidos'
import { lanzarConfetiLogro, lanzarConfetiNivel } from '../utils/confeti'
import {
  pedirPermisoNotificaciones,
  notificarPomodoroTerminado,
  tienePermiso,
} from '../utils/notificaciones'

const AppContext = createContext()

// 🔧 Fecha de hoy en formato "2026-10-15"
export function fechaHoy() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dia}`
}

// 🔧 Calcula racha actual desde un array de fechas
function calcularRacha(fechas) {
  if (fechas.length === 0) return 0
  const setFechas = new Set(fechas)
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  let cursor = new Date(hoy)
  const fechaHoyStr = fechaHoy()
  if (!setFechas.has(fechaHoyStr)) {
    cursor.setDate(cursor.getDate() - 1)
  }

  let racha = 0
  while (true) {
    const y = cursor.getFullYear()
    const m = String(cursor.getMonth() + 1).padStart(2, '0')
    const dia = String(cursor.getDate()).padStart(2, '0')
    const fechaStr = `${y}-${m}-${dia}`
    if (!setFechas.has(fechaStr)) break
    racha++
    cursor.setDate(cursor.getDate() - 1)
  }
  return racha
}

// 🎯 SISTEMA DE NIVELES
function xpParaNivel(nivel) {
  if (nivel <= 1) return 0
  return Math.floor(50 * (nivel - 1) * nivel)
}

function calcularNivel(xpTotal) {
  let nivel = 1
  while (xpParaNivel(nivel + 1) <= xpTotal) {
    nivel++
  }
  const xpNivelActual = xpParaNivel(nivel)
  const xpSiguienteNivel = xpParaNivel(nivel + 1)
  const xpEnNivel = xpTotal - xpNivelActual
  const xpNecesario = xpSiguienteNivel - xpNivelActual
  const progreso = Math.min(100, Math.round((xpEnNivel / xpNecesario) * 100))

  return {
    nivel,
    xpTotal,
    xpEnNivel,
    xpNecesario,
    xpFaltante: xpNecesario - xpEnNivel,
    progreso,
  }
}

// 🏆 DEFINICIÓN DE LOGROS
const LOGROS_DEFINICION = [
  {
    id: 'primera_tarea',
    nombre: 'Primer paso',
    descripcion: 'Completa tu primera tarea',
    emoji: '✅',
    verificar: (data) => data.tareas.filter((t) => t.completada).length >= 1,
    progreso: (data) =>
      Math.min(1, data.tareas.filter((t) => t.completada).length),
    meta: 1,
  },
  {
    id: 'primer_pomodoro',
    nombre: 'Concentrado',
    descripcion: 'Completa tu primer pomodoro',
    emoji: '🍅',
    verificar: (data) => data.pomodoros >= 1,
    progreso: (data) => Math.min(1, data.pomodoros),
    meta: 1,
  },
  {
    id: 'primer_entreno',
    nombre: 'A darle',
    descripcion: 'Completa tu primer entrenamiento',
    emoji: '💪',
    verificar: (data) => data.entrenos.length >= 1,
    progreso: (data) => Math.min(1, data.entrenos.length),
    meta: 1,
  },
  {
    id: 'productivo_10',
    nombre: 'Productivo',
    descripcion: 'Completa 10 tareas',
    emoji: '🚀',
    verificar: (data) => data.tareas.filter((t) => t.completada).length >= 10,
    progreso: (data) =>
      Math.min(10, data.tareas.filter((t) => t.completada).length),
    meta: 10,
  },
  {
    id: 'productivo_50',
    nombre: 'Imparable',
    descripcion: 'Completa 50 tareas',
    emoji: '⚡',
    verificar: (data) => data.tareas.filter((t) => t.completada).length >= 50,
    progreso: (data) =>
      Math.min(50, data.tareas.filter((t) => t.completada).length),
    meta: 50,
  },
  {
    id: 'pomodoros_10',
    nombre: 'Enfocado',
    descripcion: 'Completa 10 pomodoros',
    emoji: '🎯',
    verificar: (data) => data.pomodoros >= 10,
    progreso: (data) => Math.min(10, data.pomodoros),
    meta: 10,
  },
  {
    id: 'pomodoros_50',
    nombre: 'Máquina de foco',
    descripcion: 'Completa 50 pomodoros',
    emoji: '🧠',
    verificar: (data) => data.pomodoros >= 50,
    progreso: (data) => Math.min(50, data.pomodoros),
    meta: 50,
  },
  {
    id: 'entrenos_10',
    nombre: 'Constante',
    descripcion: 'Completa 10 entrenamientos',
    emoji: '🏋️',
    verificar: (data) => data.entrenos.length >= 10,
    progreso: (data) => Math.min(10, data.entrenos.length),
    meta: 10,
  },
  {
    id: 'entrenos_30',
    nombre: 'Bestia',
    descripcion: 'Completa 30 entrenamientos',
    emoji: '🦁',
    verificar: (data) => data.entrenos.length >= 30,
    progreso: (data) => Math.min(30, data.entrenos.length),
    meta: 30,
  },
  {
    id: 'racha_gym_7',
    nombre: 'Semana de hierro',
    descripcion: '7 días seguidos de gym',
    emoji: '🔥',
    verificar: (data) => data.rachaGym >= 7,
    progreso: (data) => Math.min(7, data.rachaGym),
    meta: 7,
  },
  {
    id: 'racha_gym_30',
    nombre: 'Mes de acero',
    descripcion: '30 días seguidos de gym',
    emoji: '💎',
    verificar: (data) => data.rachaGym >= 30,
    progreso: (data) => Math.min(30, data.rachaGym),
    meta: 30,
  },
  {
    id: 'racha_app_7',
    nombre: 'Usuario fiel',
    descripcion: '7 días seguidos usando la app',
    emoji: '📱',
    verificar: (data) => data.rachaApp >= 7,
    progreso: (data) => Math.min(7, data.rachaApp),
    meta: 7,
  },
  {
    id: 'nivel_5',
    nombre: 'Veterano',
    descripcion: 'Alcanza el nivel 5',
    emoji: '⭐',
    verificar: (data) => data.nivelInfo.nivel >= 5,
    progreso: (data) => Math.min(5, data.nivelInfo.nivel),
    meta: 5,
  },
  {
    id: 'nivel_10',
    nombre: 'Leyenda',
    descripcion: 'Alcanza el nivel 10',
    emoji: '👑',
    verificar: (data) => data.nivelInfo.nivel >= 10,
    progreso: (data) => Math.min(10, data.nivelInfo.nivel),
    meta: 10,
  },
]

export function AppProvider({ children }) {
  const [tareas, setTareas] = useLocalStorage('tareas', [])
  const [pomodoros, setPomodoros] = useLocalStorage('pomodoros', 0)
  const [etiquetasPomodoro, setEtiquetasPomodoro] = useLocalStorage(
    'etiquetasPomodoro',
    []
  )
  const [habitos, setHabitos] = useLocalStorage('habitos', [])
  const [periodos, setPeriodos] = useLocalStorage('periodos', [])
  const [periodoActivoId, setPeriodoActivoId] = useLocalStorage(
    'periodoActivoId',
    null
  )
  const [rutinas, setRutinas] = useLocalStorage('rutinas', [])
  const [entrenos, setEntrenos] = useLocalStorage('entrenos', [])
  const [xpTotal, setXpTotal] = useLocalStorage('xpTotal', 0)
  const [logrosDesbloqueados, setLogrosDesbloqueados] = useLocalStorage(
    'logrosDesbloqueados',
    []
  )
  const [primerUso, setPrimerUso] = useLocalStorage(
    'primerUso',
    new Date().toISOString()
  )
  const [diasUso, setDiasUso] = useLocalStorage('diasUso', [])
  const [tema, setTema] = useLocalStorage('tema', 'oscuro')
  const [colorPrincipal, setColorPrincipal] = useLocalStorage(
  'colorPrincipal',
  'morado'
  )
  const [sonidosActivos, setSonidosActivos] = useLocalStorage(
    'sonidosActivos',
    true
  )
  const [notificacionesActivas, setNotificacionesActivas] = useLocalStorage(
    'notificacionesActivas',
    false
  )
  const [ultimaNotifHabitos, setUltimaNotifHabitos] = useLocalStorage(
    'ultimaNotifHabitos',
    null
  )
  const [ultimaNotifTareas, setUltimaNotifTareas] = useLocalStorage(
    'ultimaNotifTareas',
    null
  )

  const [toasts, setToasts] = useState([])
  const nivelAnteriorRef = useRef(null)

  const DIAS_SEMANA = [
    'lunes',
    'martes',
    'miercoles',
    'jueves',
    'viernes',
    'sabado',
    'domingo',
  ]

  // 🔔 Agregar toast a la cola
  const agregarToast = (toast) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { ...toast, id }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  // 🎁 Dar XP (silencioso)
  const darXP = (cantidad) => {
    setXpTotal((prev) => prev + cantidad)
  }

  // === TAREAS ===
  const agregarTarea = (nuevaTarea) =>
    setTareas([...tareas, { ...nuevaTarea, subtareas: [] }])

  const toggleTarea = (id) => {
    const tarea = tareas.find((t) => t.id === id)
    const seCompleta = tarea && !tarea.completada

    setTareas(
      tareas.map((t) =>
        t.id === id
          ? {
              ...t,
              completada: !t.completada,
              completadaEn: !t.completada
                ? new Date().toISOString()
                : null,
            }
          : t
      )
    )

    if (seCompleta) {
      const xp =
        tarea.prioridad === 'alta'
          ? 20
          : tarea.prioridad === 'media'
          ? 15
          : 10
      darXP(xp)
    }
  }

  const eliminarTarea = (id) => setTareas(tareas.filter((t) => t.id !== id))

  const editarTarea = (id, cambios) => {
    setTareas(tareas.map((t) => (t.id === id ? { ...t, ...cambios } : t)))
  }

  // Subtareas
  const agregarSubtarea = (tareaId, texto) => {
    setTareas(
      tareas.map((t) =>
        t.id === tareaId
          ? {
              ...t,
              subtareas: [
                ...(t.subtareas || []),
                { id: Date.now(), texto, completada: false },
              ],
            }
          : t
      )
    )
  }

  const toggleSubtarea = (tareaId, subtareaId) => {
    setTareas(
      tareas.map((t) =>
        t.id === tareaId
          ? {
              ...t,
              subtareas: (t.subtareas || []).map((s) =>
                s.id === subtareaId ? { ...s, completada: !s.completada } : s
              ),
            }
          : t
      )
    )
  }

  const eliminarSubtarea = (tareaId, subtareaId) => {
    setTareas(
      tareas.map((t) =>
        t.id === tareaId
          ? {
              ...t,
              subtareas: (t.subtareas || []).filter(
                (s) => s.id !== subtareaId
              ),
            }
          : t
      )
    )
  }

  // === POMODORO ===
  const sumarPomodoro = (etiqueta = '') => {
    setPomodoros((p) => p + 1)
    if (etiqueta) {
      setEtiquetasPomodoro([
        ...etiquetasPomodoro,
        { id: Date.now(), etiqueta, fecha: fechaHoy() },
      ])
    }
    darXP(25)
  }

  // 🔔 Notificar pomodoro terminado
  const notificarPomodoro = (modo) => {
    if (notificacionesActivas && tienePermiso()) {
      notificarPomodoroTerminado(modo)
    }
  }

  // === HÁBITOS ===
  const agregarHabito = (nombre, emoji) => {
    setHabitos([...habitos, { id: Date.now(), nombre, emoji, fechas: [] }])
  }
  const eliminarHabito = (id) =>
    setHabitos(habitos.filter((h) => h.id !== id))

  const editarHabito = (id, cambios) => {
    setHabitos(habitos.map((h) => (h.id === id ? { ...h, ...cambios } : h)))
  }

  const toggleDiaHabito = (id) => {
    const hoy = fechaHoy()
    const habito = habitos.find((h) => h.id === id)
    const seMarca = habito && !habito.fechas.includes(hoy)

    setHabitos(
      habitos.map((h) => {
        if (h.id !== id) return h
        const yaEsta = h.fechas.includes(hoy)
        return {
          ...h,
          fechas: yaEsta
            ? h.fechas.filter((f) => f !== hoy)
            : [...h.fechas, hoy],
        }
      })
    )

    if (seMarca) {
      darXP(15)
    }
  }

  const habitosConStats = habitos.map((h) => ({
    ...h,
    racha: calcularRacha(h.fechas),
    record: h.fechas.length,
  }))

  // === PERIODOS ===
  const crearPeriodo = (nombre, fechaInicio = '', fechaFin = '') => {
    const nuevo = {
      id: Date.now(),
      nombre,
      fechaInicio,
      fechaFin,
      cursos: [],
      creadoEn: new Date().toISOString(),
      cerrado: false,
    }
    setPeriodos([...periodos, nuevo])
    setPeriodoActivoId(nuevo.id)
    return nuevo
  }

  const eliminarPeriodo = (id) => {
    setPeriodos(periodos.filter((p) => p.id !== id))
    if (periodoActivoId === id) setPeriodoActivoId(null)
  }

  const cerrarPeriodo = (id) => {
    const ahora = new Date().toISOString()
    setPeriodos(
      periodos.map((p) =>
        p.id === id ? { ...p, cerrado: true, cerradoEn: ahora } : p
      )
    )
    if (periodoActivoId === id) setPeriodoActivoId(null)
  }

  const reactivarPeriodo = (id) => {
    setPeriodos(
      periodos.map((p) =>
        p.id === id ? { ...p, cerrado: false, cerradoEn: null } : p
      )
    )
    setPeriodoActivoId(id)
  }

  // === CURSOS ===
  const agregarCurso = (periodoId, nombre, emoji, color) => {
    setPeriodos(
      periodos.map((p) => {
        if (p.id !== periodoId) return p
        return {
          ...p,
          cursos: [
            ...p.cursos,
            {
              id: Date.now(),
              nombre,
              emoji,
              color: color || '#6366f1',
              pomodoros: 0,
              minutosTotales: 0,
              fechas: [],
            },
          ],
        }
      })
    )
  }

  const eliminarCurso = (periodoId, cursoId) => {
    setPeriodos(
      periodos.map((p) => {
        if (p.id !== periodoId) return p
        return { ...p, cursos: p.cursos.filter((c) => c.id !== cursoId) }
      })
    )
  }

  const editarCurso = (periodoId, cursoId, cambios) => {
    setPeriodos(
      periodos.map((p) => {
        if (p.id !== periodoId) return p
        return {
          ...p,
          cursos: p.cursos.map((c) =>
            c.id === cursoId ? { ...c, ...cambios } : c
          ),
        }
      })
    )
  }

  const registrarPomodoroCurso = (periodoId, cursoId, minutos = 25) => {
    const hoy = fechaHoy()
    setPeriodos(
      periodos.map((p) => {
        if (p.id !== periodoId) return p
        return {
          ...p,
          cursos: p.cursos.map((c) => {
            if (c.id !== cursoId) return c
            const yaEstaHoy = c.fechas.includes(hoy)
            return {
              ...c,
              pomodoros: c.pomodoros + 1,
              minutosTotales: c.minutosTotales + minutos,
              fechas: yaEstaHoy ? c.fechas : [...c.fechas, hoy],
            }
          }),
        }
      })
    )
  }

  const periodoActivo =
    periodos.find((p) => p.id === periodoActivoId && !p.cerrado) || null
  const periodoActivoConStats = periodoActivo
    ? {
        ...periodoActivo,
        cursos: periodoActivo.cursos.map((c) => ({
          ...c,
          racha: calcularRacha(c.fechas),
          record: c.fechas.length,
        })),
      }
    : null

  const periodosCerrados = periodos.filter((p) => p.cerrado)

  // === GYM ===
  const agregarRutina = (nombre, emoji, color, dias, duracionEstimada) => {
    setRutinas([
      ...rutinas,
      {
        id: Date.now(),
        nombre,
        emoji: emoji || '💪',
        color: color || '#ef4444',
        dias,
        duracionEstimada: duracionEstimada || 45,
        ejercicios: [],
      },
    ])
  }

  const eliminarRutina = (id) => {
    setRutinas(rutinas.filter((r) => r.id !== id))
  }

  const editarRutina = (id, cambios) => {
    setRutinas(rutinas.map((r) => (r.id === id ? { ...r, ...cambios } : r)))
  }

  const agregarEjercicio = (rutinaId, nombre, series, reps, peso, notas) => {
    setRutinas(
      rutinas.map((r) => {
        if (r.id !== rutinaId) return r
        return {
          ...r,
          ejercicios: [
            ...r.ejercicios,
            {
              id: Date.now(),
              nombre,
              series,
              reps,
              peso: peso || '',
              notas: notas || '',
            },
          ],
        }
      })
    )
  }

  const eliminarEjercicio = (rutinaId, ejercicioId) => {
    setRutinas(
      rutinas.map((r) => {
        if (r.id !== rutinaId) return r
        return {
          ...r,
          ejercicios: r.ejercicios.filter((e) => e.id !== ejercicioId),
        }
      })
    )
  }

  const editarEjercicio = (rutinaId, ejercicioId, cambios) => {
    setRutinas(
      rutinas.map((r) => {
        if (r.id !== rutinaId) return r
        return {
          ...r,
          ejercicios: r.ejercicios.map((e) =>
            e.id === ejercicioId ? { ...e, ...cambios } : e
          ),
        }
      })
    )
  }

  const registrarEntreno = (rutinaId, duracion, notas = '') => {
    const hoy = fechaHoy()
    const yaExiste = entrenos.find(
      (e) => e.fecha === hoy && e.rutinaId === rutinaId
    )
    if (yaExiste) return

    setEntrenos([
      ...entrenos,
      {
        id: Date.now(),
        rutinaId,
        fecha: hoy,
        duracion: duracion || 45,
        notas,
      },
    ])

    darXP(30)
  }

  const eliminarEntreno = (id) => {
    setEntrenos(entrenos.filter((e) => e.id !== id))
  }

  const diaHoy = DIAS_SEMANA[(new Date().getDay() + 6) % 7]
  const rutinasDeHoy = rutinas.filter((r) => r.dias.includes(diaHoy))
  const entreneHoy = entrenos.some((e) => e.fecha === fechaHoy())
  const fechasEntrenos = [...new Set(entrenos.map((e) => e.fecha))]
  const rachaGym = calcularRacha(fechasEntrenos)
  const recordGym = fechasEntrenos.length

  // === NIVEL ===
  const nivelInfo = calcularNivel(xpTotal)

  // === DASHBOARD ===
  const tareasCompletadasHoy = tareas.filter((t) => {
    if (!t.completada) return false
    return t.completadaEn && t.completadaEn.slice(0, 10) === fechaHoy()
  }).length

  const pomodorosHoy = etiquetasPomodoro.filter(
    (e) => e.fecha === fechaHoy()
  ).length

  const cursosConRacha =
    periodoActivoConStats?.cursos.filter((c) => c.racha > 0) || []

  // === APP ===
  const rachaApp = calcularRacha(diasUso)
  const recordApp = diasUso.length

  // === LOGROS ===
  const dataLogros = {
    tareas,
    pomodoros,
    habitos: habitosConStats,
    entrenos,
    rachaGym,
    rachaApp,
    nivelInfo,
  }

  const logros = LOGROS_DEFINICION.map((logro) => {
    const desbloqueado = logrosDesbloqueados.includes(logro.id)
    const progresoActual = logro.progreso(dataLogros)
    const porcentaje = Math.min(
      100,
      Math.round((progresoActual / logro.meta) * 100)
    )
    return {
      ...logro,
      desbloqueado,
      progresoActual,
      porcentaje,
    }
  })

  // 🎨 Aplicar tema al body
  useEffect(() => {
    document.body.setAttribute('data-tema', tema)
    document.body.setAttribute('data-color', colorPrincipal)
  }, [tema, colorPrincipal])

  const toggleTema = () => {
    setTema((t) => (t === 'oscuro' ? 'claro' : 'oscuro'))
  }

  const toggleSonidos = () => {
    setSonidosActivos((s) => !s)
  }

  // 🔔 Activar notificaciones
  const activarNotificaciones = async () => {
    const permiso = await pedirPermisoNotificaciones()
    if (permiso) {
      setNotificacionesActivas(true)
      agregarToast({
        tipo: 'nivel',
        titulo: '🔔 Notificaciones activadas',
        mensaje: 'Te avisaremos cuando importe',
      })
      return true
    } else {
      agregarToast({
        tipo: 'logro',
        titulo: '❌ Permiso denegado',
        mensaje: 'Habilitalas desde el navegador',
      })
      return false
    }
  }

  const desactivarNotificaciones = () => {
    setNotificacionesActivas(false)
    agregarToast({
      tipo: 'logro',
      titulo: '🔕 Notificaciones desactivadas',
      mensaje: 'No te vamos a molestar más',
    })
  }

  const toggleNotificaciones = async () => {
    if (notificacionesActivas) {
      desactivarNotificaciones()
    } else {
      await activarNotificaciones()
    }
  }

  // 🔥 Registrar día de uso
  useEffect(() => {
    const hoy = fechaHoy()
    if (!diasUso.includes(hoy)) {
      setDiasUso([...diasUso, hoy])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Detecta subida de nivel
  useEffect(() => {
    if (nivelAnteriorRef.current === null) {
      nivelAnteriorRef.current = nivelInfo.nivel
      return
    }
    if (nivelInfo.nivel > nivelAnteriorRef.current) {
      agregarToast({
        tipo: 'nivel',
        titulo: `¡Nivel ${nivelInfo.nivel}!`,
        mensaje: 'Sigue así, campeón 🚀',
      })
      if (sonidosActivos) {
        sonidoSubirNivel()
      }
      lanzarConfetiNivel()
    }
    nivelAnteriorRef.current = nivelInfo.nivel
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nivelInfo.nivel])

  // Auto-verificar logros
  useEffect(() => {
    const nuevos = []
    LOGROS_DEFINICION.forEach((logro) => {
      if (logrosDesbloqueados.includes(logro.id)) return
      if (logro.verificar(dataLogros)) {
        nuevos.push(logro.id)
        agregarToast({
          tipo: 'logro',
          titulo: '¡Logro desbloqueado!',
          mensaje: `${logro.emoji} ${logro.nombre}`,
        })
        if (sonidosActivos) {
          sonidoLogro()
        }
        lanzarConfetiLogro()
      }
    })
    if (nuevos.length > 0) {
      setLogrosDesbloqueados([...logrosDesbloqueados, ...nuevos])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tareas, pomodoros, habitos, entrenos, xpTotal])

  // === EXPORTAR / IMPORTAR ===
  const exportarDatos = () => {
    const datos = {
      version: 1,
      fechaExportacion: new Date().toISOString(),
      tareas,
      pomodoros,
      etiquetasPomodoro,
      habitos,
      periodos,
      periodoActivoId,
      rutinas,
      entrenos,
      xpTotal,
      logrosDesbloqueados,
      primerUso,
      diasUso,
    }

    const blob = new Blob([JSON.stringify(datos, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const fecha = fechaHoy()
    a.download = `mi-organizador-backup-${fecha}.json`
    a.click()
    URL.revokeObjectURL(url)

    agregarToast({
      tipo: 'nivel',
      titulo: '✅ Backup descargado',
      mensaje: 'Guarda el archivo en un lugar seguro',
    })
  }

  const importarDatos = (datos) => {
    try {
      if (!datos || typeof datos !== 'object') {
        throw new Error('Archivo inválido')
      }

      if (datos.tareas) setTareas(datos.tareas)
      if (typeof datos.pomodoros === 'number') setPomodoros(datos.pomodoros)
      if (datos.etiquetasPomodoro)
        setEtiquetasPomodoro(datos.etiquetasPomodoro)
      if (datos.habitos) setHabitos(datos.habitos)
      if (datos.periodos) setPeriodos(datos.periodos)
      if (datos.periodoActivoId !== undefined)
        setPeriodoActivoId(datos.periodoActivoId)
      if (datos.rutinas) setRutinas(datos.rutinas)
      if (datos.entrenos) setEntrenos(datos.entrenos)
      if (typeof datos.xpTotal === 'number') setXpTotal(datos.xpTotal)
      if (datos.logrosDesbloqueados)
        setLogrosDesbloqueados(datos.logrosDesbloqueados)
      if (datos.primerUso) setPrimerUso(datos.primerUso)
      if (datos.diasUso) setDiasUso(datos.diasUso)

      agregarToast({
        tipo: 'nivel',
        titulo: '✅ Datos importados',
        mensaje: 'Todo restaurado correctamente',
      })
      return true
    } catch (e) {
      agregarToast({
        tipo: 'logro',
        titulo: '❌ Error al importar',
        mensaje: e.message || 'Archivo inválido',
      })
      return false
    }
  }

  const resetearDatos = () => {
    setTareas([])
    setPomodoros(0)
    setEtiquetasPomodoro([])
    setHabitos([])
    setPeriodos([])
    setPeriodoActivoId(null)
    setRutinas([])
    setEntrenos([])
    setXpTotal(0)
    setLogrosDesbloqueados([])
    setDiasUso([])
    agregarToast({
      tipo: 'logro',
      titulo: '🗑️ Datos borrados',
      mensaje: 'Empezás de cero',
    })
  }

  return (
    <AppContext.Provider
      value={{
        // Tareas
        tareas,
        agregarTarea,
        toggleTarea,
        eliminarTarea,
        editarTarea,
        agregarSubtarea,
        toggleSubtarea,
        eliminarSubtarea,
        // Pomodoro
        pomodoros,
        sumarPomodoro,
        etiquetasPomodoro,
        notificarPomodoro,
        // Hábitos
        habitos: habitosConStats,
        agregarHabito,
        eliminarHabito,
        editarHabito,
        toggleDiaHabito,
        // Periodos
        periodos,
        periodosCerrados,
        periodoActivoId,
        periodoActivo: periodoActivoConStats,
        crearPeriodo,
        eliminarPeriodo,
        cerrarPeriodo,
        reactivarPeriodo,
        setPeriodoActivoId,
        // Cursos
        agregarCurso,
        eliminarCurso,
        editarCurso,
        registrarPomodoroCurso,
        // Gym
        rutinas,
        rutinasDeHoy,
        entrenos,
        entreneHoy,
        rachaGym,
        recordGym,
        agregarRutina,
        eliminarRutina,
        editarRutina,
        agregarEjercicio,
        eliminarEjercicio,
        editarEjercicio,
        registrarEntreno,
        eliminarEntreno,
        DIAS_SEMANA,
        // Dashboard
        tareasCompletadasHoy,
        pomodorosHoy,
        cursosConRacha,
        // XP & Logros
        xpTotal,
        nivelInfo,
        logros,
        logrosDesbloqueados,
        primerUso,
        // App
        rachaApp,
        recordApp,
        diasUso,
        // Toasts
        toasts,
        agregarToast,
        // Config
        exportarDatos,
        importarDatos,
        resetearDatos,
        // Tema
        tema,
        toggleTema,
        // Color
        colorPrincipal,
        setColorPrincipal,
        // Sonidos
        sonidosActivos,
        toggleSonidos,
        // Notificaciones
        notificacionesActivas,
        toggleNotificaciones,
        ultimaNotifHabitos,
        setUltimaNotifHabitos,
        ultimaNotifTareas,
        setUltimaNotifTareas,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}