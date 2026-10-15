import confetti from 'canvas-confetti'

export function lanzarConfetiLogro() {
  const duracion = 3000
  const fin = Date.now() + duracion

  // Corazón de colores
  const colores = ['#6366f1', '#ec4899', '#fbbf24', '#10b981', '#06b6d4']

  ;(function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colores,
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colores,
    })

    if (Date.now() < fin) {
      requestAnimationFrame(frame)
    }
  })()

  // Explosión central
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 },
      colors: colores,
    })
  }, 300)
}

export function lanzarConfetiNivel() {
  const colores = ['#a78bfa', '#6366f1', '#8b5cf6']

  confetti({
    particleCount: 150,
    spread: 90,
    origin: { y: 0.5 },
    colors: colores,
    startVelocity: 45,
  })
}