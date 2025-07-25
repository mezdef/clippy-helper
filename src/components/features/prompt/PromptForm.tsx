'use client';
import React, { JSX, forwardRef, useImperativeHandle } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';
import { Form, Input } from '@/components/ui/forms';
import { usePrompt } from '@/hooks/usePrompt';

interface PromptFormProps {
  conversationId: string;
  onFocus?: () => void;
}

export interface PromptFormRef {
  setValue: (value: string) => void;
  focus: () => void;
  isSubmitting: boolean;
}

export const PromptForm = forwardRef<PromptFormRef, PromptFormProps>(
  ({ conversationId, onFocus }, ref): JSX.Element => {
    const { methods, onSubmit, isSubmitting } = usePrompt({
      conversationId,
    });

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      setValue: (value: string) => {
        methods.setValue('prompt', value);
      },
      focus: () => {
        // Focus the input field
        const input = document.getElementById('prompt') as HTMLInputElement;
        if (input) {
          input.focus();
        }
      },
      isSubmitting,
    }));

    const handleSubmit = async (data: { prompt: string }) => {
      // Clear input and unfocus immediately when submit occurs
      const input = document.getElementById('prompt') as HTMLInputElement;
      if (input) {
        input.blur();
      }
      methods.reset();

      try {
        await onSubmit(data);
      } catch (error) {
        console.error('Error submitting message:', error);
        // If there's an error, restore the original text so user can retry
        methods.setValue('prompt', data.prompt);
        if (input) {
          input.focus();
        }
      }
    };

    return (
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          <Form
            onSubmit={handleSubmit}
            methods={methods}
            className="flex flex-row w-full items-start"
          >
            <div className="flex-1">
              <Input
                id="prompt"
                placeholder="I'd like some legal advice..."
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

PromptForm.displayName = 'PromptForm';
