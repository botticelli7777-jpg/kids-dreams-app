import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useGoals } from '../hooks/useGoals'
import { GoalProgress } from '../components/GoalProgress'
import { ProModal } from '../components/ProModal'
import { IS_PRO } from '../constants'
import { createPortal } from 'react-dom'

export function GoalDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [goals, setGoals] = useGoals()
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [proModalOpen, setProModalOpen] = useState(false)
  const [addAmount, setAddAmount] = useState('')
  const [motivationMessage, setMotivationMessage] = useState<string | null>(null)

  const goal = goals.find((g) => g.id === id)
  const canAddGoal = IS_PRO ? true : goals.length < 1

  if (!goal) {
    return (
      <div className="page">
        <p>Цель не найдена.</p>
        <button type="button" className="btn btn-primary" onClick={() => navigate('/')}>
          На главную
        </button>
      </div>
    )
  }

  const handleAddNewGoal = () => {
    if (!canAddGoal) {
      setProModalOpen(true)
      return
    }
    navigate('/goal/new')
  }

  const handleAddContribution = () => {
    const amount = Number(addAmount) || 0
    if (amount <= 0) return
    const newSaved = Math.min(goal.cost, goal.saved + amount)
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goal.id ? { ...g, saved: newSaved } : g
      )
    )
    setAddAmount('')
    setAddModalOpen(false)
    if (newSaved >= goal.cost) {
      setMotivationMessage('Ты достиг цели! Мечта сбылась! 🎉')
    } else {
      setMotivationMessage('Молодец! Так держать — ты ещё на шаг ближе к мечте! 💪')
      setTimeout(() => setMotivationMessage(null), 4000)
    }
  }

  return (
    <div className="page detail-page">
      <header className="page-header page-header-icons">
        <button
          type="button"
          className="back-button back-button-icon"
          onClick={() => navigate('/')}
          aria-label="На главную"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="page-title">{goal.name}</h1>
        <div className="header-icons">
          <Link
            to={`/wallpaper/${goal.id}`}
            className="header-icon-btn"
            aria-label="Сделать обложку для телефона"
          >
            <span className="header-icon" aria-hidden>🖼</span>
          </Link>
          <button
            type="button"
            className="header-icon-btn header-plus"
            onClick={handleAddNewGoal}
            aria-label="Добавить новую мечту"
          >
            +
          </button>
        </div>
      </header>

      <main className="page-main">
        {goal.photoUrl ? (
          <div className="detail-photo">
            <img src={goal.photoUrl} alt={goal.name} />
          </div>
        ) : (
          <div className="detail-photo placeholder">📷</div>
        )}

        <div className="detail-content">
          <GoalProgress goal={goal} showCalculation={true} />
        </div>

        <div className="detail-add-wrap">
          <button
            type="button"
            className="detail-add-contribution"
            onClick={() => setAddModalOpen(true)}
            aria-label="Добавить пополнение"
          >
            <span className="detail-add-icon">+</span>
          </button>
        </div>
      </main>

      <ProModal isOpen={proModalOpen} onClose={() => setProModalOpen(false)} />

      {addModalOpen &&
        createPortal(
          <div
            className="modal-backdrop"
            onClick={() => setAddModalOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">Добавить пополнение</h3>
              <p className="modal-text">Введи сумму, которую ты отложил(а):</p>
              <div className="modal-input-wrap">
                <input
                  type="number"
                  min={1}
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  placeholder="0"
                  className="modal-input"
                  autoFocus
                />
                <span className="wizard-currency">₽</span>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setAddModalOpen(false)}
                >
                  Отмена
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddContribution}
                  disabled={!addAmount || Number(addAmount) <= 0}
                >
                  Добавить
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {motivationMessage &&
        createPortal(
          <div
            className="motivation-toast"
            role="status"
            onClick={() => setMotivationMessage(null)}
          >
            {motivationMessage}
          </div>,
          document.body
        )}
    </div>
  )
}
