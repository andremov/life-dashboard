import React from 'react';
import { StaticCard } from './cards';
import {
  faMusic,
  faStopwatch,
  faTasks,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';
import { SquareButton } from './buttons';
import type { ToolName } from '../lib/types';

type MenuProps = {
  setTool: (name: ToolName) => void;
};

export const Menu = ({ setTool }: MenuProps) => (
  <StaticCard className={'menu'}>
    <h3>tools</h3>
    <SquareButton icon={faVideo} label={'Spaces'} onClick={() => setTool('spaces')} />
    <SquareButton icon={faStopwatch} label={'Timer'} onClick={() => setTool('timer')} />
    <SquareButton icon={faMusic} label={'Music'} onClick={() => setTool('music')} />
    <SquareButton icon={faTasks} label={'Tasks'} onClick={() => setTool('tasks')} />
  </StaticCard>
);
