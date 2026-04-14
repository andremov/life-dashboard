import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

type BaseButtonProps = {
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
};

type SquareButtonProps = BaseButtonProps & {
  icon: IconDefinition;
  label: string;
};

export const SquareButton = ({
  icon,
  label,
  onClick,
  className = '',
  ariaLabel,
}: SquareButtonProps) => (
  <button
    className={`square-btn ${className}`}
    onClick={onClick}
    aria-label={ariaLabel ?? label}
  >
    <FontAwesomeIcon className={'square-btn__icon'} icon={icon} />
    <div className={'square-btn__label'}>{label}</div>
  </button>
);

type IconButtonProps = BaseButtonProps & {
  icon: IconDefinition;
};

export const IconButton = ({
  icon,
  onClick,
  className = '',
  ariaLabel,
}: IconButtonProps) => (
  <button
    className={`icon-btn ${className}`}
    onClick={onClick}
    aria-label={ariaLabel ?? 'icon button'}
  >
    <FontAwesomeIcon className={'icon-btn__icon'} icon={icon} />
  </button>
);

type ThemedButtonProps = BaseButtonProps & {
  icon?: IconDefinition;
  label?: string;
  disabled?: boolean;
};

export const ThemedButton = ({
  icon,
  label,
  onClick,
  className = '',
  disabled = false,
  ariaLabel,
}: ThemedButtonProps) => (
  <button
    disabled={disabled}
    className={`themed-btn ${className}`}
    onClick={onClick}
    aria-label={ariaLabel ?? label}
  >
    {icon && <FontAwesomeIcon className={'themed-btn__icon'} icon={icon} />}
    {label && <div className={'themed-btn__label'}>{label}</div>}
  </button>
);
