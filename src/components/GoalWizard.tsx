import { useState, useRef } from 'react'
import type { PeriodType } from '../types'

/** Один вопрос на экран; дружелюбные формулировки для ребёнка. */
const STEPS = [
  { question: 'Как тебя зовут? Я хочу обращаться к тебе по имени.', field: 'name' as const },
  { question: 'О какой мечте ты сейчас думаешь? Напиши её название.', field: 'goalTitle' as const },
  { question: 'Сколько нужно денег, чтобы твоя мечта сбылась?', field: 'targetAmount' as const },
  { question: 'Сколько денег у тебя уже есть в копилке?', field: 'currentAmount' as const },
  { question: 'Сколько рублей ты хочешь откладывать каждую неделю?', field: 'savingsPlan' as const },
  { question: 'Загрузи картинку своей мечты (это может быть фото или картинка из интернета).', field: 'photo' as const }
] as const

export interface WizardData {
  name: string
  goalTitle: string
  targetAmount: number
  currentAmount: number
  frequency: PeriodType
  contribution: number
  photoUrl: string | null
}

const initialWizardData: WizardData = {
  name: '',
  goalTitle: '',
  targetAmount: 0,
  currentAmount: 0,
  frequency: 'week',
  contribution: 0,
  photoUrl: null
}

interface GoalWizardProps {
  onComplete: (data: WizardData) => void
  onCancel: () => void
  /** Пропустить шаг «Как тебя зовут?» (при добавлении второй и следующих мечт) */
  skipNameStep?: boolean
  /** Имя подставить из первой мечты */
  initialName?: string
}

const STEPS_WITHOUT_NAME = STEPS.slice(1)

/**
 * Многошаговая форма (wizard): один вопрос на экран.
 * Если skipNameStep — начинаем с «Название мечты», имя не спрашиваем.
 */
export function GoalWizard({ onComplete, onCancel, skipNameStep = false, initialName = '' }: GoalWizardProps) {
  const stepsToUse = skipNameStep ? STEPS_WITHOUT_NAME : STEPS
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<WizardData>(() =>
    skipNameStep ? { ...initialWizardData, name: initialName } : initialWizardData
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const step = stepsToUse[currentStep]
  const isFirst = currentStep === 0
  const isLast = currentStep === stepsToUse.length - 1

  const update = (key: keyof WizardData, value: string | number | null) => {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => update('photoUrl', reader.result as string)
    reader.readAsDataURL(file)
  }

  const goNext = () => {
    if (isLast) {
      onComplete(data)
    } else {
      setCurrentStep((s) => s + 1)
    }
  }

  const goBack = () => {
    if (isFirst) return
    setCurrentStep((s) => s - 1)
  }

  const canProceed = () => {
    switch (step.field) {
      case 'name':
        return data.name.trim().length > 0
      case 'goalTitle':
        return data.goalTitle.trim().length > 0
      case 'targetAmount':
        return data.targetAmount > 0
      case 'currentAmount':
        return data.currentAmount >= 0
      case 'savingsPlan':
        return data.contribution >= 0
      case 'photo':
        return true
      default:
        return false
    }
  }

  return (
    <div className="goal-wizard">
      <div className="wizard-progress">
        <div
          className="wizard-progress-fill"
          style={{ width: `${((currentStep + 1) / stepsToUse.length) * 100}%` }}
        />
      </div>

      <div className="wizard-step" key={currentStep}>
        <h2 className="wizard-question">{step.question}</h2>

        {step.field === 'name' && (
          <input
            type="text"
            className="wizard-input"
            value={data.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Твоё имя"
            autoFocus
          />
        )}

        {step.field === 'goalTitle' && (
          <input
            type="text"
            className="wizard-input"
            value={data.goalTitle}
            onChange={(e) => update('goalTitle', e.target.value)}
            placeholder="новый велосипед"
            autoFocus
          />
        )}

        {step.field === 'targetAmount' && (
          <div className="wizard-input-wrap">
            <input
              type="number"
              className="wizard-input"
              min={0}
              value={data.targetAmount || ''}
              onChange={(e) => update('targetAmount', Number(e.target.value) || 0)}
              placeholder="0"
              autoFocus
            />
            <span className="wizard-currency">₽</span>
          </div>
        )}

        {step.field === 'currentAmount' && (
          <div className="wizard-input-wrap">
            <input
              type="number"
              className="wizard-input"
              min={0}
              value={data.currentAmount || ''}
              onChange={(e) => update('currentAmount', Number(e.target.value) || 0)}
              placeholder="0"
              autoFocus
            />
            <span className="wizard-currency">₽</span>
          </div>
        )}

        {step.field === 'savingsPlan' && (
          <div className="wizard-input-wrap">
            <input
              type="number"
              className="wizard-input"
              min={0}
              value={data.contribution || ''}
              onChange={(e) => update('contribution', Number(e.target.value) || 0)}
              placeholder="Сколько рублей"
              autoFocus
            />
            <span className="wizard-currency">₽</span>
          </div>
        )}

        {step.field === 'photo' && (
          <div className="wizard-photo">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="wizard-file-input"
            />
            {data.photoUrl ? (
              <div className="wizard-photo-preview">
                <img src={data.photoUrl} alt="Мечта" />
                <button
                  type="button"
                  className="link-button"
                  onClick={() => update('photoUrl', null)}
                >
                  Удалить фото
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                Выбрать фото
              </button>
            )}
          </div>
        )}
      </div>

      <div className="wizard-actions">
        {!isFirst && (
          <button type="button" className="btn btn-secondary" onClick={goBack}>
            Назад
          </button>
        )}
        {isFirst && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Отмена
          </button>
        )}
        <button
          type="button"
          className="btn btn-primary"
          onClick={goNext}
          disabled={!canProceed() && step.field !== 'photo' && step.field !== 'savingsPlan'}
        >
          {isLast ? 'Готово! Создать мечту' : 'Дальше'}
        </button>
      </div>
    </div>
  )
}
