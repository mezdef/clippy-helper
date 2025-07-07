'use client';
import React, { JSX, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, MessagesSquare, Plus } from 'lucide-react';
import { Button } from '@/components/ui';
import { useCreateConversation } from '@/hooks/useConversations';

const HomeContent: React.FC = (): JSX.Element => {
  const router = useRouter();
  const createConversationMutation = useCreateConversation();

  const handleNewConversation = useCallback(async () => {
    try {
      const newConversation = await createConversationMutation.mutateAsync(
        `Chat ${new Date().toLocaleString()}`
      );
      router.push(`/conversations/${newConversation.id}`);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  }, [createConversationMutation, router]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <MessageSquare className="h-16 w-16 mx-auto mb-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Welcome to Clippy Helper
            </h2>
            <div className="mb-6">
              <Button
                onClick={handleNewConversation}
                disabled={createConversationMutation.isPending}
                icon={createConversationMutation.isPending ? undefined : Plus}
                variant="outline"
                size="lg"
                loading={createConversationMutation.isPending}
                className="w-full max-w-xs"
              >
                Start New Conversation
              </Button>
            </div>

            {createConversationMutation.error && (
              <div className="mb-6 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-md">
                {createConversationMutation.error.message}
              </div>
            )}

            <div className="flex items-center justify-center text-gray-500 dark:text-gray-400">
              <MessagesSquare className="h-4 w-4 mr-2" />
              <span className="text-sm">
                Or use the sidebar menu to browse existing conversations
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomeContent;
