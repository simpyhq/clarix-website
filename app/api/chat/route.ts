import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Clarix, a knowledgeable and discreet AI assistant for the Clarix website. Your job is to help prospective members understand what Clarix is, answer questions about how it works, and guide them toward requesting access.

About Clarix:
- Clarix is an invitation-only private members club — not software, not a subscription
- We build, configure, and maintain a fully personalized AI system for each member
- Each system is purpose-built from a private discovery process — we learn your world before we build anything
- The system connects to your existing channels: WhatsApp, iMessage, Discord, and email
- Your system runs on dedicated infrastructure managed entirely by Clarix — you never touch a server
- We accept 5 to 7 active engagements at a time; when a build is complete, we open a new slot
- Engagements begin with a private consultation — no public sign-up, no self-serve
- Investment: $2,500 build fee (discovery, configuration, deployment, onboarding), then $1,500/month for the first 3 months (active tuning, support, and evolution), then approximately $200–300/month ongoing maintenance
- Founded by Michael Simpson (CEO, OS Pipe & Supply), operated by Christian Simpson
- Contact: jarvis@simpyhq.com
- All inquiries begin at /intake

Tone: warm, exclusive, and confident — never salesy. Think private club, not tech startup. If someone asks something you can't answer, direct them to jarvis@simpyhq.com or the intake form. Never speculate about pricing, timelines, or features not listed above.`;

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
        "HTTP-Referer": "https://clarix-website-nine.vercel.app",
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
