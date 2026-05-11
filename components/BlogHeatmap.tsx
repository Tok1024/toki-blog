type HeatmapPost = {
  date: string
}

type HeatmapCell = {
  dateKey: string
  count: number
  level: number
  isFuture: boolean
}

type HeatmapWeek = {
  startDate: Date
  cells: HeatmapCell[]
}

type BlogHeatmapProps = {
  posts: HeatmapPost[]
  embedded?: boolean
}

const DAYS = ['一', '二', '三', '四', '五', '六', '日']
const MONTH_WINDOW = 4
const DAY_MS = 24 * 60 * 60 * 1000

function toLocalDateKey(value: Date | string) {
  if (typeof value === 'string') {
    const matched = value.match(/^(\d{4}-\d{2}-\d{2})/)
    if (matched) {
      return matched[1]
    }
  }

  const date = typeof value === 'string' ? new Date(value) : value
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getMonday(date: Date) {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  const day = result.getDay()
  const diff = day === 0 ? -6 : 1 - day
  result.setDate(result.getDate() + diff)
  return result
}

function addDays(date: Date, days: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function getIntensity(count: number, peak: number) {
  if (count <= 0 || peak <= 0) return 0
  const ratio = count / peak
  if (ratio >= 0.75) return 4
  if (ratio >= 0.5) return 3
  if (ratio >= 0.25) return 2
  return 1
}

function getCellClassName(level: number, isFuture: boolean) {
  if (isFuture) {
    return 'border-primary-100/70 bg-white/55 dark:border-gray-800 dark:bg-gray-900/40'
  }

  switch (level) {
    case 4:
      return 'border-primary-400 bg-primary-500 dark:border-primary-300/60 dark:bg-primary-300/80'
    case 3:
      return 'border-primary-300 bg-primary-400 dark:border-primary-400/60 dark:bg-primary-400/65'
    case 2:
      return 'border-primary-200 bg-primary-300 dark:border-primary-500/60 dark:bg-primary-500/55'
    case 1:
      return 'border-primary-100 bg-primary-200 dark:border-primary-700/60 dark:bg-primary-800/80'
    default:
      return 'border-primary-100/80 bg-white dark:border-gray-800 dark:bg-gray-900/70'
  }
}

function getMonthMarkers(startDate: Date, weekCount: number) {
  const markers: Array<{ label: string; column: number }> = []
  let previousMonth = -1

  for (let column = 0; column < weekCount; column += 1) {
    const current = addDays(startDate, column * 7)
    const month = current.getMonth()
    if (month !== previousMonth) {
      markers.push({
        label: `${month + 1}月`,
        column,
      })
      previousMonth = month
    }
  }

  return markers
}

function getStreaks(countsByDay: Map<string, number>, endDate: Date) {
  const sortedDates = [...countsByDay.keys()].sort()
  let longestStreak = 0
  let currentRun = 0
  let previousDate: Date | null = null

  for (const dateKey of sortedDates) {
    const currentDate = new Date(`${dateKey}T00:00:00`)
    if (previousDate) {
      const diff = Math.round((currentDate.getTime() - previousDate.getTime()) / DAY_MS)
      currentRun = diff === 1 ? currentRun + 1 : 1
    } else {
      currentRun = 1
    }
    longestStreak = Math.max(longestStreak, currentRun)
    previousDate = currentDate
  }

  let currentStreak = 0
  const cursor = new Date(endDate)
  cursor.setHours(0, 0, 0, 0)

  while (countsByDay.has(toLocalDateKey(cursor))) {
    currentStreak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return { currentStreak, longestStreak }
}

export default function BlogHeatmap({ posts, embedded = false }: BlogHeatmapProps) {
  const allActiveDays = new Set(posts.map((post) => toLocalDateKey(post.date))).size
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const rangeStart = new Date(today)
  rangeStart.setMonth(rangeStart.getMonth() - MONTH_WINDOW)
  const startDate = getMonday(rangeStart)
  const totalDays = Math.floor((today.getTime() - startDate.getTime()) / DAY_MS) + 1
  const weekCount = Math.ceil(totalDays / 7)

  const countsByDay = new Map<string, number>()

  for (const post of posts) {
    const dateKey = toLocalDateKey(post.date)
    const postDate = new Date(`${dateKey}T00:00:00`)
    if (postDate >= startDate && postDate <= today) {
      countsByDay.set(dateKey, (countsByDay.get(dateKey) || 0) + 1)
    }
  }

  const allCounts = [...countsByDay.values()]
  const peakCount = Math.max(...allCounts, 0)
  const monthMarkers = getMonthMarkers(startDate, weekCount)
  const { currentStreak, longestStreak } = getStreaks(countsByDay, today)

  const weeks: HeatmapWeek[] = Array.from({ length: weekCount }, (_, weekIndex) => {
    const weekStart = addDays(startDate, weekIndex * 7)
    const cells = Array.from({ length: 7 }, (_, dayIndex) => {
      const currentDate = addDays(weekStart, dayIndex)
      const dateKey = toLocalDateKey(currentDate)
      const count = countsByDay.get(dateKey) || 0
      const isFuture = currentDate > today

      return {
        dateKey,
        count,
        level: isFuture ? 0 : getIntensity(count, peakCount),
        isFuture,
      }
    })

    return {
      startDate: weekStart,
      cells,
    }
  })

  const formatter = new Intl.DateTimeFormat('zh-CN', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div
      className={
        embedded
          ? 'space-y-3'
          : 'border-primary-100/90 rounded-[28px] border bg-white/90 p-5 shadow-[0_18px_45px_-30px_rgba(80,111,144,0.28)] backdrop-blur sm:p-7 dark:border-gray-800 dark:bg-gray-950/80'
      }
    >
      <div
        className={`flex flex-col gap-3 ${embedded ? '' : 'border-primary-100/90 border-b pb-5 dark:border-gray-800'} sm:flex-row sm:items-end sm:justify-between`}
      >
        <h2 className="text-[1.35rem] font-semibold tracking-[-0.03em] text-gray-950 dark:text-gray-100">
          更新热力图
        </h2>

        <div className="grid grid-cols-3 gap-2 text-left sm:max-w-[300px] sm:min-w-0">
          <div className="border-primary-100 bg-primary-50/80 rounded-xl border px-3 py-2 dark:border-gray-800 dark:bg-gray-900/80">
            <p className="text-[11px] tracking-[0.12em] text-gray-500 uppercase dark:text-gray-400">
              更新天数
            </p>
            <p className="mt-1 text-lg font-semibold text-gray-950 dark:text-gray-100">
              {allActiveDays}
            </p>
          </div>
          <div className="border-primary-100 bg-primary-50/80 rounded-xl border px-3 py-2 dark:border-gray-800 dark:bg-gray-900/80">
            <p className="text-[11px] tracking-[0.12em] text-gray-500 uppercase dark:text-gray-400">
              当前连续
            </p>
            <p className="mt-1 text-lg font-semibold text-gray-950 dark:text-gray-100">
              {currentStreak} 天
            </p>
          </div>
          <div className="border-primary-100 bg-primary-50/80 rounded-xl border px-3 py-2 dark:border-gray-800 dark:bg-gray-900/80">
            <p className="text-[11px] tracking-[0.12em] text-gray-500 uppercase dark:text-gray-400">
              最长连续
            </p>
            <p className="mt-1 text-lg font-semibold text-gray-950 dark:text-gray-100">
              {longestStreak} 天
            </p>
          </div>
        </div>
      </div>

      <div className={embedded ? 'overflow-x-auto' : 'mt-6 overflow-x-auto pb-2'}>
        <div className="min-w-[360px]">
          <div
            className="mb-2 ml-10 grid h-4 gap-1.5 text-[10px] text-gray-500 dark:text-gray-400"
            style={{ gridTemplateColumns: `repeat(${weekCount}, minmax(0, 1fr))` }}
          >
            {monthMarkers.map((marker) => (
              <span
                key={`${marker.label}-${marker.column}`}
                style={{ gridColumnStart: marker.column + 1 }}
                className="whitespace-nowrap"
              >
                {marker.label}
              </span>
            ))}
          </div>

          <div className="flex gap-3">
            <div className="grid w-7 grid-rows-7 gap-1.5 pt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
              {DAYS.map((day) => (
                <span key={day} className="flex h-3.5 items-center">
                  {day}
                </span>
              ))}
            </div>

            <div
              className="grid flex-1 gap-1.5"
              style={{ gridTemplateColumns: `repeat(${weekCount}, minmax(0, 1fr))` }}
            >
              {weeks.map((week, weekIndex) =>
                week.cells.map((cell, dayIndex) => {
                  const label =
                    cell.count > 0
                      ? `${formatter.format(new Date(`${cell.dateKey}T00:00:00`))} 更新了 ${cell.count} 篇`
                      : `${formatter.format(new Date(`${cell.dateKey}T00:00:00`))} 没有更新`

                  return (
                    <div
                      key={`${week.startDate.toISOString()}-${cell.dateKey}`}
                      title={label}
                      aria-label={label}
                      className={`h-3.5 rounded-sm border transition-transform duration-150 hover:-translate-y-0.5 ${getCellClassName(
                        cell.level,
                        cell.isFuture
                      )}`}
                      style={{
                        gridColumnStart: weekIndex + 1,
                        gridRowStart: dayIndex + 1,
                      }}
                    />
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`text-sm text-gray-500 dark:text-gray-400 ${embedded ? 'border-primary-100/90 border-t pt-3 dark:border-gray-800' : 'border-primary-100/90 mt-5 border-t pt-4 dark:border-gray-800'}`}
      >
        <p>{posts.length} 篇文章</p>
      </div>
    </div>
  )
}
