// Birth-date computation helpers

export interface BirthInput {
  date: Date // full timestamp (includes time-of-day)
  timeGiven: boolean
  name: string
}

export interface WesternZodiac {
  name: string
  symbol: string
  range: string
  element: string
}

const ZODIAC: { name: string; symbol: string; element: string; start: [number, number]; end: [number, number] }[] = [
  { name: 'Capricorn', symbol: '♑', element: 'Earth', start: [12, 22], end: [1, 19] },
  { name: 'Aquarius', symbol: '♒', element: 'Air', start: [1, 20], end: [2, 18] },
  { name: 'Pisces', symbol: '♓', element: 'Water', start: [2, 19], end: [3, 20] },
  { name: 'Aries', symbol: '♈', element: 'Fire', start: [3, 21], end: [4, 19] },
  { name: 'Taurus', symbol: '♉', element: 'Earth', start: [4, 20], end: [5, 20] },
  { name: 'Gemini', symbol: '♊', element: 'Air', start: [5, 21], end: [6, 20] },
  { name: 'Cancer', symbol: '♋', element: 'Water', start: [6, 21], end: [7, 22] },
  { name: 'Leo', symbol: '♌', element: 'Fire', start: [7, 23], end: [8, 22] },
  { name: 'Virgo', symbol: '♍', element: 'Earth', start: [8, 23], end: [9, 22] },
  { name: 'Libra', symbol: '♎', element: 'Air', start: [9, 23], end: [10, 22] },
  { name: 'Scorpio', symbol: '♏', element: 'Water', start: [10, 23], end: [11, 21] },
  { name: 'Sagittarius', symbol: '♐', element: 'Fire', start: [11, 22], end: [12, 21] },
]

export function westernZodiac(month: number, day: number): WesternZodiac {
  for (const z of ZODIAC) {
    const [sm, sd] = z.start
    const [em, ed] = z.end
    const inRange =
      sm === em
        ? month === sm && day >= sd && day <= ed
        : (month === sm && day >= sd) || (month === em && day <= ed)
    if (inRange) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return { name: z.name, symbol: z.symbol, element: z.element, range: `${months[sm - 1]} ${sd} – ${months[em - 1]} ${ed}` }
    }
  }
  return { name: 'Capricorn', symbol: '♑', element: 'Earth', range: 'Dec 22 – Jan 19' }
}

const ANIMALS = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig']
const ANIMAL_CHARS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
const ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water']

export function chineseZodiac(year: number): { animal: string; char: string; element: string } {
  const idx = (((year - 4) % 12) + 12) % 12
  const el = ELEMENTS[Math.floor(((((year - 4) % 10) + 10) % 10) / 2)]
  return { animal: ANIMALS[idx], char: ANIMAL_CHARS[idx], element: el }
}

const BIRTHSTONES = [
  { month: 'January', stone: 'Garnet', meaning: 'protection & devotion' },
  { month: 'February', stone: 'Amethyst', meaning: 'clarity & calm' },
  { month: 'March', stone: 'Aquamarine', meaning: 'courage & serenity' },
  { month: 'April', stone: 'Diamond', meaning: 'strength & eternity' },
  { month: 'May', stone: 'Emerald', meaning: 'rebirth & love' },
  { month: 'June', stone: 'Pearl', meaning: 'purity & wisdom' },
  { month: 'July', stone: 'Ruby', meaning: 'passion & vitality' },
  { month: 'August', stone: 'Peridot', meaning: 'light & renewal' },
  { month: 'September', stone: 'Sapphire', meaning: 'truth & loyalty' },
  { month: 'October', stone: 'Opal', meaning: 'hope & creativity' },
  { month: 'November', stone: 'Topaz', meaning: 'warmth & fortune' },
  { month: 'December', stone: 'Turquoise', meaning: 'luck & friendship' },
]

const FLOWERS = [
  'Carnation', 'Violet', 'Daffodil', 'Daisy', 'Lily of the Valley', 'Rose',
  'Larkspur', 'Gladiolus', 'Aster', 'Marigold', 'Chrysanthemum', 'Poinsettia',
]

