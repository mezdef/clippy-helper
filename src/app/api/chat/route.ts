import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { env } from '@/lib/env';

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

const ListItem = z.object({
  title: z.string(),
  content: z.string(),
});

const AdviceList = z.object({
  title: z.string(),
  list: z.array(ListItem),
});

export type ListItemType = z.infer<typeof ListItem>;
export type AdviceListType = z.infer<typeof AdviceList>;

export interface AiResponseStructured extends OpenAI.Responses.Response {
  output_parsed: AdviceListType;
}

export interface AiRequestInput {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const chatLog = await req.json();
    if (!chatLog || typeof chatLog[chatLog.length - 1].content !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const response = await openai.responses.parse({
      model: 'gpt-4o-2024-08-06',
      input: [
        { role: 'system', content: 'Provide advice as an unordered list.' },
        ...chatLog,
      ],
      text: {
        format: zodTextFormat(AdviceList, 'zod_schema'),
      },
    });

    return NextResponse.json(response);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
