import React, { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { useChatContext } from './ChatContext';
import { Form, Textarea } from '@/components/forms';

type FormData = { chatInput: string };

export const ChatInputForm: React.FC = (): JSX.Element => {
  const methods = useForm<FormData>();
  const { setSubmitted, setResponses, setLoading, setError, loading } =
    useChatContext();

  const onSubmit = async (data: FormData) => {
    setSubmitted(data.chatInput);
    // setResponses();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatInput: data.chatInput }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Unknown error');
      console.log('result:', result);
      setResponses(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
      methods.reset();
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
      <div className="max-w-4xl mx-auto">
        <Form
          onSubmit={onSubmit}
          methods={methods}
          className="flex flex-col gap-2 w-full"
        >
          <Textarea
            id="chatInput"
            label="Ask Clippy for something..."
            placeholder="I'd like to write a letter..."
          />
          <button
            type="submit"
            className="mt-2 bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Submit'}
          </button>
        </Form>
      </div>
    </footer>
  );
};
