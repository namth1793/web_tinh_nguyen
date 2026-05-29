import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { title, questions } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY chưa được cấu hình. Thêm API key vào file .env.local rồi khởi động lại server.' },
        { status: 500 },
      );
    }

    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: 'Thiếu dữ liệu: cần có title và questions.' }, { status: 400 });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const questionBlock = questions
      .map(
        (q: any, i: number) =>
          `Q${i + 1}: ${q.question}\nA: ${q.option_a}\nB: ${q.option_b}\nC: ${q.option_c}\nD: ${q.option_d}\nExplanation: ${q.explanation ?? ''}`,
      )
      .join('\n\n');

    const prompt = `You are a Buddhist studies expert fluent in Vietnamese, Simplified Chinese, and Traditional Chinese.

Translate the following Buddhist quiz from Vietnamese to BOTH Simplified Chinese (zh-CN) and Traditional Chinese (zh-TW).
Use accurate Buddhist terminology in both Chinese variants.
Return ONLY a valid JSON object — no explanation, no markdown fences.

Required JSON structure:
{
  "zh-CN": {
    "title": "<Simplified Chinese title>",
    "questions": [
      {
        "question": "<translated question>",
        "option_a": "<translated A>",
        "option_b": "<translated B>",
        "option_c": "<translated C>",
        "option_d": "<translated D>",
        "explanation": "<translated explanation>"
      }
    ]
  },
  "zh-TW": {
    "title": "<Traditional Chinese title>",
    "questions": [ ... same structure ... ]
  }
}

Quiz title: ${title}

Questions:
${questionBlock}`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8096,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}') + 1;
    if (start === -1 || end === 0) {
      return NextResponse.json({ error: 'AI không trả về JSON hợp lệ. Thử lại.' }, { status: 500 });
    }

    const parsed = JSON.parse(text.slice(start, end));
    return NextResponse.json(parsed);
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Lỗi không xác định' }, { status: 500 });
  }
}
