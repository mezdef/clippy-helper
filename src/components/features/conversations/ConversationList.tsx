'use client';
import React, { forwardRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { SidebarMenuRef } from '@/components/layout';
import { LoadingSpinner } from '@/components/ui/loading';
import {
  useConversations,
  useDeleteConversation,
} from '@/hooks/useConversations';
import { ConversationItem } from './ConversationItem';

interface ConversationListProps {
  onConversationClick?: (conversationId: string) => void;
  onDeleteConversation?: (conversationId: string) => void;
  className?: string;
  sidebarRef?: React.RefObject<SidebarMenuRef>;
}

const ConversationListComponent = forwardRef<
  HTMLDivElement,
  ConversationListProps
>(
  (
    { onConversationClick, onDeleteConversation, className = '', sidebarRef },
    ref
  ): React.ReactElement => {
    const router = useRouter();
    const pathname = usePathname();

    const { data: conversations = [], isLoading, error } = useConversations();
    const deleteConversationMutation = useDeleteConversation();

    // Extract conversation ID from current pathname
    const activeConversationId = pathname.startsWith('/conversations/')
      ? pathname.split('/')[2]
      : null;

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

    // Navigate to the conversation page when clicked and close the sidebar
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
            No conversations yet. Click New Conversation above to start.
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
        {renderConversationList()}
      </div>
    );
  }
);

ConversationListComponent.displayName = 'ConversationListComponent';

// Memoize the component to prevent unnecessary re-renders
export const ConversationList = React.memo(ConversationListComponent);
