'use client';
import { Error } from '@/components/ui/Error';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({
  error: _error,
  reset: _reset,
}: ErrorPageProps): React.ReactElement {
  return (
    <Error
      title="Something went wrong"
      message="An unexpected error occurred. Please try again."
    />
  );
}
