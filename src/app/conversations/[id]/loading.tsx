import { LoadingPage } from '@/components/ui/loading';

export default function ConversationLoadingPage(): React.ReactElement {
  return (
    <div className="flex flex-col h-screen">
      <LoadingPage text="Loading conversation..." />
    </div>
  );
}
