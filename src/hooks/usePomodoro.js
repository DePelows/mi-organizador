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
  const yaAvisoRef = useRef(false)
  const tiempoFinRef = useRef(null)

  // Guardar callback en ref
  const onCompletarRef = useRef(onCompletar)
  useEffect(() => {
    onCompletarRef.current = onCompletar
  }, [onCompletar])

  // Cambia el tiempo cuando cambia el modo
  useEffect(() => {
    setSegundos((modo === 'enfoque' ? minutosEnfoque : minutosDescanso) * 60)
    yaAvisoRef.current = false
  }, [modo, minutosEnfoque, minutosDescanso])

  // ⏱️ Lógica del timer (con tiempo real, no acumulativo)
  useEffect(() => {
    if (!corriendo) {
      // Cuando se pausa, limpiamos el intervalo
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current)
        intervaloRef.current = null
      }
      return
    }

    // Guardamos el momento exacto en que debería terminar
    if (!tiempoFinRef.current) {
      tiempoFinRef.current = Date.now() + segundos * 1000
    }

    intervaloRef.current = setInterval(() => {
      const ahora = Date.now()
      const restante = Math.max(
        0,
        Math.round((tiempoFinRef.current - ahora) / 1000)
      )

      setSegundos((s) => {
        if (restante <= 0 && !yaAvisoRef.current) {
          yaAvisoRef.current = true
          tiempoFinRef.current = null

          // Reproducir alarma
          reproducirAlarma()

          // Avisar
          if (onCompletarRef.current) {
            onCompletarRef.current(modo)
          }

          // Cambiar modo
          setModo((m) => (m === 'enfoque' ? 'descanso' : 'enfoque'))
          return 0
        }
        return restante
      })
    }, 250) // Cada 250ms pa' mayor precisión

    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current)
        intervaloRef.current = null
      }
    }
  }, [corriendo, modo, segundos])

  // 🔊 Alarma
  const reproducirAlarma = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      const ctx = new AudioCtx()

      const duracion = 5
      const ahora = ctx.currentTime

      for (let i = 0; i < duracion * 2; i++) {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.frequency.value = 880
        osc.type = 'sine'

        const inicio = ahora + i * 0.5
        gain.gain.setValueAtTime(0.3, inicio)
        gain.gain.exponentialRampToValueAtTime(0.001, inicio + 0.4)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(inicio)
        osc.stop(inicio + 0.4)
      }

      setTimeout(() => ctx.close(), duracion * 1000 + 500)
    } catch (e) {
      console.warn('No se pudo reproducir la alarma:', e)
    }
  }

  const iniciar = useCallback(() => {
    // Si no hay tiempo fin, lo calculamos
    if (!tiempoFinRef.current) {
      tiempoFinRef.current = Date.now() + segundos * 1000
    }
    setCorriendo(true)
  }, [segundos])

  const pausar = useCallback(() => {
    setCorriendo(false)
    // No borramos tiempoFinRef para poder reanudar
  }, [])

  const reiniciar = useCallback(() => {
    setCorriendo(false)
    yaAvisoRef.current = false
    tiempoFinRef.current = null
    setSegundos((modo === 'enfoque' ? minutosEnfoque : minutosDescanso) * 60)
  }, [modo, minutosEnfoque, minutosDescanso])

  const cambiarModo = useCallback((nuevoModo) => {
    setCorriendo(false)
    yaAvisoRef.current = false
    tiempoFinRef.current = null
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