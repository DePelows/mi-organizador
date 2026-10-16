import { useApp, fechaHoy } from '../context/AppContext'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// 🎨 Helper: detecta el color del texto según el tema
const getColores = () => {
  const esClaro = document.body.getAttribute('data-tema') === 'claro'
  return {
    texto: esClaro ? '#666680' : '#a0a0b0',
    grid: esClaro ? '#e0e0e8' : '#2a2a35',
    tooltipBg: esClaro ? '#ffffff' : '#1a1a24',
    tooltipTexto: esClaro ? '#1a1a24' : '#eaeaea',
  }
}

const getOpcionesBase = () => {
  const c = getColores()
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: c.texto,
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: c.tooltipBg,
        titleColor: c.tooltipTexto,
        bodyColor: c.tooltipTexto,
        borderColor: c.grid,
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: c.texto },
        grid: { color: c.grid },
      },
      y: {
        ticks: { color: c.texto, stepSize: 1 },
        grid: { color: c.grid },
        beginAtZero: true,
      },
    },
  }
}

const getOpcionesDoughnut = () => {
  const c = getColores()
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: c.texto,
          font: { size: 12 },
          padding: 12,
        },
      },
      tooltip: {
        backgroundColor: c.tooltipBg,
        titleColor: c.tooltipTexto,
        bodyColor: c.tooltipTexto,
        borderColor: c.grid,
        borderWidth: 1,
      },
    },
  }
}

// 🔧 Helper: cuenta actividades de un día
function contarActividadDia(fecha, { tareas, entrenos, cursos, habitos }) {
  const tareasEseDia = tareas.filter(
    (t) =>
      t.completada && t.completadaEn && t.completadaEn.slice(0, 10) === fecha
  ).length
  const entrenosEseDia = entrenos.filter((e) => e.fecha === fecha).length
  const estudioEseDia = cursos.filter((c) => c.fechas.includes(fecha)).length
  const habitosEseDia = habitos.filter((h) => h.fechas.includes(fecha)).length

  return {
    tareas: tareasEseDia,
    entrenos: entrenosEseDia,
    estudio: estudioEseDia,
    habitos: habitosEseDia,
    total: tareasEseDia + entrenosEseDia + estudioEseDia + habitosEseDia,
  }
}

