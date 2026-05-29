import { NextResponse } from 'next/server';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── MyMemory API (free, no key needed, reliable from server) ─────────────────
async function myMemoryTranslate(text: string, to: string): Promise<string> {
  if (!text?.trim()) return text ?? '';
  // MyMemory limit ~500 chars/request — truncate if needed
  const q = text.slice(0, 450);
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=vi|${to}`;
  const res = await fetch(url, {
    headers: { 'Accept': 'application/json' },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`MyMemory HTTP ${res.status}`);
  const json = await res.json();
  if (json.responseStatus !== 200) {
    throw new Error(json.responseMessage ?? `MyMemory error ${json.responseStatus}`);
  }
  return json.responseData?.translatedText ?? text;
}

async function translateFree(title: string, questions: any[]) {
  const FIELDS = ['question', 'option_a', 'option_b', 'option_c', 'option_d', 'explanation'] as const;

  // Flat list: [title, q1.question, q1.option_a, ..., q1.explanation, q2.question, ...]
  const allTexts = [title, ...questions.flatMap((q) => FIELDS.map((f) => q[f] ?? ''))];

  const translateAll = async (to: string): Promise<string[]> => {
    const results: string[] = [];
    for (let i = 0; i < allTexts.length; i++) {
      results.push(await myMemoryTranslate(allTexts[i], to));
      // Small delay to avoid rate-limit (MyMemory: ~10 req/s anonymous)
      if (i < allTexts.length - 1) await delay(120);
    }
    return results;
  };

  const buildResult = (texts: string[]) => ({
    title: texts[0],
    questions: questions.map((q, qi) => {
      const base = 1 + qi * FIELDS.length;
      return Object.fromEntries(FIELDS.map((f, fi) => [f, texts[base + fi] ?? (q[f] ?? '')]));
    }),
  });

  // Both languages in parallel (different rate-limit buckets per langpair)
  const [cnTexts, twTexts] = await Promise.all([
    translateAll('zh-CN'),
    translateAll('zh-TW'),
  ]);

  return { 'zh-CN': buildResult(cnTexts), 'zh-TW': buildResult(twTexts), _engine: 'mymemory' };
}

// ─── Claude (premium, uses ANTHROPIC_API_KEY) ─────────────────────────────────
async function translateWithClaude(title: string, questions: any[]) {
  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const questionBlock = questions
    .map((q: any, i: number) =>
      `Q${i + 1}: ${q.question}\nA: ${q.option_a}\nB: ${q.option_b}\nC: ${q.option_c}\nD: ${q.option_d}\nExplanation: ${q.explanation ?? ''}`,
    )
    .join('\n\n');

  const prompt = `You are a Buddhist studies expert. Translate the following quiz from Vietnamese to Simplified Chinese (zh-CN) and Traditional Chinese (zh-TW). Use accurate Buddhist terminology. Return ONLY valid JSON, no markdown.

{
  "zh-CN": { "title": "...", "questions": [{"question":"...","option_a":"...","option_b":"...","option_c":"...","option_d":"...","explanation":"..."}] },
  "zh-TW": { "title": "...", "questions": [...] }
}

Title: ${title}
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
  if (start === -1 || end === 0) throw new Error('AI không trả về JSON hợp lệ.');
  return { ...JSON.parse(text.slice(start, end)), _engine: 'claude' };
}

// ─── Route ────────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const { title, questions } = await req.json();
    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: 'Thiếu dữ liệu: cần có title và questions.' }, { status: 400 });
    }

    const result = process.env.ANTHROPIC_API_KEY
      ? await translateWithClaude(title, questions)
      : await translateFree(title, questions);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Lỗi không xác định' }, { status: 500 });
  }
}
