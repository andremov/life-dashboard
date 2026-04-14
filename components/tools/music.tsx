import React from 'react';
import { MovableCard } from '../cards';

type MusicProps = {
  visible: boolean;
  toggleCard: () => void;
  position: { top: number; left: number };
};

export function Music({ visible, toggleCard, position }: MusicProps) {
  return (
    <MovableCard
      id="music"
      visible={visible}
      className={'music'}
      toggleCard={toggleCard}
      position={position}
    >
      Music
    </MovableCard>
  );
}
