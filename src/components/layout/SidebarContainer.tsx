'use client';
import React, { useRef } from 'react';
import { ConversationList } from '@/components/features/conversations';
import { SidebarMenu, type SidebarMenuRef } from '@/components/layout';

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
