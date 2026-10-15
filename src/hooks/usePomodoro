import { useState, useEffect, useRef, useCallback } from 'react'

function usePomodoro({
  minutosEnfoque = 25,
  minutosDescanso = 5,
  onCompletar,
}) {
  const [modo, setModo] = useState('enfoque')
  const [segundos, setSegundos] = useState(minutosEnfoque * 60)
  const [corriendo, setCorriendo] = useState(false)

  const intervaloRef = useRef(null)
  const yaAvisoRef = useRef(false) // ← evita duplicados

  // Guardamos el callback en una ref pa' no re-crear el interval
  const onCompletarRef = useRef(onCompletar)
  useEffect(() => {
    onCompletarRef.current = onCompletar
  }, [onCompletar])

  // Cambia el tiempo cuando cambia el modo
  useEffect(() => {
    setSegundos(
      (modo === 'enfoque' ? minutosEnfoque : minutosDescanso) * 60
    )
    yaAvisoRef.current = false // resetea el flag al cambiar de modo
  }, [modo, minutosEnfoque, minutosDescanso])

  // El tick del timer
  useEffect(() => {
    if (!corriendo) return

    intervaloRef.current = setInterval(() => {
      setSegundos((s) => {
        if (s <= 1) {
          // ⚠️ Solo avisa UNA vez por ciclo
          if (!yaAvisoRef.current) {
            yaAvisoRef.current = true

            // Reproduce alarma
            reproducirAlarma()

            // Avisa al componente (solo una vez)
            if (onCompletarRef.current) {
              onCompletarRef.current(modo)
            }

            // Cambia al otro modo
            setModo((m) => (m === 'enfoque' ? 'descanso' : 'enfoque'))
          }
          return 0
        }
        return s - 1
      })
    }, 1000)

    return () => clearInterval(intervaloRef.current)
  }, [corriendo, modo])

  // 🔊 Función que reproduce la alarma 5 segundos
  const reproducirAlarma = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      const ctx = new AudioCtx()

      const duracion = 5 // segundos
      const ahora = ctx.currentTime

      // Crea un "beep" repetido durante 5 segundos
      for (let i = 0; i < duracion * 2; i++) {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.frequency.value = 880 // tono agudo tipo alarma
        osc.type = 'sine'

        const inicio = ahora + i * 0.5
        gain.gain.setValueAtTime(0.3, inicio)
        gain.gain.exponentialRampToValueAtTime(0.001, inicio + 0.4)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(inicio)
        osc.stop(inicio + 0.4)
      }

      // Cierra el contexto al terminar
      setTimeout(() => ctx.close(), duracion * 1000 + 500)
    } catch (e) {
      console.warn('No se pudo reproducir la alarma:', e)
    }
  }

  const iniciar = useCallback(() => setCorriendo(true), [])
  const pausar = useCallback(() => setCorriendo(false), [])

  const reiniciar = useCallback(() => {
    setCorriendo(false)
    yaAvisoRef.current = false
    setSegundos((modo === 'enfoque' ? minutosEnfoque : minutosDescanso) * 60)
  }, [modo, minutosEnfoque, minutosDescanso])

  const cambiarModo = useCallback((nuevoModo) => {
    setCorriendo(false)
    setModo(nuevoModo)
  }, [])

  const minutos = Math.floor(segundos / 60)
  const segs = segundos % 60

  return {
    modo,
    minutos,
    segundos: segs,
    corriendo,
    iniciar,
    pausar,
    reiniciar,
    cambiarModo,
  }
}

export default usePomodoro