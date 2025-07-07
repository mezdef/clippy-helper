import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingPageProps {
  text?: string;
  className?: string;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({
  text = 'Loading...',
  className = '',
}) => {
  return (
    <div
      className={`flex items-center justify-center min-h-screen ${className}`}
    >
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
};
