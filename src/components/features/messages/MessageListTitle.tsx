import React from 'react';

interface MessageListTitleProps {
  title: string;
  createdAt?: string;
  className?: string;
}

const MessageListTitleComponent: React.FC<MessageListTitleProps> = ({
  title,
  createdAt,
  className = '',
}) => {
  return (
    <div
      className={`mb-8 pb-6 border-b border-gray-200 dark:border-gray-700 ${className}`}
    >
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h1>
        {createdAt && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Created {createdAt}
          </p>
        )}
      </div>
    </div>
  );
};

// Memoize to prevent unnecessary re-renders when props haven't changed
export const MessageListTitle = React.memo(MessageListTitleComponent);
