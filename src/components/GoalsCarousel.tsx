import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Goal } from '../types'
import { GoalProgress } from './GoalProgress'

interface GoalsCarouselProps {
  goals: Goal[]
}

/**
 * Горизонтальная карусель мечт — перелистывание как в переключателе приложений на iPhone.
 * Одна карточка в фокусе, по бокам виден край следующей/предыдущей.
 */
/** Сначала мечты в процессе, потом выполненные (100%) */
function sortGoals(goals: Goal[]): Goal[] {
  return [...goals].sort((a, b) => {
    const aDone = a.saved >= a.cost ? 1 : 0
    const bDone = b.saved >= b.cost ? 1 : 0
    return aDone - bDone
  })
}

export function GoalsCarousel({ goals }: GoalsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const sortedGoals = sortGoals(goals)

  useEffect(() => {
    const el = scrollRef.current
    if (!el || goals.length === 0) return

    const handleScroll = () => {
      const { scrollLeft, offsetWidth } = el
      const cardWidth = el.querySelector('.goal-carousel-card')?.getBoundingClientRect().width ?? offsetWidth
      const gap = 16
      const index = Math.round(scrollLeft / (cardWidth + gap))
      setActiveIndex(Math.min(index, goals.length - 1))
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [sortedGoals.length])

  if (sortedGoals.length === 0) return null

  return (
    <div className="goals-carousel">
      <div
        ref={scrollRef}
        className="goals-carousel-track"
        role="region"
        aria-label="Мечты, перелистни влево или вправо"
      >
        {sortedGoals.map((goal) => {
          const isCompleted = goal.saved >= goal.cost
          return (
            <div key={goal.id} className="goal-carousel-card-wrap">
              <Link
                to={`/goal/${goal.id}`}
                className={`goal-carousel-card ${isCompleted ? 'is-completed' : ''}`}
              >
                {isCompleted && (
                  <div className="goal-carousel-badge">Выполнено ✓</div>
                )}
                {goal.photoUrl ? (
                  <div className="goal-carousel-image">
                    <img src={goal.photoUrl} alt={goal.name} />
                  </div>
                ) : (
                  <div className="goal-carousel-placeholder">📷</div>
                )}
                <div className="goal-carousel-content">
                  <h2 className="goal-carousel-title">{goal.name}</h2>
                  <GoalProgress goal={goal} showCalculation={false} compact />
                </div>
              </Link>
            </div>
          )
        })}
      </div>

      {sortedGoals.length > 1 && (
        <div className="goals-carousel-dots" role="tablist" aria-label="Выбор мечты">
          {sortedGoals.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Мечта ${i + 1}`}
              className={`goals-carousel-dot ${i === activeIndex ? 'is-active' : ''}`}
              onClick={() => {
                const el = scrollRef.current
                if (!el) return
                const card = el.querySelectorAll('.goal-carousel-card-wrap')[i] as HTMLElement
                card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
