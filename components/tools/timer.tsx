import React from 'react';
import { MovableCard } from '../cards';
import { IconButton, ThemedButton } from '../buttons';
import { faCog, faSync } from '@fortawesome/free-solid-svg-icons';
import { useTimer } from '../../hooks/use-timer';

type TimerProps = {
  visible: boolean;
  toggleCard: () => void;
  position: { top: number; left: number };
};

const formatDigits = (n: number): string => (n < 10 ? `0${n}` : `${n}`);
const formatTime = (seconds: number): string =>
  `${formatDigits(Math.floor(seconds / 60))}:${formatDigits(seconds % 60)}`;

export function Timer({ visible, toggleCard, position }: TimerProps) {
  const { interval, remaining, isRunning, toggle, reset, change } = useTimer();

  return (
    <MovableCard
      id="timer"
      visible={visible}
      className={'timer'}
      toggleCard={toggleCard}
      position={position}
    >
      <div className={'timer__top'}>
        <div className={'timer__display'}>{formatTime(remaining)}</div>
        <div className={'timer__start'}>
          <ThemedButton label={isRunning ? 'Pause' : 'Start'} onClick={toggle} />
        </div>
        <div className={'timer__reset'}>
          <IconButton
            icon={faSync}
            onClick={reset}
            ariaLabel="Reset timer"
          />
        </div>
      </div>
      <div className={'timer__bottom'}>
        <ThemedButton
          className={`timer__interval ${interval === 'pomodoro' ? 'active' : ''}`}
          label={'Pomodoro'}
          onClick={() => change('pomodoro')}
        />
        <ThemedButton
          className={`timer__interval ${interval === 'short' ? 'active' : ''}`}
          label={'Short Break'}
          onClick={() => change('short')}
        />
        <ThemedButton
          className={`timer__interval ${interval === 'long' ? 'active' : ''}`}
          label={'Long Break'}
          onClick={() => change('long')}
        />
        <IconButton
          className={'timer__settings'}
          icon={faCog}
          ariaLabel="Timer settings"
        />
      </div>
    </MovableCard>
  );
}
