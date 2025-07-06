'use client';
import React, { JSX } from 'react';
import { Bot } from 'lucide-react';

const TypingIndicatorComponent: React.FC = (): JSX.Element => {
  return (
    <div className="flex items-start space-x-3 p-4">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
          <Bot className="h-4 w-4 text-blue-600 dark:text-blue-300" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3 inline-block">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Memoize to prevent unnecessary re-renders since this component has no props
export const TypingIndicator = React.memo(TypingIndicatorComponent);
