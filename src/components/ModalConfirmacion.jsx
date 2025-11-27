import './ModalConfirmacion.css'

function ModalConfirmacion({
  abierto,
  titulo,
  mensaje,
  tipo = 'info',
  onConfirm,
  onCancel,
  onClose,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  okText = 'Ok'
}) {
  if (!abierto) return null

  const handleClose = () => {
    if (onClose) onClose()
  }

  const handleCancel = () => {
    if (onCancel) onCancel()
    handleClose()
  }

  const handleConfirm = () => {
    if (onConfirm) onConfirm()
    if (tipo === 'info') {
      handleClose()
    }
  }

  const renderButtons = () => {
    if (tipo === 'confirm') {
      return (
        <>
          <button className="modal-confirm-btn ghost" onClick={handleCancel}>
            {cancelText || 'Cancelar'}
          </button>
          <button className="modal-confirm-btn danger" onClick={handleConfirm}>
            {confirmText || 'Confirmar'}
          </button>
        </>
      )
    }

    if (tipo === 'guardar') {
      return (
        <>
          <button className="modal-confirm-btn ghost" onClick={handleCancel}>
            {cancelText || 'Cancelar'}
          </button>
          <button className="modal-confirm-btn primary" onClick={handleConfirm}>
            {confirmText || 'Guardar'}
          </button>
        </>
      )
    }

    return (
      <button className="modal-confirm-btn primary" onClick={handleConfirm}>
        {okText || 'Ok'}
      </button>
    )
  }

  return (
    <div className="modal-confirm-overlay" role="dialog" aria-modal="true">
      <div className="modal-confirm-card">
        <div className="modal-confirm-header">
          <div>
            <p className="modal-confirm-eyebrow">Axiom</p>
            <h3 className="modal-confirm-title">{titulo}</h3>
          </div>
          <button
            className="modal-confirm-close"
            aria-label="Cerrar"
            onClick={handleClose}
            type="button"
          >
            ×
          </button>
        </div>

        <p className="modal-confirm-message">{mensaje}</p>

        <div className="modal-confirm-actions">
          {renderButtons()}
        </div>
      </div>
    </div>
  )
}

export default ModalConfirmacion
