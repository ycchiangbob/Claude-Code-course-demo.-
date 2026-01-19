import { useState, useCallback } from 'react';
import {
  KanbanBoard,
  CardFormData,
  ColumnFormData,
} from '@/lib/types/kanban';
import { getInitialBoard, createCard, createColumn } from '@/lib/utils/kanban-helpers';

export function useKanbanState() {
  const [board, setBoard] = useState<KanbanBoard>(getInitialBoard);

  const addCard = useCallback((columnId: string, data: CardFormData) => {
    const newCard = createCard(data);
    setBoard((prev) => ({
      ...prev,
      cards: {
        ...prev.cards,
        [newCard.id]: newCard,
      },
      columns: {
        ...prev.columns,
        [columnId]: {
          ...prev.columns[columnId],
          cardIds: [...prev.columns[columnId].cardIds, newCard.id],
          updatedAt: new Date(),
        },
      },
    }));
  }, []);

  const updateCard = useCallback((cardId: string, updates: Partial<CardFormData>) => {
    setBoard((prev) => ({
      ...prev,
      cards: {
        ...prev.cards,
        [cardId]: {
          ...prev.cards[cardId],
          ...updates,
          updatedAt: new Date(),
        },
      },
    }));
  }, []);

  const deleteCard = useCallback((cardId: string) => {
    setBoard((prev) => {
      const newCards = { ...prev.cards };
      delete newCards[cardId];

      const newColumns = { ...prev.columns };
      Object.keys(newColumns).forEach((columnId) => {
        newColumns[columnId] = {
          ...newColumns[columnId],
          cardIds: newColumns[columnId].cardIds.filter((id) => id !== cardId),
        };
      });

      return {
        ...prev,
        cards: newCards,
        columns: newColumns,
      };
    });
  }, []);

  const addColumn = useCallback((data: ColumnFormData) => {
    const newColumn = createColumn(data);
    setBoard((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [newColumn.id]: newColumn,
      },
      columnOrder: [...prev.columnOrder, newColumn.id],
    }));
  }, []);

  const updateColumn = useCallback((columnId: string, updates: Partial<ColumnFormData>) => {
    setBoard((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [columnId]: {
          ...prev.columns[columnId],
          ...updates,
          updatedAt: new Date(),
        },
      },
    }));
  }, []);

  const deleteColumn = useCallback((columnId: string) => {
    setBoard((prev) => {
      const newColumns = { ...prev.columns };
      const cardIdsToDelete = newColumns[columnId].cardIds;
      delete newColumns[columnId];

      const newCards = { ...prev.cards };
      cardIdsToDelete.forEach((cardId) => {
        delete newCards[cardId];
      });

      return {
        ...prev,
        columns: newColumns,
        cards: newCards,
        columnOrder: prev.columnOrder.filter((id) => id !== columnId),
      };
    });
  }, []);

  const moveCard = useCallback(
    (cardId: string, sourceColumnId: string, destColumnId: string, destIndex: number) => {
      setBoard((prev) => {
        const sourceColumn = prev.columns[sourceColumnId];
        const destColumn = prev.columns[destColumnId];

        const newSourceCardIds = sourceColumn.cardIds.filter((id) => id !== cardId);
        const newDestCardIds = [...destColumn.cardIds];

        if (sourceColumnId === destColumnId) {
          const currentIndex = sourceColumn.cardIds.indexOf(cardId);
          newDestCardIds.splice(currentIndex, 1);
          newDestCardIds.splice(destIndex, 0, cardId);
        } else {
          newDestCardIds.splice(destIndex, 0, cardId);
        }

        return {
          ...prev,
          columns: {
            ...prev.columns,
            [sourceColumnId]: {
              ...sourceColumn,
              cardIds: sourceColumnId === destColumnId ? newDestCardIds : newSourceCardIds,
              updatedAt: new Date(),
            },
            ...(sourceColumnId !== destColumnId && {
              [destColumnId]: {
                ...destColumn,
                cardIds: newDestCardIds,
                updatedAt: new Date(),
              },
            }),
          },
        };
      });
    },
    []
  );

  const reorderColumns = useCallback((sourceIndex: number, destIndex: number) => {
    setBoard((prev) => {
      const newColumnOrder = [...prev.columnOrder];
      const [removed] = newColumnOrder.splice(sourceIndex, 1);
      newColumnOrder.splice(destIndex, 0, removed);

      return {
        ...prev,
        columnOrder: newColumnOrder,
      };
    });
  }, []);

  return {
    board,
    addCard,
    updateCard,
    deleteCard,
    addColumn,
    updateColumn,
    deleteColumn,
    moveCard,
    reorderColumns,
  };
}
