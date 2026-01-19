'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface BoardHeaderProps {
  onAddColumn: () => void;
}

export function BoardHeader({ onAddColumn }: BoardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Kanban Board
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Organize your tasks and track progress
        </p>
      </div>
      <Button
        onClick={onAddColumn}
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Column
      </Button>
    </div>
  );
}
