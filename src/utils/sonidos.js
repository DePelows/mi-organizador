// 🔊 Sistema de sonidos con Web Audio API (sin archivos externos)

let ctxAudio = null

function getCtx() {
  if (!ctxAudio) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    ctxAudio = new AudioCtx()
  }
  return ctxAudio
}

// 🎵 Toca una nota
function tocarNota(
  frecuencia,
  duracion,
  inicio,
  tipo = 'sine',
  volumen = 0.3
) {
  const ctx = getCtx()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.frequency.value = frecuencia
  osc.type = tipo

  gain.gain.setValueAtTime(0, inicio)
  gain.gain.linearRampToValueAtTime(volumen, inicio + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.001, inicio + duracion)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(inicio)
  osc.stop(inicio + duracion)
}

export function sonidoSubirNivel() {
  try {
    const ctx = getCtx()
    const ahora = ctx.currentTime
    // Arpegio ascendente
    tocarNota(523.25, 0.15, ahora, 'triangle', 0.25)
    tocarNota(659.25, 0.15, ahora + 0.1, 'triangle', 0.25)
    tocarNota(783.99, 0.15, ahora + 0.2, 'triangle', 0.25)
    tocarNota(1046.5, 0.35, ahora + 0.3, 'triangle', 0.3)
  } catch (e) {
    console.warn('Error al reproducir sonido:', e)
  }
}

export function sonidoLogro() {
  try {
    const ctx = getCtx()
    const ahora = ctx.currentTime
    // Fanfarria
    tocarNota(783.99, 0.1, ahora, 'square', 0.15)
    tocarNota(987.77, 0.1, ahora + 0.08, 'square', 0.15)
    tocarNota(1174.66, 0.25, ahora + 0.16, 'square', 0.2)
    tocarNota(1567.98, 0.4, ahora + 0.25, 'triangle', 0.25)
  } catch (e) {
    console.warn('Error al reproducir sonido:', e)
  }
}

export function sonidoPomodoro() {
  try {
    const ctx = getCtx()
    const ahora = ctx.currentTime
    // Campana suave
    tocarNota(880, 0.5, ahora, 'sine', 0.3)
    tocarNota(1174.66, 0.6, ahora + 0.15, 'sine', 0.2)
  } catch (e) {
    console.warn('Error al reproducir sonido:', e)
  }
}

export function sonidoTareaCompletada() {
  try {
    const ctx = getCtx()
    const ahora = ctx.currentTime
    // Ding alegre
    tocarNota(1046.5, 0.15, ahora, 'sine', 0.2)
    tocarNota(1318.51, 0.2, ahora + 0.08, 'sine', 0.15)
  } catch (e) {
    console.warn('Error al reproducir sonido:', e)
  }
}

export function sonidoHabito() {
  try {
    const ctx = getCtx()
    const ahora = ctx.currentTime
    // Pequeño "blip"
    tocarNota(880, 0.1, ahora, 'triangle', 0.15)
    tocarNota(1174.66, 0.15, ahora + 0.06, 'triangle', 0.15)
  } catch (e) {
    console.warn('Error al reproducir sonido:', e)
  }
}