import { useParams, Link } from 'react-router-dom'
import { useGoals } from '../hooks/useGoals'
import { WallpaperPreview } from '../components/WallpaperPreview'

/**
 * Страница генерации обложки для телефона (placeholder).
 * Формат 1080x1920 в CSS (масштаб для экрана), чтобы можно было сделать скриншот.
 */
export function WallpaperPage() {
  const { id } = useParams<{ id: string }>()
  const [goals] = useGoals()

  const goal = goals.find((g) => g.id === id)
  if (!goal) {
    return (
      <div className="page">
        <p>Цель не найдена.</p>
        <Link to="/" className="btn btn-primary">
          На главную
        </Link>
      </div>
    )
  }

  return (
    <div className="page wallpaper-page">
      <header className="page-header">
        <Link to={`/goal/${goal.id}`} className="back-button back-button-icon" aria-label="Назад к цели">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="page-title">Обложка для телефона</h1>
        <p className="page-subtitle">
          Сделай скриншот этого экрана — получится обои с твоей мечтой!
        </p>
      </header>

      <main className="page-main wallpaper-main">
        {/* Реальный размер под скриншот — 1080x1920, отображаем масштабированно */}
        <div className="wallpaper-frame" style={{ width: 360, height: 640 }}>
          <WallpaperPreview goal={goal} phoneSize={true} />
        </div>
      </main>
    </div>
  )
}
