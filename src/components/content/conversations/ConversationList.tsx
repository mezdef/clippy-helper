'use client';
import React, { JSX, useState, useEffect } from 'react';
import { MessageSquare, Trash2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SidebarMenu } from '@/components/layout';
import type { Conversation } from '@/db/schema';

export const ConversationList: React.FC = (): JSX.Element => {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/conversations');
        if (response.ok) {
          const data = await response.json();
          setConversations(data);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setError('Failed to fetch conversations');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const deleteConversation = async (id: string) => {
    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setConversations(conversations.filter(conv => conv.id !== id));
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      setError('Failed to delete conversation');
    }
  };

  const startNewChat = () => {
    // Navigate to the new conversation page
    router.push('/conversations/new');
  };

  const handleConversationClick = (conversationId: string) => {
    router.push(`/conversations/${conversationId}`);
  };

  const renderConversationList = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading conversations...</span>
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
              onClick={() => deleteConversation(conversation.id)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
              title="Delete conversation"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <SidebarMenu
      title="Conversations"
      triggerButtonTitle="Open conversations"
      closeButtonTitle="Close conversations"
      onClose={() => {
        // The sidebar will close automatically when navigating
        // This callback can be used for any additional cleanup if needed
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={startNewChat}
          className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Conversation
        </button>
      </div>
      {renderConversationList()}
    </SidebarMenu>
  );
};
