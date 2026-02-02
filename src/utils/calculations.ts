import type { PeriodType } from '../types'

/**
 * Рассчитывает, через сколько периодов и к какой дате будет достигнута цель.
 * @param cost — стоимость цели (₽)
 * @param saved — уже накоплено (₽)
 * @param contribution — размер регулярного взноса (₽)
 * @param period — период: день / неделя / месяц
 * @returns количество периодов и примерная дата достижения цели
 */
export function calculateGoalProgress(
  cost: number,
  saved: number,
  contribution: number,
  period: PeriodType
): { periodsNeeded: number; targetDate: Date; remaining: number } {
  const remaining = Math.max(0, cost - saved)
  if (remaining <= 0 || contribution <= 0) {
    return {
      periodsNeeded: 0,
      targetDate: new Date(),
      remaining: 0
    }
  }
  const periodsNeeded = Math.ceil(remaining / contribution)
  const targetDate = addPeriods(new Date(), period, periodsNeeded)
  return { periodsNeeded, targetDate, remaining }
}

/** Добавляет N периодов (дней/недель/месяцев) к дате */
function addPeriods(date: Date, period: PeriodType, count: number): Date {
  const result = new Date(date)
  switch (period) {
    case 'day':
      result.setDate(result.getDate() + count)
      break
    case 'week':
      result.setDate(result.getDate() + count * 7)
      break
    case 'month':
      result.setMonth(result.getMonth() + count)
      break
  }
  return result
}

/** Форматирует период для отображения (родительный падеж) */
export function formatPeriodLabel(period: PeriodType): string {
  switch (period) {
    case 'day':
      return 'день'
    case 'week':
      return 'неделю'
    case 'month':
      return 'месяц'
  }
}
