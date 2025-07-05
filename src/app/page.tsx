'use client';
import React, { JSX } from 'react';
import { MessageSquare, Menu } from 'lucide-react';

export const HomeContent: React.FC = (): JSX.Element => {
  return (
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
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <MessageSquare className="h-16 w-16 mx-auto mb-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Welcome to Clippy Helper
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Your AI-powered writing assistant. Click the menu button in the
              top-left to start a new conversation.
            </p>
            <div className="flex items-center justify-center text-gray-500 dark:text-gray-400">
              <Menu className="h-4 w-4 mr-2" />
              <span className="text-sm">
                Use the sidebar menu to get started
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomeContent;
