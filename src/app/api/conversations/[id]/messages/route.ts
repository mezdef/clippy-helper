import { NextRequest, NextResponse } from 'next/server';
import { messageService } from '@/services';
import { HTTP_STATUS, ERROR_MESSAGES } from '@/constants';

// GET /api/conversations/[id]/messages - Retrieves all messages for a conversation
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.VALIDATION },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const messages = await messageService.getByConversationId(id);
    const formattedMessages = messageService.formatMessagesForUI(messages);

    return NextResponse.json(formattedMessages, { status: HTTP_STATUS.OK });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

// POST /api/conversations/[id]/messages - Creates a new message in a conversation
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.VALIDATION },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const { role, content, aiResponse } = await req.json();

    if (!role || !content) {
      return NextResponse.json(
        { error: 'Role and content are required' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const message = await messageService.create({
      conversationId: id,
      role,
      content,
      aiResponse,
    });

    return NextResponse.json(message, { status: HTTP_STATUS.CREATED });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.MESSAGE_CREATE_FAILED },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
