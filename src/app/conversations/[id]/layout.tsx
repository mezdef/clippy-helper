import { Suspense } from 'react';
import { LoadingPage } from '@/components/ui/loading';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function ConversationLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="flex flex-col h-screen">
      <ErrorBoundary>
        <Suspense fallback={<LoadingPage text="Loading..." />}>
          {children}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
