'use client';
import React, { createContext, useContext, useState, JSX } from 'react';
import {
  AiResponseStructured,
  AiRequestInput,
  AdviceListType,
} from '@/api/chat/route';

export interface MessageType {
  role: 'user' | 'assistant';
  text?: string;
  content?: AdviceListType;
}

interface MessagesContextType {
  messages: MessageType[];
  aiRequests: AiRequestInput[];
  aiResponses: AiResponseStructured[];
  loading: boolean;
  error: string | null;
  setMessages: (value: MessageType[]) => void;
  setAiRequests: (value: AiRequestInput[]) => void;
  setAiResponses: (value: AiResponseStructured[]) => void;
  setLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  startNewChat: () => void;
}

const MessagesContext = createContext<MessagesContextType | undefined>(
  undefined
);

export const useMessagesContext = (): MessagesContextType => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error(
      'useMessagesContext must be used within a MessagesProvider'
    );
  }
  return context;
};

export const MessagesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}): JSX.Element => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [aiRequests, setAiRequests] = useState<AiRequestInput[]>([]);
  const [aiResponses, setAiResponses] = useState<AiResponseStructured[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const startNewChat = (): void => {
    setMessages([]);
    setAiRequests([]);
    setAiResponses([]);
    setError(null);
  };

  const value: MessagesContextType = {
    messages,
    aiRequests,
    aiResponses,
    loading,
    error,
    setMessages,
    setAiRequests,
    setAiResponses,
    setLoading,
    setError,
    startNewChat,
  };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
};
