import {
  KanbanBoard,
  KanbanCard,
  KanbanColumn,
  CardFormData,
  ColumnFormData,
} from '@/lib/types/kanban';

export function generateId(): string {
  return crypto.randomUUID();
}

export function getInitialBoard(): KanbanBoard {
  const now = new Date();
  const columnIds = ['col-1', 'col-2', 'col-3', 'col-4', 'col-5'];

  const columns: Record<string, KanbanColumn> = {
    'col-1': {
      id: 'col-1',
      title: 'Backlog',
      cardIds: [],
      createdAt: now,
      updatedAt: now,
    },
    'col-2': {
      id: 'col-2',
      title: 'Todo',
      cardIds: [],
      createdAt: now,
      updatedAt: now,
    },
    'col-3': {
      id: 'col-3',
      title: 'In Progress',
      cardIds: [],
      createdAt: now,
      updatedAt: now,
    },
    'col-4': {
      id: 'col-4',
      title: 'Review',
      cardIds: [],
      createdAt: now,
      updatedAt: now,
    },
    'col-5': {
      id: 'col-5',
      title: 'Done',
      cardIds: [],
      createdAt: now,
      updatedAt: now,
    },
  };

  return {
    columns,
    cards: {},
    columnOrder: columnIds,
  };
}

export function createCard(data: CardFormData): KanbanCard {
  const now = new Date();
  return {
    id: generateId(),
    ...data,
    createdAt: now,
    updatedAt: now,
  };
}

export function createColumn(data: ColumnFormData): KanbanColumn {
  const now = new Date();
  return {
    id: generateId(),
    ...data,
    cardIds: [],
    createdAt: now,
    updatedAt: now,
  };
}
