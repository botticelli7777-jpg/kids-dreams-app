import { Link } from 'react-router-dom'
import type { Goal } from '../types'
import { GoalProgress } from './GoalProgress'

interface GoalsListProps {
  goals: Goal[]
}

/** Список карточек целей. В бесплатной версии показывается одна цель, в PRO — несколько. */
export function GoalsList({ goals }: GoalsListProps) {
  if (goals.length === 0) return null

  return (
    <ul className="goals-list">
      {goals.map((goal) => (
        <li key={goal.id} className="goal-card">
          <Link to={`/goal/${goal.id}`} className="goal-card-link">
            {goal.photoUrl ? (
              <div className="goal-card-image">
                <img src={goal.photoUrl} alt={goal.name} />
              </div>
            ) : (
              <div className="goal-card-placeholder">📷</div>
            )}
            <div className="goal-card-content">
              <h2 className="goal-card-title">{goal.name}</h2>
              <GoalProgress goal={goal} showCalculation={false} compact />
            </div>
          </Link>
          <Link to={`/goal/${goal.id}/edit`} className="goal-card-edit" aria-label="Редактировать">
            ✏️
          </Link>
        </li>
      ))}
    </ul>
  )
}
