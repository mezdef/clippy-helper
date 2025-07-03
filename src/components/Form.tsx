import React from "react";
import { FormProvider, useFormContext, UseFormReturn, FieldValues } from "react-hook-form";

interface FormProps<T extends FieldValues> {
  onSubmit: (data: T) => void;
  className?: string;
  children: React.ReactNode;
  methods?: UseFormReturn<T>;
}

export function Form<T extends FieldValues>({ onSubmit, className, children, methods }: FormProps<T>) {
  if (methods) {
    return (
      <FormProvider {...methods}>
        <Form onSubmit={onSubmit} className={className}>{children}</Form>
      </FormProvider>
    );
  }
  const { handleSubmit } = useFormContext<T>();
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      {children}
    </form>
  );
} 