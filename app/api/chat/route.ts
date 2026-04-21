import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Clarix, a friendly and knowledgeable AI assistant for the Clarix website. Your job is to help visitors understand what Clarix does, answer questions about pricing, and guide them toward booking a consultation.

About Clarix:
- We build, configure, and maintain personalized AI assistants for businesses, professionals, and individuals
- Every client gets a dedicated Mac mini with their AI running 24/7
- The assistant connects to WhatsApp, iMessage, Discord, and email
- Setup fee: $2,500 (includes Mac mini, discovery consultation, configuration, and 2 months Pro support)
- Basic plan: $100/month (keep-alive, updates, security patches)
- Pro plan: $250/month (optimization, new skills, LLM tuning, 2 hrs support/month)
- Hourly work: $125/hr in 15-minute increments, remote via Tailscale
- Founded by Michael Simpson (CEO, OS Pipe & Supply), operated by Christian Simpson
- Contact: jarvis@simpyhq.com
- Start with the intake form at /intake

Keep answers concise, warm, and professional. If someone asks something you can't answer, direct them to jarvis@simpyhq.com or the intake form. Never make up pricing or features not listed above.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Limit context to last 10 messages to keep cost low
    const trimmed = messages.slice(-10);

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_CHAT_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://clarix-website.vercel.app",
        "X-Title": "Clarix Support Chat"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3.5-haiku",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...trimmed
        ],
        max_tokens: 400,
        temperature: 0.7
      })
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("OpenRouter error:", data);
      return NextResponse.json({ error: "AI unavailable" }, { status: 502 });
    }

    const reply = data.choices?.[0]?.message?.content || "Sorry, I'm having trouble right now. Email us at jarvis@simpyhq.com and we'll get back to you.";
    return NextResponse.json({ reply });

  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
