'use client';
import React, { JSX } from 'react';
import { Bot, User, RotateCcw } from 'lucide-react';
import { ExcerptsList } from '../excerpts/ExcerptList';
import { Avatar } from '@/components/ui/Avatar';

interface MessageProps {
  role: 'user' | 'assistant';
  text?: string;
  messageId?: string;
  onReAsk?: (text: string, messageId: string) => void;
  excerpts?: Array<{
    id: string;
    title: string;
    content: string;
    order: string;
  }>;
}

export const Message: React.FC<MessageProps> = ({
  role,
  text,
  messageId,
  onReAsk,
  excerpts = [],
}): JSX.Element => {
  const isUser = role === 'user';
  const Icon = isUser ? User : Bot;
  const iconColor = isUser
    ? 'text-green-600 dark:text-green-300'
    : 'text-blue-600 dark:text-blue-300';
  const bgColor = isUser
    ? 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100'
    : 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100';
  const borderColor = isUser ? 'border-green-500' : 'border-blue-500';

  return (
    <div className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <Avatar role={role} />}

      <div className={`max-w-3xl ${bgColor} rounded-lg p-4`}>
        <div className="space-y-3">
          {/* Display text content */}
          {isUser && text && (
            <div className="space-y-2">
              <p className="whitespace-pre-line text-sm">{text}</p>
              {onReAsk && (
                <div className="flex justify-end">
                  <button
                    onClick={() => onReAsk(text, messageId!)}
                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium cursor-pointer flex items-center gap-1 transition-colors"
                    title="Re-ask this question"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Re-ask
                  </button>
                </div>
              )}
            </div>
          )}

          {!isUser && excerpts.length > 0 && (
            <ExcerptsList excerpts={excerpts} borderColor={borderColor} />
          )}
        </div>
      </div>

      {isUser && <Avatar role={role} />}
    </div>
  );
};
