'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { QUERY_CONFIG } from '@/constants';

// Providers component that wraps the app with necessary context providers
export function Providers({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
            gcTime: QUERY_CONFIG.DEFAULT_GC_TIME,
            retry: QUERY_CONFIG.DEFAULT_RETRY_ATTEMPTS,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
