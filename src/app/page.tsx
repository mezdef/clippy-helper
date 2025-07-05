'use client';
import React, { JSX } from 'react';
import {
  MessageList,
  ChatInputForm,
  MessagesProvider,
} from '@/components/content/messages';

export const HomeContent: React.FC = (): JSX.Element => {
  return (
    <MessagesProvider>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Clippy Helper
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              AI-powered writing assistant
            </p>
          </div>
        </header>

        <div className="flex flex-col flex-1 min-h-0">
          <MessageList />
          <ChatInputForm />
        </div>
      </div>
    </MessagesProvider>
  );
};
export default HomeContent;
