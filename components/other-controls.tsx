import React from 'react';
import { StaticCard } from './cards';
import { IconButton } from './buttons';
import { faExpand, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../hooks/use-theme';

function handleFullScreen() {
  if (typeof document === 'undefined') return;
  if (document.fullscreenElement) {
    void document.exitFullscreen();
  } else {
    void document.documentElement.requestFullscreen();
  }
}

export function OtherControls() {
  const { theme, toggle } = useTheme();
  const isLight = theme === 'light';

  return (
    <StaticCard className={'other-controls'}>
      <IconButton
        icon={faExpand}
        onClick={handleFullScreen}
        ariaLabel="Toggle fullscreen"
      />
      <div className={'divider'} />
      <IconButton
        icon={isLight ? faSun : faMoon}
        onClick={toggle}
        ariaLabel={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      />
    </StaticCard>
  );
}
