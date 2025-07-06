'use client';
import React, { JSX, forwardRef, useImperativeHandle } from 'react';
import { Form, FormField, Input } from '@/components/ui/forms';
import { Sparkles } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading';
import { Button } from '@/components/ui';
import { useMessageInput } from '@/hooks/useMessageInput';
import { useAppState } from '@/hooks/useAppState';

interface ChatInputFormProps {
  conversationId: string;
  onFocus?: () => void;
}

export interface ChatInputFormRef {
  setValue: (value: string) => void;
  focus: () => void;
  isSubmitting: boolean;
}

export const ChatInputForm = forwardRef<ChatInputFormRef, ChatInputFormProps>(
  ({ conversationId, onFocus }, ref): JSX.Element => {
    const { methods, onSubmit } = useMessageInput({
      conversationId,
    });
    const { isSubmitting } = useAppState();

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      setValue: (value: string) => {
        methods.setValue('chatInput', value);
      },
      focus: () => {
        // Focus the input field
        const input = document.getElementById('chatInput') as HTMLInputElement;
        if (input) {
          input.focus();
        }
      },
      isSubmitting,
    }));

    const handleSubmit = async (data: { chatInput: string }) => {
      try {
        await onSubmit(data);
      } catch (error) {
        console.error('Error submitting message:', error);
      }
    };

    return (
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          <Form
            onSubmit={handleSubmit}
            methods={methods}
            className="flex flex-row w-full items-end"
          >
            <div className="flex-1">
              <Input
                id="chatInput"
                placeholder="I'd like to write a letter..."
                className="rounded-r-none h-12 text-lg"
                onFocus={onFocus}
              />
            </div>
            <Button
              type="submit"
              icon={isSubmitting ? undefined : Sparkles}
              variant="default"
              size="lg"
              disabled={isSubmitting}
              loading={isSubmitting}
              aria-label="Send"
              className="rounded-l-none h-12 w-12 p-0"
            />
          </Form>
        </div>
      </div>
    );
  }
);

ChatInputForm.displayName = 'ChatInputForm';
