import React, { type ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

type StaticCardProps = {
  className?: string;
  children: ReactNode;
};

export function StaticCard({ className = '', children }: StaticCardProps) {
  return (
    <div className={`card ${className}`}>
      <div className={'card__body'}>{children}</div>
    </div>
  );
}

type MovableCardProps = {
  id: string;
  className?: string;
  children: ReactNode;
  visible: boolean;
  toggleCard: () => void;
  position: { top: number; left: number };
};

export function MovableCard({
  id,
  className = '',
  children,
  visible,
  toggleCard,
  position,
}: MovableCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });

  const style: React.CSSProperties = {
    top: position.top,
    left: position.left,
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      className={`card ${className} ${visible ? '' : 'hidden'}`}
      style={style}
    >
      <div className={'card__top'} {...listeners} {...attributes}>
        <div className={'card__close-btn'}>
          <FontAwesomeIcon
            icon={faTimes}
            onClick={toggleCard}
            onPointerDown={(e) => e.stopPropagation()}
          />
        </div>
      </div>
      <div className={'card__body'}>{children}</div>
    </div>
  );
}
