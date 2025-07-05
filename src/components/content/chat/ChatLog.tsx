import React, { JSX } from 'react';
import { useChatContext } from './ChatContext';

export const ChatLog: React.FC = (): JSX.Element => {
  const { submitted, responses, error } = useChatContext();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [chatLog]);
  return (
    <main className="flex-1 p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {submitted && (
        <div className="mt-2 text-green-700">
          Submitted value: <span className="font-bold">{submitted}</span>
        </div>
      )}
      {responses && responses.output_parsed && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-black dark:text-white max-w-xl">
          <strong className="text-lg">{responses.status}</strong>
          <ul className="mt-4 space-y-3">
            {responses.output_parsed.list?.map((item: any, index: number) => (
              <li key={index} className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-blue-700 dark:text-blue-300">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm whitespace-pre-line">
                  {item.content}
                </p>
              </li>
            ))}
          </ul>
        </div>
          <div ref={chatEndRef} />
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 dark:bg-red-800 rounded text-red-800 dark:text-red-200 max-w-xl">
          <strong>Error:</strong> {error}
        </div>
      )}
    </main>
  );
};
