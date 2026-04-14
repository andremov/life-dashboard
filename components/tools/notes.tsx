import React from 'react';
import { MovableCard } from '../cards';
import { useStore } from '../../lib/store';

export function Notes() {
  const note = useStore((s) => s.note);
  const setNote = useStore((s) => s.setNote);

  return (
    <MovableCard name="notes" className="w-80">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Jot something down..."
        className="min-h-64 w-full resize-none bg-transparent text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
      />
    </MovableCard>
  );
}
