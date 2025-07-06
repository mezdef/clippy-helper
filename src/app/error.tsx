import { Error } from '@/components/ui/Error';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <Error
      title="Something went wrong"
      message="An unexpected error occurred. Please try again."
    />
  );
}
