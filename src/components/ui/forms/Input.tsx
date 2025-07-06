import React, { JSX } from 'react';
import { useFormContext } from 'react-hook-form';

interface InputProps {
  id: string;
  placeholder?: string;
  className?: string;
  onFocus?: () => void;
}

export const Input: React.FC<InputProps> = ({
  id,
  placeholder,
  className,
  onFocus,
}): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[id]?.message as string | undefined;
  return (
    <>
      <input
        id={id}
        {...register(id, { required: 'This field is required' })}
        className={
          'w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white ' +
          (className || '')
        }
        placeholder={placeholder}
        onFocus={onFocus}
      />
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </>
  );
};
