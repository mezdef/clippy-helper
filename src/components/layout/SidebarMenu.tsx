'use client';
import React, { JSX, useState, useEffect, ReactNode } from 'react';
import { MessagesSquare, X } from 'lucide-react';

interface SidebarMenuProps {
  children: ReactNode;
  title: string;
  triggerButtonTitle?: string;
  closeButtonTitle?: string;
  className?: string;
  onClose?: () => void;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({
  children,
  title,
  triggerButtonTitle = 'Open menu',
  closeButtonTitle = 'Close menu',
  className = '',
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
    onClose?.();
  };

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

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-40 p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        title={triggerButtonTitle}
      >
        <MessagesSquare className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-50 transition-opacity cursor-pointer"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${className}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            <button
              onClick={closeSidebar}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors cursor-pointer"
              title={closeButtonTitle}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">{children}</div>
        </div>
      </div>
    </>
  );
};
