import React from 'react';
import { Bot, User } from 'lucide-react';

interface AvatarProps {
  role: 'user' | 'assistant';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  role,
  size = 'md',
  className = '',
}) => {
  const isUser = role === 'user';
  const Icon = isUser ? User : Bot;

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const iconSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-6 w-6',
  };

  const bgColor = isUser
    ? 'bg-green-100 dark:bg-green-900'
    : 'bg-blue-100 dark:bg-blue-900';

  const iconColor = isUser
    ? 'text-green-600 dark:text-green-300'
    : 'text-blue-600 dark:text-blue-300';

  return (
    <div
      className={`flex-shrink-0 ${sizeClasses[size]} ${bgColor} rounded-full flex items-center justify-center ${className}`}
    >
      <Icon className={`${iconSizeClasses[size]} ${iconColor}`} />
    </div>
  );
};
