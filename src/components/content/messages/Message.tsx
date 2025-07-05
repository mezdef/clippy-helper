'use client';
import React, { JSX } from 'react';
import { ListItemType, AdviceListType } from '@/api/chat/route';
import { Bot, User } from 'lucide-react';

interface MessageProps {
  role: 'user' | 'assistant';
  text?: string;
  content?: AdviceListType;
}

export const Message: React.FC<MessageProps> = ({
  role,
  text,
  content,
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
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
          <Bot className={`h-4 w-4 ${iconColor}`} />
        </div>
      )}

      <div className={`max-w-3xl ${bgColor} rounded-lg p-4`}>
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`h-4 w-4 ${iconColor}`} />
          <span className="text-sm font-medium capitalize">{role}</span>
        </div>

        <div className="space-y-3">
          {/* Display text content */}
          {isUser && text && (
            <p className="whitespace-pre-line text-sm">{text}</p>
          )}

          {/* Display structured content */}
          {content && (
            <div className={`border-l-4 ${borderColor} pl-4`}>
              <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                {content.title}
              </h4>
              <ul className="space-y-2">
                {content.list.map(
                  (listItem: ListItemType, listIndex: number) => (
                    <li
                      key={listIndex}
                      className="border-l-2 border-blue-300 pl-3"
                    >
                      <h5 className="font-medium text-blue-700 dark:text-blue-300">
                        {listItem.title}
                      </h5>
                      <p className="text-sm whitespace-pre-line">
                        {listItem.content}
                      </p>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
          <User className={`h-4 w-4 ${iconColor}`} />
        </div>
      )}
    </div>
  );
};
