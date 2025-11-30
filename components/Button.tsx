// components/Button.tsx
import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button(props: Props) {
  const { className = '', children, ...rest } = props;
  return (
    <button
      {...rest}
      className={`btn-primary btn-focus ${className}`}
    >
      {children}
    </button>
  );
}
