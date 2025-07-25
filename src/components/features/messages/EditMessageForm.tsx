'use client';
import React from 'react';
import { Save, X, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui';
import { Form, FormField, Textarea } from '@/components/ui/forms';
import type { EditMessageFormData } from '@/types';

interface EditMessageFormProps {
  message: {
    id: string;
    text: string;
  };
  onSave: (text: string) => Promise<void>;
  onCancel: () => void;
}

export const EditMessageForm: React.FC<EditMessageFormProps> = ({
  message,
  onSave,
  onCancel,
}) => {
  const methods = useForm<EditMessageFormData>({
    defaultValues: {
      text: message.text,
    },
  });

  const handleSubmit = async (data: EditMessageFormData) => {
    if (data.text.trim() !== message.text) {
      await onSave(data.text.trim());
    }
  };

  return (
    <div className="space-y-3">
      <Form methods={methods} onSubmit={handleSubmit} className="space-y-3">
        <FormField label="Message">
          <Textarea id="text" placeholder="Edit your message..." rows={3} />
        </FormField>
        <div className="flex gap-2">
          <Button
            type="submit"
            icon={Save}
            size="sm"
            variant="default"
            className="bg-green-600 hover:bg-green-700"
          >
            Save
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            icon={X}
            size="sm"
            variant="secondary"
          >
            Cancel
          </Button>
        </div>
        <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>Warning:</strong> Editing this message will replace it and
            all subsequent messages in the conversation with new AI responses.
          </p>
        </div>
      </Form>
    </div>
  );
};
