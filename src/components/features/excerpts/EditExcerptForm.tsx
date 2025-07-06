'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Save, X } from 'lucide-react';
import { Form, FormField, Input, Textarea } from '@/components/ui/forms';
import { Button } from '@/components/ui';

interface EditExcerptFormData {
  title: string;
  content: string;
}

interface EditExcerptFormProps {
  excerpt: {
    id: string;
    title: string;
    content: string;
  };
  onSave: (id: string, content: string, title: string) => void;
  onCancel: () => void;
}

export const EditExcerptForm: React.FC<EditExcerptFormProps> = ({
  excerpt,
  onSave,
  onCancel,
}) => {
  const methods = useForm<EditExcerptFormData>({
    defaultValues: {
      title: excerpt.title,
      content: excerpt.content,
    },
  });

  const handleSubmit = (data: EditExcerptFormData) => {
    if (
      data.content.trim() !== excerpt.content ||
      data.title.trim() !== excerpt.title
    ) {
      onSave(excerpt.id, data.content.trim(), data.title.trim());
    }
  };

  return (
    <div className="mt-2 space-y-3">
      <Form methods={methods} onSubmit={handleSubmit} className="space-y-3">
        <FormField label="Title">
          <Input id="title" placeholder="Edit excerpt title..." />
        </FormField>
        <FormField label="Content">
          <Textarea
            id="content"
            placeholder="Edit excerpt content..."
            rows={4}
          />
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
      </Form>
    </div>
  );
};
