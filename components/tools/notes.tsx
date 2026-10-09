// andremov-brand-check-unique: the two-pane notes window (note list beside a borderless title and writing area) is this dashboard's scratchpad
import React, { useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Text, cn } from '@andremov/brand';
import { Button } from '@andremov/brand/ui/button';
import { MovableCard } from '../cards';
import { useStore } from '../../lib/store';

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
          <Button variant="ghost" size="xs" className="justify-start" onClick={createNote}>
            <Plus />
            New
          </Button>
          <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
            {notes.length === 0 && (
              <Text variant="hint" className="px-1 py-2">
                No notes yet.
              </Text>
            )}
            {notes.map((note) => (
              <button
                key={note.id}
                type="button"
                onClick={() => selectNote(note.id)}
                aria-current={note.id === activeNoteId || undefined}
                className={cn(
                  'truncate rounded-md px-2 py-1 text-left text-xs transition-colors',
                  note.id === activeNoteId
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted/60',
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
                  aria-label="Note title"
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-muted-foreground"
                />
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => deleteNote(active.id)}
                  aria-label="Delete note"
                  className="hover:text-danger-text"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
              <textarea
                value={active.body}
                onChange={(e) => updateNoteBody(active.id, e.target.value)}
                placeholder="Jot something down..."
                aria-label="Note"
                className="mt-2 flex-1 resize-none bg-transparent text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
              />
            </>
          ) : (
            <Text variant="hint" className="flex flex-1 items-center justify-center">
              Click &ldquo;New&rdquo; to create a note.
            </Text>
          )}
        </div>
      </div>
    </MovableCard>
  );
}
