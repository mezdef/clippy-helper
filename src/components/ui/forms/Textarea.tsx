import React, { JSX } from 'react';
import { useFormContext } from 'react-hook-form';

interface TextareaProps {
  id: string;
  placeholder?: string;
  className?: string;
  rows?: number;
}

export const Textarea: React.FC<TextareaProps> = ({
  id,
  placeholder,
  className,
  rows = 4,
}): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[id]?.message as string | undefined;

  return (
    <>
      <textarea
        id={id}
        {...register(id, { required: 'This field is required' })}
        className={
          'w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none ' +
          (className || '')
        }
        placeholder={placeholder}
        rows={rows}
      />
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </>
  );
};
