'use client';
import React, { JSX, useState, forwardRef, useImperativeHandle } from 'react';
import { Form, Input } from '@/components/ui/forms';
import { Sparkles } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading';
import { useChatInput } from '@/hooks/useChatInput';

interface ChatInputFormProps {
  conversationId: string;
  onMessageSubmitted?: () => void;
}

export interface ChatInputFormRef {
  setValue: (value: string) => void;
  focus: () => void;
  isSubmitting: boolean;
}

export const ChatInputForm = forwardRef<ChatInputFormRef, ChatInputFormProps>(
  ({ conversationId, onMessageSubmitted }, ref): JSX.Element => {
    const { methods, onSubmit, isSubmitting } = useChatInput({
      conversationId,
    });

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
        // Trigger cleanup immediately before creating the new message
        onMessageSubmitted?.();
        // Then create the new message
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
  }
);

ChatInputForm.displayName = 'ChatInputForm';