export function birthstone(month: number) {
  return BIRTHSTONES[month - 1]
}
export function birthFlower(month: number) {
  return FLOWERS[month - 1]
}

// --- Moon phase ---
// Reference new moon: 2000-01-06 18:14 UTC
const SYNODIC = 29.530588853
const REF_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14)

export function moonPhase(d: Date): { name: string; age: number; illumination: number } {
  const days = (d.getTime() - REF_NEW_MOON) / 86400000
  const age = ((days % SYNODIC) + SYNODIC) % SYNODIC
  const frac = age / SYNODIC
  const names: [number, string][] = [
    [0.0339, 'New Moon'], [0.2161, 'Waxing Crescent'], [0.2839, 'First Quarter'],
    [0.4661, 'Waxing Gibbous'], [0.5339, 'Full Moon'], [0.7161, 'Waning Gibbous'],
    [0.7839, 'Last Quarter'], [0.9661, 'Waning Crescent'], [1.0, 'New Moon'],
  ]
  const name = names.find(([limit]) => frac <= limit)?.[1] ?? 'New Moon'
  const illumination = (1 - Math.cos(2 * Math.PI * frac)) / 2
  return { name, age, illumination }
}

// --- Age math ---
export interface AgeParts {
  years: number; months: number; days: number
  hours: number; minutes: number; seconds: number
  totalDays: number; totalHours: number; totalMinutes: number; totalSeconds: number
  totalWeeks: number
}

export function computeAge(birth: Date, now: Date): AgeParts {
  let y = now.getFullYear() - birth.getFullYear()
  let m = now.getMonth() - birth.getMonth()
  let d = now.getDate() - birth.getDate()
  if (d < 0) {
    m--
    d += new Date(now.getFullYear(), now.getMonth(), 0).getDate()
  }
  if (m < 0) {
    y--
    m += 12
  }
  const anchor = new Date(birth.getTime())
  anchor.setFullYear(anchor.getFullYear() + y)
  anchor.setMonth(anchor.getMonth() + m)
  anchor.setDate(anchor.getDate() + d)
  let rem = Math.max(0, now.getTime() - anchor.getTime())
  const hours = Math.floor(rem / 3600000); rem -= hours * 3600000
  const minutes = Math.floor(rem / 60000); rem -= minutes * 60000
  const seconds = Math.floor(rem / 1000)

  const totalMs = Math.max(0, now.getTime() - birth.getTime())
  const totalSeconds = Math.floor(totalMs / 1000)
  return {
    years: y, months: m, days: d, hours, minutes, seconds,
    totalSeconds,
    totalMinutes: Math.floor(totalSeconds / 60),
    totalHours: Math.floor(totalSeconds / 3600),
    totalDays: Math.floor(totalMs / 86400000),
    totalWeeks: Math.floor(totalMs / 604800000),
  }
}

export function nextBirthday(birth: Date, now: Date): { date: Date; daysUntil: number; turningAge: number } {
  const thisYear = new Date(now.getFullYear(), birth.getMonth(), birth.getDate(), birth.getHours(), birth.getMinutes(), birth.getSeconds())
  const target = thisYear.getTime() > now.getTime()
    ? thisYear
    : new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate(), birth.getHours(), birth.getMinutes(), birth.getSeconds())
  return {
    date: target,
    daysUntil: Math.ceil((target.getTime() - now.getTime()) / 86400000),
    turningAge: target.getFullYear() - birth.getFullYear(),
  }
}

export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export function formatLong(d: Date): string {
  return `${WEEKDAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

export function formatTime(d: Date): string {
  const h = d.getHours()
  const m = d.getMinutes().toString().padStart(2, '0')
  const ap = h >= 12 ? 'PM' : 'AM'
  const hh = h % 12 === 0 ? 12 : h % 12
  return `${hh}:${m} ${ap}`
}

export function commas(n: number): string {
  return n.toLocaleString('en-US')
}
