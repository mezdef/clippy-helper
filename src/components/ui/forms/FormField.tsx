import React, { JSX, useRef, useEffect } from 'react';

interface FormFieldProps {
  label?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  children,
  className = '',
}): JSX.Element => {
  const inputRef = useRef<HTMLElement>(null);

  // Find the first input or textarea element in children
  useEffect(() => {
    if (children && typeof children === 'object' && 'props' in children) {
      const childElement = children as React.ReactElement<{ id?: string }>;
      if (childElement.props?.id) {
        const element = document.getElementById(childElement.props.id);
        if (element) {
          inputRef.current = element;
        }
      }
    }
  }, [children]);

  const handleLabelClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          className="font-semibold text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
          onClick={handleLabelClick}
        >
          {label}
        </label>
      )}
      {children}
    </div>
  );
};
