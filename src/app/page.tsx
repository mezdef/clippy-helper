import React, { JSX } from 'react';
import {
  ChatProvider,
  ChatLog,
  ChatInputForm,
} from '@/components/content/chat';

export const HomeContent: React.FC = (): JSX.Element => {
  return (
    <>
      <ChatProvider>
        <div className="flex flex-col h-screen">
          <ChatLog />
          <ChatInputForm />
        </div>
      </ChatProvider>
    </>
  );
};
export default HomeContent;
