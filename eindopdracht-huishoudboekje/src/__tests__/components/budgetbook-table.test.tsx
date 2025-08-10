import { BudgetBookTable } from '@/app/components/budgetbook-table';
import * as actions from '@/app/lib/actions/budgetbook-actions';
import { BudgetBook } from '@/app/lib/definitions';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Timestamp } from 'firebase/firestore';

const mockBudgetBooks: BudgetBook[] = [
  {
    id: '1',
    name: 'Huishoudboekje 1',
    ownerId: 'user123',
    description: 'Beschrijving van boekje 1',
    archived: false,
    participants: ['user123', 'user456'],
    createdAt: Timestamp.fromDate(new Date('2023-01-01T10:00:00Z')),
  },
  {
    id: '2',
    name: 'Huishoudboekje 2',
    ownerId: 'user123',
    description: 'Beschrijving van boekje 2',
    archived: true,
    participants: ['user123'],
    createdAt: Timestamp.fromDate(new Date('2023-02-01T12:00:00Z')),
  },
  {
    id: '3',
    name: 'Huishoudboekje 3',
    ownerId: 'user456',
    description: 'Beschrijving van boekje 3',
    archived: false,
    participants: ['user456'],
    createdAt: Timestamp.fromDate(new Date('2023-03-01T14:00:00Z')),
  },
  {
    id: '4',
    name: 'Huishoudboekje 4',
    ownerId: 'user789',
    description: 'Beschrijving van boekje 4',
    archived: false,
    participants: ['user789', 'user123'],
    createdAt: Timestamp.fromDate(new Date('2023-04-01T16:00:00Z')),
  },
  {
    id: '5',
    name: 'Huishoudboekje 5',
    ownerId: 'user123',
    description: 'Beschrijving van boekje 5',
    archived: true,
    participants: ['user123', 'user789'],
    createdAt: Timestamp.fromDate(new Date('2023-05-01T18:00:00Z')),
  },
];
jest.spyOn(actions, 'archiveBudgetBook').mockImplementation(jest.fn());

describe('BudgetBookTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders budget books', () => {
    render(<BudgetBookTable budgetBooks={mockBudgetBooks} isArchived={false} currentUser="user123" />);
    expect(screen.getByText('Huishoudboekje 1')).toBeInTheDocument();
    expect(screen.getByText('Beschrijving van boekje 1')).toBeInTheDocument();
    expect(screen.getByText('Huishoudboekje 2')).toBeInTheDocument();
  });

  test('give message when no books given', () => {
    render(<BudgetBookTable budgetBooks={[]} isArchived={false} currentUser="user123" />);
    expect(screen.getByText('Geen huishoudboekjes gevonden.')).toBeInTheDocument();
  });

  test('calls onSelectBook when row clicked', async () => {
    const onSelectBook = jest.fn();
    render(<BudgetBookTable budgetBooks={mockBudgetBooks} isArchived={false} currentUser="user123" onSelectBook={onSelectBook} />);
    await userEvent.click(screen.getByText('Huishoudboekje 1'));
    expect(onSelectBook).toHaveBeenCalledWith(mockBudgetBooks[0]);
  });

  test('shows edit link and archive button only for currentUser owner and not archived', () => {
    render(<BudgetBookTable budgetBooks={mockBudgetBooks} isArchived={false} currentUser="user123" />);

    const editLinks = screen.getAllByText('Bewerk');
    expect(editLinks[0]).toHaveAttribute('href', '/dashboard/1/edit');

    const archivedLinks = screen.getAllByText('Archiveren');
    expect(archivedLinks[0]).toBeInTheDocument();

    expect(screen.queryByText('Bewerk', { selector: 'a[href="/dashboard/3/edit"]' })).toBeNull();
  });

  test('archive button toggles text and calls archiveBudgetBook', async () => {
    render(<BudgetBookTable budgetBooks={mockBudgetBooks} isArchived={false} currentUser="user123" />);
    const archiveBtn = screen.getAllByText('Archiveren')[0];
    await userEvent.click(archiveBtn);
    expect(actions.archiveBudgetBook).toHaveBeenCalledWith('1', true);

    const archivedLinks = screen.getAllByText('Dearchiveren');
    expect(archivedLinks[0]).toBeInTheDocument();
  });

  test('no edit buttons when book is archived', () => {
    render(<BudgetBookTable budgetBooks={mockBudgetBooks} isArchived={true} currentUser="user123" />);
    expect(screen.queryByText('Bewerk')).toBeNull();
  });
});
