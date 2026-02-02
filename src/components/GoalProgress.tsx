import type { Goal } from '../types'
import { calculateGoalProgress } from '../utils/calculations'

interface GoalProgressProps {
  goal: Goal
  showCalculation?: boolean
  compact?: boolean
}

export function GoalProgress({ goal, showCalculation = true, compact = false }: GoalProgressProps) {
  const { cost, saved, period, contribution } = goal
  const percent = cost > 0 ? Math.min(100, Math.round((saved / cost) * 100)) : 0
  const remaining = Math.max(0, cost - saved)
  const savedPercent = cost > 0 ? (saved / cost) * 100 : 0
  const remainingPercent = cost > 0 ? (remaining / cost) * 100 : 100
  const { periodsNeeded, targetDate } = calculateGoalProgress(
    cost,
    saved,
    contribution,
    period
  )

  const formatDate = (d: Date) =>
    d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

  if (compact) {
    return (
      <div className="goal-progress goal-progress-compact">
        <div className="progress-bar-wrap">
          <div
            className="progress-bar-fill"
            style={{ width: `${percent}%` }}
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <p className="progress-text">
          {saved.toLocaleString('ru-RU')} из {cost.toLocaleString('ru-RU')} ₽ ({percent}%) — так держать!
        </p>
      </div>
    )
  }

  return (
    <div className="goal-progress">
      <div className="progress-charts">
        <div
          className="progress-circle"
          style={{
            background: `conic-gradient(#4f46e5 0% ${percent}%, #e2e8f0 ${percent}% 100%)`
          }}
          aria-hidden
        >
          <div className="progress-circle-inner">
            <span className="progress-circle-value">{percent}%</span>
          </div>
        </div>

        <div className="progress-stacked-bar">
          <div
            className="progress-stacked-saved"
            style={{ width: `${savedPercent}%` }}
          />
          <div
            className="progress-stacked-remaining"
            style={{ width: `${remainingPercent}%` }}
          />
          <span className="progress-stacked-label">
            Накоплено {saved.toLocaleString('ru-RU')} из {cost.toLocaleString('ru-RU')} ₽
          </span>
        </div>
        {remaining > 0 && (
          <p className="progress-remaining-under">
            Осталось накопить {remaining.toLocaleString('ru-RU')} ₽
          </p>
        )}
        {remaining > 0 && (
          <p className="progress-inspiring">
            Ещё чуть-чуть, и ты станешь ближе к своей мечте!
          </p>
        )}
      </div>

      {showCalculation && contribution > 0 && remaining > 0 && (
        <div className="calculation-block">
          <p className="calculation-single">
            Добавь ещё немного — продолжай копить ещё <strong>{periodsNeeded} {period === 'month' ? 'месяцев' : period === 'week' ? 'недель' : 'дней'}</strong> до <strong>{formatDate(targetDate)}</strong>, и ты достигнешь цели!
          </p>
        </div>
      )}
    </div>
  )
}
