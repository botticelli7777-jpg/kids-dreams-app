import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { GoalFormPage } from './pages/GoalFormPage'
import { GoalDetailPage } from './pages/GoalDetailPage'
import { WallpaperPage } from './pages/WallpaperPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/goal/new" element={<GoalFormPage />} />
      <Route path="/goal/:id/edit" element={<GoalFormPage />} />
      <Route path="/goal/:id" element={<GoalDetailPage />} />
      <Route path="/wallpaper/:id" element={<WallpaperPage />} />
    </Routes>
  )
}
