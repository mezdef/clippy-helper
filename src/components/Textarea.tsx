import React, { JSX } from "react";
import { useFormContext } from "react-hook-form";

interface TextareaProps {
  id: string;
  label: string;
  placeholder?: string;
  className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ id, label, placeholder, className }): JSX.Element => {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[id]?.message as string | undefined;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-semibold">{label}</label>
      <textarea
        id={id}
        {...register(id, { required: "This field is required" })}
        className={"border rounded px-3 py-2 text-black min-h-[80px] resize-y " + (className || "")}
        placeholder={placeholder}
      />
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}; 