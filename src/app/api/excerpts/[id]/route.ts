import { NextRequest, NextResponse } from 'next/server';
import { excerptService } from '@/services';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { content, title } = await request.json();

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
      );
    }

    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'Title is required and must be a string' },
        { status: 400 }
      );
    }

    const updatedExcerpt = await excerptService.update(id, { content, title });
    return NextResponse.json(updatedExcerpt);
  } catch (error) {
    console.error('Error updating excerpt:', error);
    return NextResponse.json(
      { error: 'Failed to update excerpt' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await excerptService.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting excerpt:', error);
    return NextResponse.json(
      { error: 'Failed to delete excerpt' },
      { status: 500 }
    );
  }
}
