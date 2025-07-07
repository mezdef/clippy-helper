import { Error } from '@/components/ui/Error';

export default function NotFound(): React.ReactElement {
  return (
    <Error
      title="Conversation not found"
      message="The conversation you're looking for doesn't exist or has been deleted."
    />
  );
}
