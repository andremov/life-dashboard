import React, { useState } from 'react';
import { MovableCard } from '../cards';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ThemedButton } from '../buttons';
import type { Task } from '../../lib/types';

type TasksProps = {
  visible: boolean;
  toggleCard: () => void;
  position: { top: number; left: number };
};

export function Tasks({ visible, toggleCard, position }: TasksProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (name: string) =>
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name, done: false },
    ]);

  const toggleTask = (id: string) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );

  return (
    <MovableCard
      id="tasks"
      visible={visible}
      className={'tasks'}
      toggleCard={toggleCard}
      position={position}
    >
      {tasks.map((item) => (
        <TaskRow key={item.id} task={item} onToggle={() => toggleTask(item.id)} />
      ))}
      <TaskInput addTask={addTask} />
    </MovableCard>
  );
}

type TaskRowProps = {
  task: Task;
  onToggle: () => void;
};

const TaskRow = ({ task, onToggle }: TaskRowProps) => (
  <div
    className={`task-item ${task.done ? 'checked' : ''}`}
    onClick={onToggle}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onToggle();
      }
    }}
  >
    <div className={'task-item__check-box'}>
      {task.done && <FontAwesomeIcon icon={faCheck} />}
    </div>
    <div className={'task-item__label'}>{task.name}</div>
  </div>
);

type TaskInputProps = {
  addTask: (name: string) => void;
};

const TaskInput = ({ addTask }: TaskInputProps) => {
  const [name, setName] = useState('');

  const handleAdd = () => {
    const trimmed = name.trim();
    if (trimmed) {
      addTask(trimmed);
      setName('');
    }
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className={'new-task-item'}>
      <input
        className={'new-task-item__input'}
        onKeyDown={handleEnter}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <ThemedButton
        disabled={!name.trim()}
        onClick={handleAdd}
        className={'new-task-item__button'}
        icon={faPlus}
        ariaLabel="Add task"
      />
    </div>
  );
};
