'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Save, X } from 'lucide-react';
import { Form, FormField, Textarea } from '@/components/ui/forms';

interface EditMessageFormData {
  text: string;
}

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
          <button
            type="submit"
            className="flex items-center gap-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            <Save className="h-3 w-3" />
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            <X className="h-3 w-3" />
            Cancel
          </button>
        </div>
      </Form>
    </div>
  );
};
