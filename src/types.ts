/** Периодичность пополнения */
export type PeriodType = 'day' | 'week' | 'month'

/** Одна финансовая цель (мечта) */
export interface Goal {
  id: string
  childName?: string // имя ребёнка (из онбординга)
  name: string
  cost: number
  saved: number
  period: PeriodType
  contribution: number
  photoUrl: string | null
  createdAt: string // ISO date
}

/** Результат расчёта: сколько периодов и дата достижения */
export interface CalculationResult {
  periodsNeeded: number
  targetDate: string // ISO date
  remaining: number
}