function formatearFechaStr(fechaStr) {
  const [y, m, d] = fechaStr.split('-')
  return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString('es', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function Estadisticas() {
  const {
    tareas,
    pomodoros,
    habitos,
    entrenos,
    periodoActivo,
    tema,
    colorPrincipal,
  } = useApp()

  // 🔑 Key pa' forzar re-render de los gráficos cuando cambia el tema
  const keyGraficos = `${tema}-${colorPrincipal}`

  // === DATOS GENERALES ===
  const totalTareas = tareas.length
  const tareasCompletadas = tareas.filter((t) => t.completada).length
  const tasaExito =
    totalTareas > 0 ? Math.round((tareasCompletadas / totalTareas) * 100) : 0

  const totalHabitos = habitos.length
  const totalEntrenos = entrenos.length
  const totalPomodoros = pomodoros

  const cursos = periodoActivo?.cursos || []
  const totalCursos = cursos.length
  const totalHorasEstudio =
    cursos.reduce((acc, c) => acc + c.minutosTotales, 0) / 60

  // === GRÁFICO 1: Últimos 7 días ===
  const ultimos7Dias = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const dia = String(d.getDate()).padStart(2, '0')
    const fecha = `${y}-${m}-${dia}`
    const label = d.toLocaleDateString('es', { weekday: 'short' })

    const act = contarActividadDia(fecha, {
      tareas,
      entrenos,
      cursos,
      habitos,
    })

    ultimos7Dias.push({
      label,
      fecha,
      tareas: act.tareas,
      entrenos: act.entrenos,
      estudio: act.estudio,
    })
  }

  const dataActividad = {
    labels: ultimos7Dias.map((d) => d.label),
    datasets: [
      {
        label: 'Tareas',
        data: ultimos7Dias.map((d) => d.tareas),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Entrenos',
        data: ultimos7Dias.map((d) => d.entrenos),
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.15)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Estudio',
        data: ultimos7Dias.map((d) => d.estudio),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  // === GRÁFICO 2: Pomodoros por curso ===
  const dataPomodoros = {
    labels: cursos.length > 0 ? cursos.map((c) => c.nombre) : ['Sin cursos'],
    datasets: [
      {
        label: 'Pomodoros',
        data: cursos.length > 0 ? cursos.map((c) => c.pomodoros) : [0],
        backgroundColor:
          cursos.length > 0 ? cursos.map((c) => c.color) : ['#2a2a35'],
        borderColor: document.body.getAttribute('data-tema') === 'claro'
          ? '#ffffff'
          : '#1a1a24',
        borderWidth: 2,
      },
    ],
  }

  // === GRÁFICO 3: Rachas ===
  const rachasLabels = []
  const rachasValores = []
  const rachasColores = []

  const calcularRachaLocal = (fechas) => {
    if (fechas.length === 0) return 0
    const setFechas = new Set(fechas)
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    let cursor = new Date(hoy)
    const fHoy = fechaHoy()
    if (!setFechas.has(fHoy)) cursor.setDate(cursor.getDate() - 1)
    let racha = 0
    while (true) {
      const y = cursor.getFullYear()
      const m = String(cursor.getMonth() + 1).padStart(2, '0')
      const dia = String(cursor.getDate()).padStart(2, '0')
      const f = `${y}-${m}-${dia}`
      if (!setFechas.has(f)) break
      racha++
      cursor.setDate(cursor.getDate() - 1)
    }
    return racha
  }

  if (entrenos.length > 0) {
    const fechasUnicas = [...new Set(entrenos.map((e) => e.fecha))]
    const rachaGym = calcularRachaLocal(fechasUnicas)
    if (rachaGym > 0) {
      rachasLabels.push('💪 Gym')
      rachasValores.push(rachaGym)
      rachasColores.push('#f97316')
    }
  }

  cursos.forEach((c) => {
    const racha = calcularRachaLocal(c.fechas)
    if (racha > 0) {
      rachasLabels.push(`${c.emoji} ${c.nombre}`)
      rachasValores.push(racha)
      rachasColores.push(c.color)
    }
  })

  habitos.forEach((h) => {
    if (h.racha > 0) {
      rachasLabels.push(`${h.emoji} ${h.nombre}`)
      rachasValores.push(h.racha)
      rachasColores.push('#10b981')
    }
  })

  const dataRachas = {
    labels: rachasLabels,
    datasets: [
      {
        label: 'Días de racha',
        data: rachasValores,
        backgroundColor: rachasColores,
        borderRadius: 8,
      },
    ],
  }

  // === MAPA DE CALOR ===
  const mapaCalor = []
  const hoyDate = new Date()
  hoyDate.setHours(0, 0, 0, 0)
  const diaSemanaHoy = (hoyDate.getDay() + 6) % 7
  const diasDesdeUltimoLunes = diaSemanaHoy

  for (let i = 90 + diasDesdeUltimoLunes; i >= 0; i--) {
    const d = new Date(hoyDate)
    d.setDate(d.getDate() - i)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const dia = String(d.getDate()).padStart(2, '0')
    const fecha = `${y}-${m}-${dia}`

    const act = contarActividadDia(fecha, {
      tareas,
      entrenos,
      cursos,
      habitos,
    })

    mapaCalor.push({
      fecha,
      total: act.total,
      esHoy: fecha === fechaHoy(),
      diaSemana: (d.getDay() + 6) % 7,
    })
  }

  const semanas = []
  let semanaActual = []
  mapaCalor.forEach((dia, idx) => {
    semanaActual.push(dia)
    if (dia.diaSemana === 6 || idx === mapaCalor.length - 1) {
      semanas.push(semanaActual)
      semanaActual = []
    }
  })

  const nivelColor = (total) => {
    if (total === 0) return 0
    if (total === 1) return 1
    if (total <= 3) return 2
    if (total <= 5) return 3
    return 4
  }

  const mesesLabels = []
  let ultimoMes = null
  semanas.forEach((sem) => {
    if (sem.length > 0) {
      const [y, m] = sem[0].fecha.split('-')
      const mesLabel = new Date(Number(y), Number(m) - 1, 1).toLocaleDateString(
        'es',
        { month: 'short' }
      )
      if (mesLabel !== ultimoMes) {
        mesesLabels.push({ index: semanas.indexOf(sem), label: mesLabel })
        ultimoMes = mesLabel
      }
    }
  })

  // === COMPARATIVA 4 SEMANAS ===
  const semanasData = []
  for (let s = 3; s >= 0; s--) {
    let totalTareas = 0
    let totalEntrenos = 0
    let totalEstudio = 0
    let totalHabitos = 0

    for (let d = 0; d < 7; d++) {
      const fecha = new Date()
      fecha.setDate(fecha.getDate() - (s * 7 + d))
      const y = fecha.getFullYear()
      const m = String(fecha.getMonth() + 1).padStart(2, '0')
      const dia = String(fecha.getDate()).padStart(2, '0')
      const fechaStr = `${y}-${m}-${dia}`

      const act = contarActividadDia(fechaStr, {
        tareas,
        entrenos,
        cursos,
        habitos,
      })
      totalTareas += act.tareas
      totalEntrenos += act.entrenos
      totalEstudio += act.estudio
      totalHabitos += act.habitos
    }

    const total = totalTareas + totalEntrenos + totalEstudio + totalHabitos

    semanasData.push({
      label: s === 0 ? 'Esta semana' : `Hace ${s} sem.`,
      tareas: totalTareas,
      entrenos: totalEntrenos,
      estudio: totalEstudio,
      habitos: totalHabitos,
      total,
    })
  }

  // === RÉCORDS ===
  let mejorDia = null
  mapaCalor.forEach((dia) => {
    if (!mejorDia || dia.total > mejorDia.total) {
      mejorDia = dia
    }
  })

  let rachaMaxGym = 0
  if (entrenos.length > 0) {
    const fechasOrdenadas = [...new Set(entrenos.map((e) => e.fecha))].sort()
    let rachaActual = 1
    let rachaMax = 1
    for (let i = 1; i < fechasOrdenadas.length; i++) {
      const prev = new Date(fechasOrdenadas[i - 1])
      const curr = new Date(fechasOrdenadas[i])
      const diff = (curr - prev) / (1000 * 60 * 60 * 24)
      if (diff === 1) {
        rachaActual++
        rachaMax = Math.max(rachaMax, rachaActual)
      } else {
        rachaActual = 1
      }
    }
    rachaMaxGym = rachaMax
  }

  const cursoTop =
    cursos.length > 0
      ? [...cursos].sort((a, b) => b.pomodoros - a.pomodoros)[0]
      : null

  const semanaTop =
    semanasData.length > 0
      ? [...semanasData].sort((a, b) => b.total - a.total)[0]
      : null

  const diasActivos = mapaCalor.filter((d) => d.total > 0).length

  const sinDatos =
    totalTareas === 0 &&
    totalPomodoros === 0 &&
    totalCursos === 0 &&
    totalEntrenos === 0 &&
    totalHabitos === 0

  return (
    <div className="stats-page">
      <div className="stats-header">
        <h2>📊 Estadísticas</h2>
        <p className="stats-subtitulo">Tu progreso de un vistazo</p>
      </div>

      {sinDatos ? (
        <div className="cursos-vacio">
          <div className="vacio-emoji">📊</div>
          <h3>Aún no hay datos</h3>
          <p>
            Cuando empieces a completar tareas, entrenos y pomodoros, aquí
            aparecerán tus estadísticas.
          </p>
        </div>
      ) : (
        <>
          <div className="stats-metricas">
            <div className="stat-metrica">
              <span className="sm-valor">{totalTareas}</span>
              <span className="sm-label">Tareas totales</span>
            </div>
            <div className="stat-metrica">
              <span className="sm-valor">{tasaExito}%</span>
              <span className="sm-label">Tasa de éxito</span>
            </div>
            <div className="stat-metrica">
              <span className="sm-valor">{totalPomodoros}</span>
              <span className="sm-label">Pomodoros</span>
            </div>
            <div className="stat-metrica">
              <span className="sm-valor">{totalHorasEstudio.toFixed(1)}h</span>
              <span className="sm-label">Horas de estudio</span>
            </div>
            <div className="stat-metrica">
              <span className="sm-valor">{totalEntrenos}</span>
              <span className="sm-label">Entrenos</span>
            </div>
            <div className="stat-metrica">
              <span className="sm-valor">{diasActivos}</span>
              <span className="sm-label">Días activos</span>
            </div>
          </div>

          {/* Mapa de calor */}
          <div className="stats-card">
            <h3 className="stats-card-titulo">
              🔥 Mapa de calor · últimos 3 meses
            </h3>
            <p className="stats-descripcion">
              Cada cuadrito es un día. Más verde = más actividad.
            </p>

            <div className="mapa-calor-wrapper">
              <div className="mapa-calor-meses">
                {mesesLabels.map((m, i) => (
                  <span
                    key={i}
                    className="mes-label"
                    style={{ gridColumn: m.index + 1 }}
                  >
                    {m.label}
                  </span>
                ))}
              </div>

              <div className="mapa-calor-grid">
                {semanas.map((semana, i) => (
                  <div key={i} className="semana-col">
                    {semana.map((dia) => (
                      <div
                        key={dia.fecha}
                        className={`mapa-dia nivel-${nivelColor(
                          dia.total
                        )} ${dia.esHoy ? 'hoy' : ''}`}
                        title={`${formatearFechaStr(dia.fecha)} · ${
                          dia.total
                        } actividad${dia.total === 1 ? '' : 'es'}`}
                      />
                    ))}
                  </div>
                ))}
              </div>

              <div className="mapa-calor-leyenda">
                <span>Menos</span>
                <div className="mapa-dia nivel-0" />
                <div className="mapa-dia nivel-1" />
                <div className="mapa-dia nivel-2" />
                <div className="mapa-dia nivel-3" />
                <div className="mapa-dia nivel-4" />
                <span>Más</span>
              </div>
            </div>
          </div>

          {/* Comparativa */}
          <div className="stats-card">
            <h3 className="stats-card-titulo">
              📅 Comparativa · últimas 4 semanas
            </h3>
            <div className="comparativa-grid">
              {semanasData.map((sem, i) => (
                <div
                  key={i}
                  className={`comparativa-item ${
                    i === semanasData.length - 1 ? 'actual' : ''
                  }`}
                >
                  <span className="comp-label">{sem.label}</span>
                  <span className="comp-total">{sem.total}</span>
                  <span className="comp-detalle">
                    {sem.tareas > 0 && `📋${sem.tareas} `}
                    {sem.entrenos > 0 && `💪${sem.entrenos} `}
                    {sem.estudio > 0 && `📚${sem.estudio} `}
                    {sem.habitos > 0 && `🔥${sem.habitos}`}
                  </span>
                </div>
              ))}
            </div>

            {semanasData.length >= 2 && (
              <div className="comparativa-tendencia">
                {(() => {
                  const actual = semanasData[semanasData.length - 1].total
                  const anterior = semanasData[semanasData.length - 2].total
                  if (anterior === 0 && actual === 0) {
                    return (
                      <span className="tendencia-neutra">
                        Sin actividad las últimas 2 semanas
                      </span>
                    )
                  }
                  if (anterior === 0) {
                    return (
                      <span className="tendencia-subida">
                        ⬆️ ¡Arrancaste con todo esta semana!
                      </span>
                    )
                  }
                  const diff = Math.round(
                    ((actual - anterior) / anterior) * 100
                  )
                  if (diff > 0) {
                    return (
                      <span className="tendencia-subida">
                        ⬆️ {diff}% más que la semana pasada
                      </span>
                    )
                  } else if (diff < 0) {
                    return (
                      <span className="tendencia-bajada">
                        ⬇️ {Math.abs(diff)}% menos que la semana pasada
                      </span>
                    )
                  }
                  return (
                    <span className="tendencia-neutra">
                      = Igual que la semana pasada
                    </span>
                  )
                })()}
              </div>
            )}
          </div>

          {/* Récords */}
          <div className="stats-card">
            <h3 className="stats-card-titulo">🏆 Récords personales</h3>
            <div className="records-grid">
              {mejorDia && mejorDia.total > 0 && (
                <div className="record-item">
                  <span className="record-icono">⭐</span>
                  <div className="record-info">
                    <span className="record-valor">{mejorDia.total}</span>
                    <span className="record-label">Mejor día</span>
                    <span className="record-fecha">
                      {formatearFechaStr(mejorDia.fecha)}
                    </span>
                  </div>
                </div>
              )}

              {rachaMaxGym > 0 && (
                <div className="record-item">
                  <span className="record-icono">💪</span>
                  <div className="record-info">
                    <span className="record-valor">{rachaMaxGym} días</span>
                    <span className="record-label">Racha máx. gym</span>
                  </div>
                </div>
              )}

              {cursoTop && cursoTop.pomodoros > 0 && (
                <div className="record-item">
                  <span className="record-icono">{cursoTop.emoji}</span>
                  <div className="record-info">
                    <span className="record-valor">
                      {cursoTop.pomodoros} 🍅
                    </span>
                    <span className="record-label">Curso más estudiado</span>
                    <span className="record-fecha">{cursoTop.nombre}</span>
                  </div>
                </div>
              )}

              {semanaTop && semanaTop.total > 0 && (
                <div className="record-item">
                  <span className="record-icono">🚀</span>
                  <div className="record-info">
                    <span className="record-valor">{semanaTop.total}</span>
                    <span className="record-label">Mejor semana</span>
                    <span className="record-fecha">{semanaTop.label}</span>
                  </div>
                </div>
              )}

              {diasActivos > 0 && (
                <div className="record-item">
                  <span className="record-icono">📅</span>
                  <div className="record-info">
                    <span className="record-valor">{diasActivos}</span>
                    <span className="record-label">Días activos</span>
                    <span className="record-fecha">
                      de {mapaCalor.length} días
                    </span>
                  </div>
                </div>
              )}

              {totalPomodoros > 0 && (
                <div className="record-item">
                  <span className="record-icono">🍅</span>
                  <div className="record-info">
                    <span className="record-valor">{totalPomodoros}</span>
                    <span className="record-label">Pomodoros totales</span>
                    <span className="record-fecha">
                      {totalPomodoros * 25 > 0
                        ? `${((totalPomodoros * 25) / 60).toFixed(1)}h`
                        : ''}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Gráfico 7 días */}
          <div className="stats-card">
            <h3 className="stats-card-titulo">📈 Actividad últimos 7 días</h3>
            <div className="chart-wrapper">
              <Line
                key={keyGraficos}
                data={dataActividad}
                options={getOpcionesBase()}
              />
            </div>
          </div>

          {/* Fila doble */}
          <div className="stats-fila-doble">
            {cursos.length > 0 && (
              <div className="stats-card">
                <h3 className="stats-card-titulo">🍅 Pomodoros por curso</h3>
                <div className="chart-wrapper-doughnut">
                  <Doughnut
                    key={keyGraficos}
                    data={dataPomodoros}
                    options={getOpcionesDoughnut()}
                  />
                </div>
              </div>
            )}

            {rachasLabels.length > 0 && (
              <div className="stats-card">
                <h3 className="stats-card-titulo">🔥 Rachas actuales</h3>
                <div className="chart-wrapper-doughnut">
                  <Bar
                    key={keyGraficos}
                    data={dataRachas}
                    options={{
                      ...getOpcionesBase(),
                      indexAxis: 'y',
                      plugins: {
                        legend: { display: false },
                      },
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Estadisticas