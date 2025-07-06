import { Suspense } from 'react';
import { LoadingPage } from '@/components/ui/loading';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function ConversationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      <ErrorBoundary>{children}</ErrorBoundary>
    </div>
  );
}
