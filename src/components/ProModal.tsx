import { createPortal } from 'react-dom'

interface ProModalProps {
  isOpen: boolean
  onClose: () => void
}

const MESSAGE =
  'Пока можно создать только одну мечту. Хочешь копить на несколько мечт сразу и делать красивые обложки для телефона? Тогда тебе подойдёт PRO‑версия!'

export function ProModal({ isOpen, onClose }: ProModalProps) {
  if (!isOpen) return null

  const content = (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-box modal-box-kid" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Ещё мечты — в PRO</h3>
        <p className="modal-text">{MESSAGE}</p>
        <button type="button" className="btn btn-primary" onClick={onClose}>
          Понятно
        </button>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}
