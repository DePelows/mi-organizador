import { useState, useEffect } from 'react'

function useLocalStorage(clave, valorInicial) {
  // Lee del localStorage al inicio (o usa valor inicial)
  const [valor, setValor] = useState(() => {
    try {
      const item = localStorage.getItem(clave)
      return item ? JSON.parse(item) : valorInicial
    } catch {
      return valorInicial
    }
  })

  // Cada vez que cambia, guarda en localStorage
  useEffect(() => {
    localStorage.setItem(clave, JSON.stringify(valor))
  }, [clave, valor])

  return [valor, setValor]
}

export default useLocalStorage