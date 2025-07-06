import { NextRequest, NextResponse } from 'next/server';
import { llmService } from '@/services/llm.service';

// Re-export types for API consumers
export type {
  ListItemType,
  AdviceListType,
  AiResponseStructured,
  AiRequestInput,
} from '@/services/llm.service';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const messages = await req.json();
    const response = await llmService.generateResponse(messages);
    return NextResponse.json(response);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
