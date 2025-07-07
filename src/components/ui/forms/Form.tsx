import React, { JSX } from 'react';
import {
  FormProvider,
  useFormContext,
  UseFormReturn,
  FieldValues,
} from 'react-hook-form';

interface FormProps<T extends FieldValues> {
  onSubmit: (data: T) => void;
  className?: string;
  children: React.ReactNode;
  methods?: UseFormReturn<T>;
}

function FormContent<T extends FieldValues>({
  onSubmit,
  className,
  children,
}: Omit<FormProps<T>, 'methods'>): JSX.Element {
  const { handleSubmit } = useFormContext<T>();
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      {children}
    </form>
  );
}

export function Form<T extends FieldValues>({
  onSubmit,
  className,
  children,
  methods,
}: FormProps<T>): JSX.Element {
  if (methods) {
    return (
      <FormProvider {...methods}>
        <FormContent onSubmit={onSubmit} className={className}>
          {children}
        </FormContent>
      </FormProvider>
    );
  }

  return (
    <FormContent onSubmit={onSubmit} className={className}>
      {children}
    </FormContent>
  );
}
