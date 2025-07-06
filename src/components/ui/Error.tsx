import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorProps {
  title?: string;
  message?: string;
  className?: string;
  homeLinkText?: string;
}

export const Error: React.FC<ErrorProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  className = '',
  homeLinkText,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center h-full p-8 text-center ${className}`}
    >
      <div className="max-w-md p-6 rounded-lg border bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
        {homeLinkText && (
          <a
            href="/"
            className="inline-block mt-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {homeLinkText}
          </a>
        )}
      </div>
    </div>
  );
};
