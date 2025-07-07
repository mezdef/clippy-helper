'use client';
import React, {
  JSX,
  useEffect,
  ReactNode,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from 'react';
import { MessagesSquare, X, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSidebar } from '@/hooks/useSidebar';
import { useCreateConversation } from '@/hooks/useConversations';
import { Button } from '@/components/ui';

interface SidebarMenuProps {
  children: ReactNode;
  title: string;
  triggerButtonTitle?: string;
  closeButtonTitle?: string;
  className?: string;
  onClose?: () => void;
  sidebarId?: string;
}

export interface SidebarMenuRef {
  close: () => void;
}

export const SidebarMenu = forwardRef<SidebarMenuRef, SidebarMenuProps>(
  (
    {
      children,
      title,
      triggerButtonTitle = 'Open menu',
      closeButtonTitle = 'Close menu',
      className = '',
      onClose,
      sidebarId = 'default',
    },
    ref
  ) => {
    const router = useRouter();
    const { isOpen, closeSidebar, toggleSidebar, isLoading } =
      useSidebar(sidebarId);
    const createConversationMutation = useCreateConversation();

    const handleNewConversation = useCallback(async () => {
      try {
        const newConversation = await createConversationMutation.mutateAsync(
          `Chat ${new Date().toLocaleString()}`
        );
        router.push(`/conversations/${newConversation.id}`);
        closeSidebar();
        onClose?.();
      } catch (error) {
        console.error('Error creating conversation:', error);
      }
    }, [createConversationMutation, router, closeSidebar, onClose]);

    // Expose close function to parent component
    useImperativeHandle(ref, () => ({
      close: () => {
        closeSidebar();
        onClose?.();
      },
    }));

    // Prevent body scroll when sidebar is open
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }

      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isOpen]);

    const handleClose = () => {
      closeSidebar();
      onClose?.();
    };

    return (
      <>
        <Button
          onClick={toggleSidebar}
          disabled={isLoading}
          icon={MessagesSquare}
          variant="default"
          size="md"
          className="fixed top-4 left-4 z-40 w-10 h-10 p-0"
          title={triggerButtonTitle}
        />

        {isOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-50 transition-opacity cursor-pointer"
            onClick={handleClose}
          />
        )}

        <div
          className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          } ${className}`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <Button
                onClick={handleNewConversation}
                disabled={createConversationMutation.isPending}
                icon={createConversationMutation.isPending ? undefined : Plus}
                variant="default"
                size="md"
                loading={createConversationMutation.isPending}
              >
                New Conversation
              </Button>
              <Button
                onClick={handleClose}
                disabled={isLoading}
                icon={X}
                variant="ghost"
                size="sm"
                title={closeButtonTitle}
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {title}
              </h2>
              {createConversationMutation.error && (
                <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded">
                  {createConversationMutation.error.message}
                </div>
              )}
              {children}
            </div>
          </div>
        </div>
      </>
    );
  }
);

SidebarMenu.displayName = 'SidebarMenu';
