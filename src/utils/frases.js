// 💬 Frases motivacionales + frases meme del fútbol peruano
// Estilo Call of Duty: frase + autor

export const FRASES = [
  // === FRASES SERIAS (filosofía / motivación) ===
  {
    texto: 'No cuentes los días, haz que los días cuenten.',
    autor: 'Muhammad Ali',
  },
  {
    texto: 'La disciplina es el puente entre las metas y los logros.',
    autor: 'Jim Rohn',
  },
  {
    texto: 'El éxito es la suma de pequeños esfuerzos repetidos día tras día.',
    autor: 'Robert Collier',
  },
  {
    texto:
      'El éxito no es definitivo, el fracaso no es fatal: es el coraje de continuar lo que cuenta.',
    autor: 'Winston Churchill',
  },
  {
    texto:
      'Solo aquellos que intentan lo absurdo pueden lograr lo imposible.',
    autor: 'Albert Einstein',
  },
  {
    texto: 'No es que tengamos poco tiempo, es que perdemos mucho.',
    autor: 'Séneca',
  },
  {
    texto: 'La mejor manera de predecir el futuro es crearlo.',
    autor: 'Peter Drucker',
  },
  {
    texto:
      'El que tiene un por qué para vivir, puede soportar casi cualquier cómo.',
    autor: 'Friedrich Nietzsche',
  },
  {
    texto: 'No hay viento favorable para el que no sabe a dónde va.',
    autor: 'Séneca',
  },
  {
    texto:
      'El genio es un 1% de inspiración y un 99% de transpiración.',
    autor: 'Thomas Edison',
  },
  {
    texto: 'Los campeones no se hacen en el ring. Se hacen en los entrenamientos.',
    autor: 'Muhammad Ali',
  },
  {
    texto: 'El único modo de hacer un gran trabajo es amar lo que haces.',
    autor: 'Steve Jobs',
  },
  {
    texto: 'La suerte favorece a la mente preparada.',
    autor: 'Louis Pasteur',
  },
  {
    texto: 'No importa cuán lento vayas, siempre y cuando no te detengas.',
    autor: 'Confucio',
  },
  {
    texto: 'La excelencia no es un acto, es un hábito.',
    autor: 'Aristóteles',
  },
  {
    texto: 'El secreto para salir adelante es comenzar.',
    autor: 'Mark Twain',
  },
  {
    texto: 'Nada en el mundo puede reemplazar la persistencia.',
    autor: 'Calvin Coolidge',
  },

  // === FRASES MEMERAS PERUANAS 🇵🇪😂 ===
  {
    texto: 'Vive la vida, no dejes que la vida te viva.',
    autor: 'Susy Díaz',
  },
  {
    texto: 'No sabía que era travestis.',
    autor: 'Ronaldo Nazario',
  },
  {
    texto: 'Cuando entro en el arco yo sabía que era gol.',
    autor: 'Puerro Xeneize',
  },
  {
    texto: 'Malos de mierda no pueden patear una pelota.',
    autor: 'Fanodric, sobre la selección peruana',
  },
  {
    texto: 'Gana el que meta más goles.',
    autor: 'Puerrotudo Xeneize',
  },
  {
    texto:
      'Dios me dio dos piernas para jugar al fútbol, no para perseguir a una mujer a la que no le intereso.',
    autor: 'El Shaarawy',
  },
  {
    texto: 'Why always me?',
    autor: 'Mario Balotelli',
  },
  {
    texto: 'Cuando el reloj marcó las 12 yo sabía que era año nuevo.',
    autor: 'Daboludo Xeneize',
  },
  {
    texto: 'Hice la de Cuto.',
    autor: 'Ronaldinho',
  },
  {
    texto: 'SI BAILA ES ATREVIDO.',
    autor: 'Tilin Zuñiga',
  },
  {
    texto:
      'Era el más regular, la malograba arriba, en el medio y abajo, y es más en su mejor momento, era malo.',
    autor: 'Wilmar Valencia en conferencia de prensa',
  },
  {
    texto: 'Tócame que soy realidad.',
    autor: 'Reimond Manco',
  },
  {
    texto: 'Es cristal, no pasa nada.',
    autor: 'Christian Ramos',
  },
  {
    texto: 'Vení que te vamos a hacer famoso... ¡miserable!',
    autor: 'Sergio Markarián',
  },
  {
    texto: 'TENGO HAAAAAAAAMBRE!!!!',
    autor: 'Cuto Guadalupe',
  },
  {
    texto:
      'Esta copa Perú la está manejando Manuel Burga, la gente de Lima... con esto me limpio el culo.',
    autor: 'Horacio "La Pepa" Baldessari',
  },
  {
    texto: '¿Quién es usted señor Fano? ¡Respeten a Lapadula!',
    autor: 'Sonsei Valencia',
  },
  {
    texto: 'El fair play dónde está.',
    autor: 'Juan "Chiquito" Flores',
  },
  {
    texto: 'Ya ya pezuñento, ya cochino.',
    autor: 'Kukin Flores',
  },
  {
    texto: 'Estoy podrido de los rótulos, pero podrido eh...',
    autor: 'Sergio Markarián',
  },
  {
    texto:
      'Hay un equipito de Lima que no quiere que haya descenso.',
    autor: 'Leao Butrón, 6 meses antes de descender',
  },
  {
    texto: 'Todos somos hombres y tenemos problemas.',
    autor: 'Reimond Manco',
  },
  {
    texto: 'Este empate tiene sabor a suegra calata.',
    autor: 'Sergio "Checho" Ibarra',
  },
  {
    texto: '¿Aló? ¿Guardiola?',
    autor: 'Roberto "La Mosca" Mosquera',
  },
]

