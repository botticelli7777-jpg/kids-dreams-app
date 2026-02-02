import { useState, useRef } from 'react'
import type { Goal, PeriodType } from '../types'
import { calculateGoalProgress, formatPeriodLabel } from '../utils/calculations'

interface GoalFormProps {
  initial?: Goal | null
  onSubmit: (data: Omit<Goal, 'id' | 'createdAt'>) => void
  onCancel?: () => void
}

const PERIOD_OPTIONS: { value: PeriodType; label: string }[] = [
  { value: 'day', label: 'Каждый день' },
  { value: 'week', label: 'Каждую неделю' },
  { value: 'month', label: 'Каждый месяц' }
]

export function GoalForm({ initial, onSubmit, onCancel }: GoalFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [cost, setCost] = useState(initial?.cost ?? 0)
  const [saved, setSaved] = useState(initial?.saved ?? 0)
  const [period, setPeriod] = useState<PeriodType>(initial?.period ?? 'month')
  const [contribution, setContribution] = useState(initial?.contribution ?? 0)
  const [photoUrl, setPhotoUrl] = useState<string | null>(initial?.photoUrl ?? null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { periodsNeeded, targetDate, remaining } = calculateGoalProgress(
    cost,
    saved,
    contribution,
    period
  )
  const periodLabel = formatPeriodLabel(period)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPhotoUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({
      name: name.trim(),
      cost: Math.max(0, cost),
      saved: Math.max(0, Math.min(saved, cost)),
      period,
      contribution: Math.max(0, contribution),
      photoUrl
    })
  }

  const formatDate = (d: Date) =>
    d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <form onSubmit={handleSubmit} className="goal-form">
      <div className="form-group">
        <label htmlFor="name">Название мечты</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Например: новый велосипед"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="cost">Стоимость мечты (₽)</label>
        <input
          id="cost"
          type="number"
          min={0}
          value={cost || ''}
          onChange={(e) => setCost(Number(e.target.value) || 0)}
          placeholder="0"
        />
      </div>

      <div className="form-group">
        <label htmlFor="saved">Уже накоплено (₽)</label>
        <input
          id="saved"
          type="number"
          min={0}
          value={saved || ''}
          onChange={(e) => setSaved(Number(e.target.value) || 0)}
          placeholder="0"
        />
      </div>

      <div className="form-group">
        <label htmlFor="period">Периодичность пополнения</label>
        <select
          id="period"
          value={period}
          onChange={(e) => setPeriod(e.target.value as PeriodType)}
        >
          {PERIOD_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="contribution">Сколько откладывать (₽)</label>
        <input
          id="contribution"
          type="number"
          min={0}
          value={contribution || ''}
          onChange={(e) => setContribution(Number(e.target.value) || 0)}
          placeholder="0"
        />
      </div>

      <div className="form-group">
        <label>Фото мечты</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="file-input"
        />
        {photoUrl && (
          <div className="photo-preview">
            <img src={photoUrl} alt="Мечта" />
            <button
              type="button"
              className="link-button"
              onClick={() => setPhotoUrl(null)}
            >
              Удалить фото
            </button>
          </div>
        )}
      </div>

      {contribution > 0 && remaining > 0 && (
        <div className="calculation-preview">
          <p className="calculation-text">
            Если ты будешь откладывать <strong>{contribution.toLocaleString('ru-RU')} ₽</strong>{' '}
            в {periodLabel}, то достигнешь цели примерно к{' '}
            <strong>{formatDate(targetDate)}</strong>.
          </p>
          <p className="calculation-sub">
            Понадобится примерно {periodsNeeded} {period === 'month' ? 'месяцев' : period === 'week' ? 'недель' : 'дней'}.
          </p>
        </div>
      )}

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Отмена
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          {initial ? 'Сохранить' : 'Создать мечту'}
        </button>
      </div>
    </form>
  )
}
