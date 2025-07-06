'use client';
import React, { useRef } from 'react';
import { SidebarMenu, type SidebarMenuRef } from '@/components/layout';
import { ConversationList } from './conversations';

export const SidebarContainer: React.FC = () => {
  const sidebarRef = useRef<SidebarMenuRef>(null);

  return (
    <SidebarMenu
      ref={sidebarRef}
      sidebarId="conversations"
      title="Conversations"
      triggerButtonTitle="Open conversations"
      closeButtonTitle="Close conversations"
    >
      <ConversationList
        sidebarRef={sidebarRef as React.RefObject<SidebarMenuRef>}
      />
    </SidebarMenu>
  );
};
