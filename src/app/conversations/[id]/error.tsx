'use client';
import { Error } from '@/components/ui';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ConversationError({
  error: _error,
  reset: _reset,
}: ErrorProps): React.ReactElement {
  return (
    <Error
      title="Something went wrong!"
      message="We encountered an error while loading this conversation."
      homeLinkText="Back to conversations"
    />
  );
}
