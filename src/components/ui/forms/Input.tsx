import React, { JSX } from "react";
import { useFormContext } from "react-hook-form";

interface InputProps {
  id: string;
  label: string;
  placeholder?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({ id, label, placeholder, className }): JSX.Element => {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[id]?.message as string | undefined;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-semibold">{label}</label>
      <input
        id={id}
        {...register(id, { required: "This field is required" })}
        className={"border rounded px-3 py-2 text-black " + (className || "")}
        placeholder={placeholder}
      />
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}; 