import { NextRequest, NextResponse } from 'next/server';
import { messageService } from '@/db/services';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const messages = await messageService.getByConversationId(params.id);
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { role, content, structuredContent } = await req.json();

    if (!role || !content) {
      return NextResponse.json(
        { error: 'Role and content are required' },
        { status: 400 }
      );
    }

    const message = await messageService.create({
      conversationId: params.id,
      role,
      content,
      structuredContent,
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}
