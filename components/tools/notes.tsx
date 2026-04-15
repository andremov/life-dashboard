import React, { useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { MovableCard } from '../cards';
import { Button } from '../ui/button';
import { useStore } from '../../lib/store';
import { cn } from '../../lib/utils';

export function Notes() {
  const notes = useStore((s) => s.notes);
  const activeNoteId = useStore((s) => s.activeNoteId);
  const createNote = useStore((s) => s.createNote);
  const deleteNote = useStore((s) => s.deleteNote);
  const selectNote = useStore((s) => s.selectNote);
  const updateNoteTitle = useStore((s) => s.updateNoteTitle);
  const updateNoteBody = useStore((s) => s.updateNoteBody);

  useEffect(() => {
    if (notes.length === 0) return;
    if (!activeNoteId || !notes.find((n) => n.id === activeNoteId)) {
      selectNote(notes[0].id);
    }
  }, [notes, activeNoteId, selectNote]);

  const active = notes.find((n) => n.id === activeNoteId) ?? null;

  return (
    <MovableCard name="notes" title="Notes" className="w-[28rem]">
      <div className="flex h-80 gap-2">
        <div className="flex w-32 shrink-0 flex-col gap-1 border-r pr-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 justify-start gap-1 text-xs"
            onClick={createNote}
          >
            <Plus className="size-3.5" />
            New
          </Button>
          <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
            {notes.length === 0 && (
              <div className="px-1 py-2 text-[11px] text-muted-foreground">
                No notes yet.
              </div>
            )}
            {notes.map((note) => (
              <button
                key={note.id}
                type="button"
                onClick={() => selectNote(note.id)}
                className={cn(
                  'truncate rounded-md px-2 py-1 text-left text-xs transition-colors',
                  note.id === activeNoteId
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent/50',
                )}
              >
                {note.title || 'Untitled'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          {active ? (
            <>
              <div className="flex items-center gap-2">
                <input
                  value={active.title}
                  onChange={(e) => updateNoteTitle(active.id, e.target.value)}
                  placeholder="Untitled"
                  className="flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => deleteNote(active.id)}
                  aria-label="Delete note"
                  className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
              <textarea
                value={active.body}
                onChange={(e) => updateNoteBody(active.id, e.target.value)}
                placeholder="Jot something down..."
                className="mt-2 flex-1 resize-none bg-transparent text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
              />
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-xs text-muted-foreground">
              Click &ldquo;New&rdquo; to create a note.
            </div>
          )}
        </div>
      </div>
    </MovableCard>
  );
}
