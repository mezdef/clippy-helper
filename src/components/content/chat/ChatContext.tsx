'use client';
import React, {
  createContext,
  useContext,
  useState,
  JSX,
  useEffect,
} from 'react';
import {
  AiResponseStructured,
  AiRequestInput,
  AdviceListType,
} from '@/app/api/chat/route';

export interface ChatLogType {
  role: 'system' | 'user' | 'assistant';
  title?: string;
  text?: string;
  content?: AdviceListType;
}

interface ChatContextType {
  chatLog: ChatLogType[];
  aiRequests: AiRequestInput[];
  aiResponses: AiResponseStructured[];
  loading: boolean;
  error: string | null;
  setChatLog: (value: ChatLogType[]) => void;
  setAiRequests: (value: AiRequestInput[]) => void;
  setAiResponses: (value: AiResponseStructured[]) => void;
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
  const [chatLog, setChatLog] = useState<ChatLogType[]>([]);
  const [aiRequests, setAiRequests] = useState<AiRequestInput[]>([]);
  const [aiResponses, setAiResponses] = useState<AiResponseStructured[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const value: ChatContextType = {
    chatLog,
    aiRequests,
    aiResponses,
    loading,
    error,
    setChatLog,
    setAiRequests,
    setAiResponses,
    setLoading,
    setError,
  };

  useEffect(() => {
    console.log('responses:', responses);
  }, [responses]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
