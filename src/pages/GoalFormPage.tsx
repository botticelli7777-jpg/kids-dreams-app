import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useGoals } from '../hooks/useGoals'
import { IS_PRO, STORAGE_KEY } from '../constants'
import { GoalForm } from '../components/GoalForm'
import { GoalWizard, type WizardData } from '../components/GoalWizard'
import { ProModal } from '../components/ProModal'
import { useState, useMemo } from 'react'
import type { Goal } from '../types'

function generateId() {
  return `goal-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function GoalFormPage() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { id } = useParams<{ id: string }>()
  const [goals, setGoals] = useGoals()
  const [proModalOpen, setProModalOpen] = useState(false)

  const isNew = pathname === '/goal/new'
  const initial = useMemo(
    () => (isNew ? null : goals.find((g) => g.id === id) ?? null),
    [isNew, id, goals]
  )

  const canAdd = IS_PRO ? true : goals.length < 1
  const isEdit = !isNew && initial

  const handleWizardComplete = (data: WizardData) => {
    if (!canAdd) {
      setProModalOpen(true)
      return
    }
    const goal: Goal = {
      id: generateId(),
      childName: data.name.trim() || undefined,
      name: data.goalTitle.trim(),
      cost: data.targetAmount,
      saved: data.currentAmount,
      period: data.frequency,
      contribution: data.contribution,
      photoUrl: data.photoUrl,
      createdAt: new Date().toISOString()
    }
    const nextGoals = [...goals, goal]
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextGoals))
    } catch {
      // ignore
    }
    setGoals(nextGoals)
    navigate('/', { state: { justCreated: true } })
  }

  const handleFormSubmit = (data: Omit<Goal, 'id' | 'createdAt'>) => {
    if (!isNew && initial) {
      setGoals((prev) =>
        prev.map((g) =>
          g.id === initial.id
            ? { ...data, id: g.id, createdAt: g.createdAt }
            : g
        )
      )
      navigate(`/goal/${initial.id}`)
      return
    }
    if (!canAdd) {
      setProModalOpen(true)
      return
    }
    const goal: Goal = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString()
    }
    setGoals((prev) => [...prev, goal])
    navigate('/')
  }

  const handleCancel = () => {
    if (initial) navigate(`/goal/${initial.id}`)
    else navigate('/')
  }

  if (isNew) {
    return (
      <div className="page form-page wizard-page">
        <header className="page-header">
          <button
            type="button"
            className="back-button back-button-icon"
            onClick={() => navigate('/')}
            aria-label="Назад"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        </header>
        <main className="page-main">
          <GoalWizard
            onComplete={handleWizardComplete}
            onCancel={handleCancel}
            skipNameStep={isNew && goals.length > 0}
            initialName={goals.length > 0 ? (goals[0].childName ?? '') : ''}
          />
        </main>
        <ProModal isOpen={proModalOpen} onClose={() => setProModalOpen(false)} />
      </div>
    )
  }

  return (
    <div className="page form-page">
      <header className="page-header">
        <button
          type="button"
          className="back-button back-button-icon"
          onClick={handleCancel}
          aria-label="Назад"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="page-title">
          {isEdit ? 'Редактировать мечту' : 'Новая мечта'}
        </h1>
      </header>

      <main className="page-main">
        <GoalForm
          initial={initial}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      </main>

      <ProModal isOpen={proModalOpen} onClose={() => setProModalOpen(false)} />
    </div>
  )
}
