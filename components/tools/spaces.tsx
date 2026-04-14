import React from 'react';
import { MovableCard } from '../cards';

type SpacesProps = {
  visible: boolean;
  toggleCard: () => void;
  position: { top: number; left: number };
};

export function Spaces({ visible, toggleCard, position }: SpacesProps) {
  return (
    <MovableCard
      id="spaces"
      visible={visible}
      className={'spaces'}
      toggleCard={toggleCard}
      position={position}
    >
      Spaces
    </MovableCard>
  );
}
