import type { Goal } from '../types'

interface WallpaperPreviewProps {
  goal: Goal
  /** Размер под экран телефона (1080x1920) */
  phoneSize?: boolean
}

/**
 * Компонент для генерации обложки/обоев: фото мечты + текст "Моя мечта: [название]" + прогресс %.
 * В формате вертикального телефона (1080x1920 px) для скриншота.
 */
export function WallpaperPreview({ goal, phoneSize = true }: WallpaperPreviewProps) {
  const percent =
    goal.cost > 0 ? Math.min(100, Math.round((goal.saved / goal.cost) * 100)) : 0

  return (
    <div className={`wallpaper-preview ${phoneSize ? 'wallpaper-phone' : ''}`}>
      <div className="wallpaper-image">
        {goal.photoUrl ? (
          <img src={goal.photoUrl} alt={goal.name} />
        ) : (
          <div className="wallpaper-placeholder">📷 Мечта</div>
        )}
      </div>
      <div className="wallpaper-overlay">
        <p className="wallpaper-title">Моя мечта: {goal.name}</p>
        <p className="wallpaper-progress">Прогресс: {percent}%</p>
        <div className="wallpaper-bar-wrap">
          <div className="wallpaper-bar-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>
    </div>
  )
}
