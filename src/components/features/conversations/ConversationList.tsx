'use client';
import React, { JSX, forwardRef, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading';
import { Button } from '@/components/ui';
import {
  useConversations,
  useCreateConversation,
  useDeleteConversation,
} from '@/hooks/useConversations';
import { ConversationItem } from './ConversationItem';
import type { SidebarMenuRef } from '@/components/layout';
import type { Conversation } from '@/db/schema';

interface ConversationListProps {
  onNewConversation?: () => void;
  onConversationClick?: (conversationId: string) => void;
  onDeleteConversation?: (conversationId: string) => void;
  showNewButton?: boolean;
  className?: string;
  sidebarRef?: React.RefObject<SidebarMenuRef>;
}

export const ConversationList = forwardRef<
  HTMLDivElement,
  ConversationListProps
>(
  (
    {
      onNewConversation,
      onConversationClick,
      onDeleteConversation,
      showNewButton = true,
      className = '',
      sidebarRef,
    },
    ref
  ): JSX.Element => {
    const router = useRouter();
    const pathname = usePathname();

    const { data: conversations = [], isLoading, error } = useConversations();
    const createConversationMutation = useCreateConversation();
    const deleteConversationMutation = useDeleteConversation();

    // Extract conversation ID from current pathname
    const activeConversationId = pathname.startsWith('/conversations/')
      ? pathname.split('/')[2]
      : null;

    const handleNewConversation = useCallback(async () => {
      try {
        const newConversation = await createConversationMutation.mutateAsync(
          `Chat ${new Date().toLocaleString()}`
        );
        router.push(`/conversations/${newConversation.id}`);
        sidebarRef?.current?.close();
        onNewConversation?.();
      } catch (error) {
        console.error('Error creating conversation:', error);
      }
    }, [createConversationMutation, router, sidebarRef, onNewConversation]);

    const handleDeleteConversation = useCallback(
      async (id: string) => {
        try {
          await deleteConversationMutation.mutateAsync(id);
          onDeleteConversation?.(id);
        } catch (error) {
          console.error('Error deleting conversation:', error);
        }
      },
      [deleteConversationMutation, onDeleteConversation]
    );

    const handleConversationClick = useCallback(
      (conversationId: string) => {
        router.push(`/conversations/${conversationId}`);
        sidebarRef?.current?.close();
        onConversationClick?.(conversationId);
      },
      [router, sidebarRef, onConversationClick]
    );

    const renderConversationList = useCallback(() => {
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
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={conversation.id === activeConversationId}
              onConversationClick={handleConversationClick}
              onDeleteConversation={handleDeleteConversation}
              isDeleting={deleteConversationMutation.isPending}
            />
          ))}
        </div>
      );
    }, [
      isLoading,
      error,
      conversations,
      activeConversationId,
      handleConversationClick,
      handleDeleteConversation,
      deleteConversationMutation.isPending,
    ]);

    return (
      <div ref={ref} className={className}>
        {showNewButton && (
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={handleNewConversation}
              disabled={createConversationMutation.isPending}
              icon={createConversationMutation.isPending ? undefined : Plus}
              variant="ghost"
              size="md"
              loading={createConversationMutation.isPending}
            >
              New Conversation
            </Button>
          </div>
        )}
        {createConversationMutation.error && (
          <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded">
            {createConversationMutation.error.message}
          </div>
        )}
        {renderConversationList()}
      </div>
    );
  }
);

ConversationList.displayName = 'ConversationList';
