'use client';
import React, { JSX, useRef } from 'react';
import { MessageSquare, Trash2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SidebarMenu, type SidebarMenuRef } from '@/components/layout';
import { LoadingSpinner } from '@/components/loading';
import {
  useConversations,
  useCreateConversation,
  useDeleteConversation,
} from '@/hooks/useConversations';
import type { Conversation } from '@/db/schema';

export const ConversationList: React.FC = (): JSX.Element => {
  const router = useRouter();
  const sidebarRef = useRef<SidebarMenuRef>(null);

  const { data: conversations = [], isLoading, error } = useConversations();
  const createConversationMutation = useCreateConversation();
  const deleteConversationMutation = useDeleteConversation();

  const handleNewConversation = async () => {
    try {
      const newConversation = await createConversationMutation.mutateAsync(
        `Chat ${new Date().toLocaleString()}`
      );
      router.push(`/conversations/${newConversation.id}`);
      sidebarRef.current?.close();
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await deleteConversationMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const handleConversationClick = (conversationId: string) => {
    router.push(`/conversations/${conversationId}`);
    sidebarRef.current?.close();
  };

  const renderConversationList = () => {
    if (isLoading) {
      return (
        <div className="p-4">
          <LoadingSpinner size="sm" text="Loading conversations..." />
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4">
          <p className="text-red-600 text-sm">Error loading conversations</p>
        </div>
      );
    }

    if (conversations.length === 0) {
      return (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No conversations yet. Start a new chat to save conversations.
        </p>
      );
    }

    return (
      <div className="space-y-2">
        {conversations.map(conversation => (
          <div
            key={conversation.id}
            className="flex items-center justify-between p-3 rounded-lg transition-colors bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="flex items-center flex-1">
              <button
                onClick={() => handleConversationClick(conversation.id)}
                className="flex items-center flex-1 text-left cursor-pointer"
              >
                <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">
                    {conversation.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(conversation.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </button>
            </div>
            <button
              onClick={() => handleDeleteConversation(conversation.id)}
              disabled={deleteConversationMutation.isPending}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50"
              title="Delete conversation"
            >
              {deleteConversationMutation.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <SidebarMenu
      ref={sidebarRef}
      title="Conversations"
      triggerButtonTitle="Open conversations"
      closeButtonTitle="Close conversations"
    >
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleNewConversation}
          disabled={createConversationMutation.isPending}
          className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createConversationMutation.isPending ? (
            <LoadingSpinner size="sm" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          New Conversation
        </button>
      </div>
      {createConversationMutation.error && (
        <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded">
          {createConversationMutation.error.message}
        </div>
      )}
      {renderConversationList()}
    </SidebarMenu>
  );
};
