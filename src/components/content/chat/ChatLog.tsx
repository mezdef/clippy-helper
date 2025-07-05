'use client';
import React, { JSX, useRef, useEffect } from 'react';
import { useChatContext } from './ChatContext';
import { ListItemType, AdviceListType } from '@/app/api/chat/route';
import { ChatLogType } from './ChatContext';

export const ChatLog: React.FC = (): JSX.Element => {
  const { chatLog, error } = useChatContext();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatLog]);

  return (
    <main className="flex-1 min-h-0 overflow-y-auto p-8 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {chatLog.length > 0 && (
        <>
          <ol className="mt-4 space-y-3">
            {chatLog.map((chatEntry: ChatLogType, i: number) => {
              return (
                <li
                  key={i}
                  className={`border-l-4 pl-4 ${
                    chatEntry.role === 'user'
                      ? 'border-green-500'
                      : 'border-blue-500'
                  }`}
                >
                  <h3
                    className={`font-semibold ${
                      chatEntry.role === 'user'
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-blue-700 dark:text-blue-300'
                    }`}
                  >
                    {chatEntry.role === 'user' ? 'You' : 'Clippy'}
                  </h3>
                  {chatEntry.text && (
                    <p className="mt-1 text-sm whitespace-pre-line">
                      {chatEntry.text}
                    </p>
                  )}
                  {chatEntry.content && (
                    <div>
                      <h4 className="font-semibold text-blue-700 dark:text-blue-300">
                        {(chatEntry.content as AdviceListType).title}
                      </h4>
                      <ul className="mt-4 space-y-3">
                        {(chatEntry.content as AdviceListType).list.map(
                          (listItem: ListItemType, ii: number) => (
                            <li
                              key={ii}
                              className="border-l-4 border-blue-500 pl-4"
                            >
                              <h3 className="font-semibold text-blue-700 dark:text-blue-300">
                                {listItem.title}
                              </h3>
                              <p className="mt-1 text-sm whitespace-pre-line">
                                {listItem.content}
                              </p>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
          <div ref={chatEndRef} />
        </>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 dark:bg-red-800 rounded text-red-800 dark:text-red-200 max-w-xl">
          <strong>Error:</strong> {error}
        </div>
      )}
    </main>
  );
};
