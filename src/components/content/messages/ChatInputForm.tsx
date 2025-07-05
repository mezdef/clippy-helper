'use client';
import React, { JSX, useState } from 'react';
import { Form, Input } from '@/components/ui/forms';
import { Sparkles } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading';
import { useChatInput } from '@/hooks/useChatInput';

interface ChatInputFormProps {
  conversationId: string;
}

export const ChatInputForm: React.FC<ChatInputFormProps> = ({
  conversationId,
}): JSX.Element => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { methods, onSubmit } = useChatInput({ conversationId });

  const handleSubmit = async (data: { chatInput: string }) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
      <div className="max-w-4xl mx-auto">
        <Form
          onSubmit={handleSubmit}
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
            className="bg-blue-600 text-white rounded p-3 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
            disabled={isSubmitting}
            aria-label="Send"
          >
            {isSubmitting ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
          </button>
        </Form>
      </div>
    </div>
  );
};
