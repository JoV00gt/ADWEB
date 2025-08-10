import { ConfirmDeleteModal } from '@/app/components/confirm-delete-modal';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('ConfirmDeleteModal', () => {
  const onCancel = jest.fn();
  const onConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not render when isOpen is false', () => {
    const { container } = render(
      <ConfirmDeleteModal isOpen={false} onCancel={onCancel} onConfirm={onConfirm} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  test('renders with default title and message', () => {
    render(
      <ConfirmDeleteModal isOpen={true} onCancel={onCancel} onConfirm={onConfirm} />
    );
    expect(screen.getByText('Weet je het zeker?')).toBeInTheDocument();
    expect(screen.getByText('Deze actie kan niet ongedaan worden gemaakt.')).toBeInTheDocument();
  });

  test('renders with custom title and message', () => {
    render(
      <ConfirmDeleteModal
        isOpen={true}
        title="Custom title"
        message="Custom message"
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    );
    expect(screen.getByText('Custom title')).toBeInTheDocument();
    expect(screen.getByText('Custom message')).toBeInTheDocument();
  });

  test('calls onCancel when clicking cancel button', async () => {
    render(
      <ConfirmDeleteModal isOpen={true} onCancel={onCancel} onConfirm={onConfirm} />
    );
    await userEvent.click(screen.getByText('Annuleren'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('calls onConfirm when clicking confirm button', async () => {
    render(
      <ConfirmDeleteModal isOpen={true} onCancel={onCancel} onConfirm={onConfirm} />
    );
    await userEvent.click(screen.getByText('Verwijderen'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  test('calls onCancel when clicking on backdrop', async () => {
    render(
      <ConfirmDeleteModal isOpen={true} onCancel={onCancel} onConfirm={onConfirm} />
    );
    await userEvent.click(screen.getByTestId('backdrop'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('does NOT call onCancel when clicking inside modal content', async () => {
    render(
      <ConfirmDeleteModal isOpen={true} onCancel={onCancel} onConfirm={onConfirm} />
    );
    await userEvent.click(screen.getByTestId('modal-content'));
    expect(onCancel).not.toHaveBeenCalled();
  });
});
