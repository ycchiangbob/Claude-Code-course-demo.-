'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { KanbanColumn, ColumnFormData } from '@/lib/types/kanban';

interface ColumnDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ColumnFormData) => void;
  initialColumn?: KanbanColumn;
}

interface ColumnFormProps {
  initialColumn?: KanbanColumn;
  onClose: () => void;
  onSave: (data: ColumnFormData) => void;
}

function ColumnForm({ initialColumn, onClose, onSave }: ColumnFormProps) {
  const [title, setTitle] = useState(initialColumn?.title ?? '');

  const handleSave = () => {
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
    });

    onClose();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{initialColumn ? 'Edit Column' : 'Create Column'}</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <label className="text-sm font-medium mb-2 block">Column Name</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter column name"
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!title.trim()}>
          {initialColumn ? 'Update' : 'Create'}
        </Button>
      </DialogFooter>
    </>
  );
}

export function ColumnDialog({ open, onClose, onSave, initialColumn }: ColumnDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        {open && (
          <ColumnForm
            key={initialColumn?.id ?? 'new'}
            initialColumn={initialColumn}
            onClose={onClose}
            onSave={onSave}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}