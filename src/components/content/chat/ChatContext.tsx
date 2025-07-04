import React, {
  createContext,
  useContext,
  useState,
  JSX,
  useEffect,
} from 'react';
import { StructuredResponse } from '@/app/api/chat/route';

interface ChatContextType {
  submitted: string;
  responses: StructuredResponse | undefined;
  loading: boolean;
  error: string | null;
  setSubmitted: (value: string) => void;
  setResponses: (value: StructuredResponse) => void;
  setLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}): JSX.Element => {
  const [submitted, setSubmitted] = useState('');
  const [responses, setResponses] = useState<StructuredResponse | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const value: ChatContextType = {
    submitted,
    responses,
    loading,
    error,
    setSubmitted,
    setResponses,
    setLoading,
    setError,
  };

  useEffect(() => {
    console.log('responses:', responses);
  }, [responses]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
