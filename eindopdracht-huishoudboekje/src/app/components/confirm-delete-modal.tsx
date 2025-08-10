'use client';
export function ConfirmDeleteModal({isOpen, title = 'Weet je het zeker?', message = 'Deze actie kan niet ongedaan worden gemaakt.', onCancel, onConfirm}: 
  {
  isOpen: boolean;
  title?: string;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      data-testid="backdrop"
      className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div data-testid="modal-content" className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-gray-700 mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100"
          >
            Annuleren
          </button>
          <button
            data-testid="confirm-delete"
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Verwijderen
          </button>
        </div>
      </div>
    </div>
  );
}
