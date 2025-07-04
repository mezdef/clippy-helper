import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ListItem = z.object({
  title: z.string(),
  content: z.string(),
});

const AdviceList = z.object({
  title: z.string(),
  list: z.array(ListItem),
});

type AdviceListType = z.infer<typeof AdviceList>;

export interface StructuredResponse extends OpenAI.Responses.Response {
  output_parsed: AdviceListType;
}

export async function POST(
  req: NextRequest
): Promise<StructuredResponse | NextResponse> {
  try {
    const { chatInput } = await req.json();
    if (!chatInput || typeof chatInput !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const response = await openai.responses.parse({
      model: 'gpt-4o-2024-08-06',
      input: [
        { role: 'system', content: 'Provide advice as an unordered list.' },
        {
          role: 'user',
          content: chatInput,
        },
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
