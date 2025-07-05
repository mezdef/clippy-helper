import React, { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { useChatContext } from './ChatContext';
import { Form, Input } from '@/components/forms';
import { Sparkles, Loader2 } from 'lucide-react';

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
    <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
      <div className="max-w-4xl mx-auto">
        <Form
          onSubmit={onSubmit}
          methods={methods}
          className="flex flex-row gap-2 w-full items-end"
        >
          <div className="flex-1">
            <Input
              id="chatInput"
              label="Ask Clippy for something..."
              placeholder="I'd like to write a letter..."
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white rounded p-3 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={loading}
            aria-label="Send"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
          </button>
        </Form>
      </div>
    </div>
  );
};
