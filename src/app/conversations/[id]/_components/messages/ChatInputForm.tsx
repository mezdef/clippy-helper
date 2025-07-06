'use client';
import React, { JSX, useState, forwardRef, useImperativeHandle } from 'react';
import { Form, FormField, Input } from '@/components/ui/forms';
import { Sparkles } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading';
import { Button } from '@/components/ui';
import { useMessageInput } from '@/hooks/useMessageInput';

interface ChatInputFormProps {
  conversationId: string;
}

export interface ChatInputFormRef {
  setValue: (value: string) => void;
  focus: () => void;
  isSubmitting: boolean;
}

export const ChatInputForm = forwardRef<ChatInputFormRef, ChatInputFormProps>(
  ({ conversationId }, ref): JSX.Element => {
    const { methods, onSubmit, isSubmitting } = useMessageInput({
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
              <FormField label="Ask Clippy for something...">
                <Input
                  id="chatInput"
                  placeholder="I'd like to write a letter..."
                />
              </FormField>
            </div>
            <Button
              type="submit"
              icon={isSubmitting ? undefined : Sparkles}
              variant="default"
              size="lg"
              disabled={isSubmitting}
              loading={isSubmitting}
              aria-label="Send"
            />
          </Form>
        </div>
      </div>
    );
  }
);

ChatInputForm.displayName = 'ChatInputForm';
