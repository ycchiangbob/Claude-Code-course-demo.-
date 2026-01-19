export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type CardColor = 'default' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface KanbanCard {
  id: string;
  title: string;
  description: string;
  tags: string[];
  priority: Priority | null;
  dueDate: Date | null;
  checklist: ChecklistItem[];
  color: CardColor;
  createdAt: Date;
  updatedAt: Date;
}

export interface KanbanColumn {
  id: string;
  title: string;
  cardIds: string[];
  wipLimit?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface KanbanBoard {
  columns: Record<string, KanbanColumn>;
  cards: Record<string, KanbanCard>;
  columnOrder: string[];
}

export interface FilterState {
  searchQuery: string;
  priority: Priority | null;
  tags: string[];
  dueDateFilter: 'all' | 'overdue' | 'today' | 'week' | 'none';
}

export type CardFormData = Omit<KanbanCard, 'id' | 'createdAt' | 'updatedAt'>;
export type ColumnFormData = Omit<KanbanColumn, 'id' | 'cardIds' | 'createdAt' | 'updatedAt'>;
