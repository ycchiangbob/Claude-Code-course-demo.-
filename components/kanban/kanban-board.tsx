'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useKanbanState } from '@/hooks/use-kanban-state';
import { KanbanColumn } from './kanban-column';
import { BoardHeader } from './board-header';
import { CardDialog } from './card-dialog';
import { ColumnDialog } from './column-dialog';
import { KanbanCard as KanbanCardType, CardFormData, ColumnFormData } from '@/lib/types/kanban';

export function KanbanBoard() {
  const {
    board,
    addCard,
    updateCard,
    deleteCard,
    addColumn,
    updateColumn,
    deleteColumn,
    moveCard,
    reorderColumns,
  } = useKanbanState();

  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const [columnDialogOpen, setColumnDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<KanbanCardType | null>(null);
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeType === 'column' && overType === 'column') {
      const oldIndex = board.columnOrder.indexOf(activeId);
      const newIndex = board.columnOrder.indexOf(overId);

      if (oldIndex !== newIndex) {
        reorderColumns(oldIndex, newIndex);
      }
    } else {
      let sourceColumnId: string | null = null;
      let destColumnId: string | null = null;

      for (const columnId of board.columnOrder) {
        if (board.columns[columnId].cardIds.includes(activeId)) {
          sourceColumnId = columnId;
        }
        if (overType === 'column') {
          destColumnId = overId;
        } else if (board.columns[columnId].cardIds.includes(overId)) {
          destColumnId = columnId;
        }
      }

      if (!sourceColumnId || !destColumnId) return;

      const destColumn = board.columns[destColumnId];
      let destIndex = destColumn.cardIds.indexOf(overId);

      if (destIndex === -1) {
        destIndex = destColumn.cardIds.length;
      }

      if (sourceColumnId !== destColumnId || destIndex !== destColumn.cardIds.indexOf(activeId)) {
        moveCard(activeId, sourceColumnId, destColumnId, destIndex);
      }
    }
  };

  const handleAddCard = (columnId: string) => {
    setActiveColumnId(columnId);
    setEditingCard(null);
    setCardDialogOpen(true);
  };

  const handleEditCard = (card: KanbanCardType) => {
    setEditingCard(card);
    setCardDialogOpen(true);
  };

  const handleSaveCard = (data: CardFormData) => {
    if (editingCard) {
      updateCard(editingCard.id, data);
    } else if (activeColumnId) {
      addCard(activeColumnId, data);
    }
    setCardDialogOpen(false);
    setEditingCard(null);
    setActiveColumnId(null);
  };

  const handleDeleteCard = (cardId: string) => {
    if (confirm('Are you sure you want to delete this card?')) {
      deleteCard(cardId);
    }
  };

  const handleAddColumn = () => {
    setEditingColumnId(null);
    setColumnDialogOpen(true);
  };

  const handleEditColumn = (columnId: string) => {
    setEditingColumnId(columnId);
    setColumnDialogOpen(true);
  };

  const handleSaveColumn = (data: ColumnFormData) => {
    if (editingColumnId) {
      updateColumn(editingColumnId, data);
    } else {
      addColumn(data);
    }
    setColumnDialogOpen(false);
    setEditingColumnId(null);
  };

  const handleDeleteColumn = (columnId: string) => {
    const column = board.columns[columnId];
    const message =
      column.cardIds.length > 0
        ? `Are you sure you want to delete "${column.title}"? This will also delete ${column.cardIds.length} card(s).`
        : `Are you sure you want to delete "${column.title}"?`;

    if (confirm(message)) {
      deleteColumn(columnId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-indigo-950/20 p-6">
      <div className="max-w-[1800px] mx-auto">
        <BoardHeader onAddColumn={handleAddColumn} />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={board.columnOrder}
            strategy={horizontalListSortingStrategy}
          >
            {board.columnOrder.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-gray-400 dark:text-gray-600 mb-6 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-20 w-20 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    No columns yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                    Get started by creating your first column to organize your tasks
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex gap-5 overflow-x-auto pb-6 px-1">
                {board.columnOrder.map((columnId) => {
                  const column = board.columns[columnId];
                  const cards = column.cardIds
                    .map((cardId) => board.cards[cardId])
                    .filter(Boolean);

                  return (
                    <KanbanColumn
                      key={column.id}
                      column={column}
                      cards={cards}
                      onAddCard={() => handleAddCard(column.id)}
                      onEditCard={handleEditCard}
                      onDeleteCard={handleDeleteCard}
                      onEditColumn={() => handleEditColumn(column.id)}
                      onDeleteColumn={() => handleDeleteColumn(column.id)}
                    />
                  );
                })}
              </div>
            )}
          </SortableContext>
          <DragOverlay />
        </DndContext>

        <CardDialog
          open={cardDialogOpen}
          onClose={() => {
            setCardDialogOpen(false);
            setEditingCard(null);
            setActiveColumnId(null);
          }}
          onSave={handleSaveCard}
          initialCard={editingCard || undefined}
        />

        <ColumnDialog
          open={columnDialogOpen}
          onClose={() => {
            setColumnDialogOpen(false);
            setEditingColumnId(null);
          }}
          onSave={handleSaveColumn}
          initialColumn={
            editingColumnId ? board.columns[editingColumnId] : undefined
          }
        />
      </div>
    </div>
  );
}