// 🎲 Devuelve una frase aleatoria
export function fraseAleatoria() {
  return FRASES[Math.floor(Math.random() * FRASES.length)]
}

// 🎴 Sistema de baraja: frases sin repetir hasta agotar todas

const STORAGE_KEY_BARAJA = 'frasesBaraja'

// 🔀 Algoritmo Fisher-Yates pa' mezclar
function mezclar(array) {
  const copia = [...array]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

// 🎴 Devuelve la próxima frase sin repetir
export function proximaFrase() {
  try {
    // Leer estado actual
    const guardado = localStorage.getItem(STORAGE_KEY_BARAJA)
    let estado = guardado
      ? JSON.parse(guardado)
      : { restantes: [], usadas: [] }

    // Si no hay frases restantes → rebarajar
    if (!estado.restantes || estado.restantes.length === 0) {
      const todosLosIndices = FRASES.map((_, i) => i)
      estado.restantes = mezclar(todosLosIndices)
      estado.usadas = []
    }

    // Sacar una frase random de las restantes
    const indiceRandom = Math.floor(Math.random() * estado.restantes.length)
    const indiceFrase = estado.restantes[indiceRandom]

    // Moverla de "restantes" a "usadas"
    estado.restantes.splice(indiceRandom, 1)
    estado.usadas.push(indiceFrase)

    // Guardar
    localStorage.setItem(STORAGE_KEY_BARAJA, JSON.stringify(estado))

    return FRASES[indiceFrase]
  } catch (e) {
    console.warn('Error al barajar frases:', e)
    // Fallback: frase random normal
    return FRASES[Math.floor(Math.random() * FRASES.length)]
  }
}

// 🎴 Ver progreso de la baraja (opcional)
export function progresoBaraja() {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY_BARAJA)
    if (!guardado) return { usadas: 0, total: FRASES.length }
    const estado = JSON.parse(guardado)
    return {
      usadas: estado.usadas.length,
      total: FRASES.length,
    }
  } catch {
    return { usadas: 0, total: FRASES.length }
  }
}