// components/FormField.tsx
import React from 'react';

interface Props {
  label: string;
  id: string;
  children: React.ReactNode;
  className?: string; // allow custom wrapper classes
}

export default function FormField({ label, id, children, className = '' }: Props) {
  return (
    <div className={`form-field-stack ${className}`}>
      <label htmlFor={id} className="text-sm text-gray-400">
        {label}
      </label>
      {children}
    </div>
  );
}
