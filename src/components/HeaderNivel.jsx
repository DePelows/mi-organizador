import { useEffect, useState } from 'react'
import { Sun, Moon, Star } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Buscador from './Buscador'

function HeaderNivel() {
  const { nivelInfo, tema, toggleTema } = useApp()
  const [animando, setAnimando] = useState(false)

  useEffect(() => {
    setAnimando(true)
    const t = setTimeout(() => setAnimando(false), 400)
    return () => clearTimeout(t)
  }, [nivelInfo.xpTotal])

  return (
    <div className="header-right">
      <div className={`header-nivel ${animando ? 'animando' : ''}`}>
        <div className="hn-info">
          <span className="hn-nivel">
            <Star size={14} strokeWidth={2.5} />
            Nivel {nivelInfo.nivel}
          </span>
          <span className="hn-xp">
            {nivelInfo.xpEnNivel} / {nivelInfo.xpNecesario} XP
          </span>
        </div>
        <div className="hn-barra">
          <div
            className="hn-barra-progreso"
            style={{ width: `${nivelInfo.progreso}%` }}
          />
        </div>
      </div>

      <Buscador />

      <button
        className="btn-tema"
        onClick={toggleTema}
        title={tema === 'oscuro' ? 'Modo claro' : 'Modo oscuro'}
      >
        {tema === 'oscuro' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  )
}

export default HeaderNivel