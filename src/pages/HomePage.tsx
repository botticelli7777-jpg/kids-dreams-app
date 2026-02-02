import { createPortal } from 'react-dom'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useGoals } from '../hooks/useGoals'
import { IS_PRO } from '../constants'
import { GoalsCarousel } from '../components/GoalsCarousel'
import { ProModal } from '../components/ProModal'
import { useState, useEffect } from 'react'

export function HomePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [goals] = useGoals()
  const [proModalOpen, setProModalOpen] = useState(false)
  const [showCongrats, setShowCongrats] = useState(false)

  const canAddGoal = IS_PRO ? true : goals.length < 1
  const firstName = goals.length > 0 ? goals[0].childName?.trim() : null

  useEffect(() => {
    const justCreated = (location.state as { justCreated?: boolean })?.justCreated
    if (justCreated) {
      setShowCongrats(true)
      const t = setTimeout(() => setShowCongrats(false), 5000)
      navigate(location.pathname, { replace: true, state: {} })
      return () => clearTimeout(t)
    }
  }, [(location.state as { justCreated?: boolean })?.justCreated])

  const handleAddGoal = () => {
    if (!canAddGoal) {
      setProModalOpen(true)
      return
    }
    navigate('/goal/new')
  }

  return (
    <div className="page home-page">
      <header className="page-header page-header-with-plus">
        <h1 className="app-title">
          {goals.length === 0 ? 'Привет! Давай копить на твою мечту!' : 'Моя мечта'}
        </h1>
        {goals.length > 0 && (
          <button
            type="button"
            className="header-plus"
            onClick={handleAddGoal}
            aria-label="Добавить мечту"
          >
            +
          </button>
        )}
      </header>

      <main className="page-main">
        {goals.length === 0 ? (
          <div className="empty-state empty-state-kid">
            <div className="empty-state-illustration" aria-hidden>🌟</div>
            <p className="empty-state-lead">Создай свою первую мечту и начни копить!</p>
            <Link to="/goal/new" className="btn btn-primary btn-large">
              Добавить мечту
            </Link>
          </div>
        ) : (
          <>
            {firstName && (
              <p className="home-welcome">Привет, {firstName}! Вот твоя мечта.</p>
            )}
            <GoalsCarousel goals={goals} />
          </>
        )}
      </main>

      {showCongrats &&
        createPortal(
          <div className="congrats-toast kid-toast" role="status">
            Класс! Теперь у тебя есть цель, и ты начинаешь путь к своей мечте. 🌟
          </div>,
          document.body
        )}

      <ProModal isOpen={proModalOpen} onClose={() => setProModalOpen(false)} />
    </div>
  )
}
