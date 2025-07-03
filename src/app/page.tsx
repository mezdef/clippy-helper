"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import React, { JSX } from "react";
import { Form } from "../components/Form";
import { Input } from "../components/Input";

type FormData = { textInput: string };

export default function Home(): JSX.Element {
  const methods = useForm<FormData>();
  const [submitted, setSubmitted] = React.useState("");
  const onSubmit = (data: FormData) => {
    setSubmitted(data.textInput);
    methods.reset();
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Form onSubmit={onSubmit} methods={methods} className="flex flex-col gap-2 w-full max-w-xs">
          <Input
            id="chatInput"
            label="Ask Clippy for something..."
            placeholder="I'd like to write a letter..."
          />
          <button type="submit" className="mt-2 bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">Submit</button>
        </Form>
        {submitted && (
          <div className="mt-2 text-green-700">Submitted value: <span className="font-bold">{submitted}</span></div>
        )}
      </main>
    </div>
  );
}
