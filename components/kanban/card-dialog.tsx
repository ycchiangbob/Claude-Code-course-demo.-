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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { TagInput } from './tag-input';
import { KanbanCard, CardFormData } from '@/lib/types/kanban';

interface CardDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CardFormData) => void;
  initialCard?: KanbanCard;
}

interface CardFormProps {
  initialCard?: KanbanCard;
  onClose: () => void;
  onSave: (data: CardFormData) => void;
}

function CardForm({ initialCard, onClose, onSave }: CardFormProps) {
  const [title, setTitle] = useState(initialCard?.title ?? '');
  const [description, setDescription] = useState(initialCard?.description ?? '');
  const [tags, setTags] = useState<string[]>(initialCard?.tags ?? []);

  const handleSave = () => {
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      tags,
    });

    onClose();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{initialCard ? 'Edit Card' : 'Create Card'}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter card title"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter card description"
            rows={4}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Tags</label>
          <TagInput tags={tags} onChange={setTags} />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!title.trim()}>
          {initialCard ? 'Update' : 'Create'}
        </Button>
      </DialogFooter>
    </>
  );
}

export function CardDialog({ open, onClose, onSave, initialCard }: CardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        {open && (
          <CardForm
            key={initialCard?.id ?? 'new'}
            initialCard={initialCard}
            onClose={onClose}
            onSave={onSave}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}