import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getOpenAIApiKey } from "@/lib/openai-key";

export async function POST(request: NextRequest) {
  const apiKey = getOpenAIApiKey(request);
  if (!apiKey) {
    return NextResponse.json(
      { error: "Send Authorization: Bearer <your OpenAI API key> on each request." },
      { status: 401 },
    );
  }

  let body: { code?: string; language?: string; focus?: string; model?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.code?.trim()) {
    return NextResponse.json({ error: "`code` is required." }, { status: 400 });
  }

  const client = new OpenAI({ apiKey });
  const model = body.model?.trim() || "gpt-4o-mini";

  const system = `You are Prism Code Sentinel — a staff+ engineer specializing in secure design reviews.
Return JSON with:
- headline: string (one line verdict)
- findings: { severity: "critical"|"high"|"medium"|"low"|"info"; title: string; detail: string; exploit_sketch?: string; fix: string }[]
- tests_to_add: string[]
- refactors: string[]
Bias toward concrete, testable fixes. If unsure, lower severity and say what evidence is missing.`;

  const user = `Language: ${body.language || "unspecified"}\nFocus: ${body.focus || "security + correctness"}\n\nCODE:\n${body.code}`;

  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.15,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });
    const text = completion.choices[0]?.message?.content;
    if (!text) return NextResponse.json({ error: "Empty model response." }, { status: 502 });
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return NextResponse.json({ raw: text }, { status: 200 });
    }
    return NextResponse.json({ result: parsed, model });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "OpenAI request failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
