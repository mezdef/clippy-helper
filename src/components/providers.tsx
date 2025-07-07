'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { QUERY_CONFIG } from '@/constants';

// Providers component that wraps the app with necessary context providers
export function Providers({ children }: { children: React.ReactNode }) {
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
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Leaving tools commented out for now since they're annoying */}
      {/*  <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
