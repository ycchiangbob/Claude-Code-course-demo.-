'use client';

import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreVertical, Edit, Trash } from 'lucide-react';
import { KanbanColumn as KanbanColumnType, KanbanCard as KanbanCardType } from '@/lib/types/kanban';
import { KanbanCard } from './kanban-card';

interface KanbanColumnProps {
  column: KanbanColumnType;
  cards: KanbanCardType[];
  onAddCard: () => void;
  onEditCard: (card: KanbanCardType) => void;
  onDeleteCard: (cardId: string) => void;
  onEditColumn: () => void;
  onDeleteColumn: () => void;
}

export function KanbanColumn({
  column,
  cards,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onEditColumn,
  onDeleteColumn,
}: KanbanColumnProps) {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id, data: { type: 'column' } });

  const { setNodeRef: setDroppableNodeRef } = useDroppable({
    id: column.id,
    data: { type: 'column', columnId: column.id },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    scale: isDragging ? 1.02 : 1,
  };

  // Generate a color based on column title
  const getColumnColor = (title: string) => {
    const colors = [
      { border: 'border-t-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/20', badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
      { border: 'border-t-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/20', badge: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
      { border: 'border-t-green-500', bg: 'bg-green-50 dark:bg-green-950/20', badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
      { border: 'border-t-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/20', badge: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
      { border: 'border-t-pink-500', bg: 'bg-pink-50 dark:bg-pink-950/20', badge: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300' },
    ];
    const index = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const columnColor = getColumnColor(column.title);

  return (
    <div
      ref={setSortableNodeRef}
      style={style}
      className="flex-shrink-0 w-80"
    >
      <Card className={`flex flex-col h-full transition-all duration-200 hover:shadow-xl border-t-4 ${columnColor.border} shadow-md`}>
        <div
          {...attributes}
          {...listeners}
          className={`flex items-center justify-between p-4 border-b cursor-move ${columnColor.bg}`}
        >
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{column.title}</h3>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${columnColor.badge}`}>
              {cards.length}
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="p-1.5 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded transition-colors">
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onEditColumn}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDeleteColumn} className="text-red-600">
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <ScrollArea className="flex-1 p-4 bg-gray-50/50 dark:bg-gray-900/50" ref={setDroppableNodeRef}>
          <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            {cards.length === 0 ? (
              <div className="text-center text-sm text-gray-400 py-12">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 mx-auto mb-3 flex items-center justify-center">
                  <Plus className="h-6 w-6 text-gray-400" />
                </div>
                No cards yet
              </div>
            ) : (
              cards.map((card) => (
                <KanbanCard
                  key={card.id}
                  card={card}
                  onEdit={() => onEditCard(card)}
                  onDelete={() => onDeleteCard(card.id)}
                />
              ))
            )}
          </SortableContext>
        </ScrollArea>
        <div className="p-3 border-t bg-white dark:bg-gray-950">
          <Button
            variant="outline"
            className="w-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={onAddCard}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Card
          </Button>
        </div>
      </Card>
    </div>
  );
}
