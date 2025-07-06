'use client';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Error } from '@/components/ui/Error';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Error
          title="Something went wrong"
          message="An unexpected error occurred. Please refresh the page and try again."
        />
      );
    }

    return this.props.children;
  }
}
