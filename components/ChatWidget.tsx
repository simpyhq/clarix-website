"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

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

Keep answers concise, warm, and professional. If someone asks a question you can't answer, direct them to jarvis@simpyhq.com or the intake form. Never make up pricing or features that aren't listed above.`;

export default function ChatWidget({ apiKey }: { apiKey: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi, I'm Clarix — your AI assistant. Ask me anything about how we can help you, our pricing, or how setup works." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://simpyhq.github.io/clarix-website/",
          "X-Title": "Clarix Support Chat"
        },
        body: JSON.stringify({
          model: "anthropic/claude-3.5-haiku",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.slice(-6),
            { role: "user", content: userMsg }
          ],
          max_tokens: 400,
          temperature: 0.7
        })
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "Sorry, I'm having trouble right now. Email us at jarvis@simpyhq.com and we'll get back to you shortly.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong on my end. Feel free to email jarvis@simpyhq.com and we'll help you out." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Chat window */}
      {open && (
        <div className="fixed bottom-20 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[380px] max-h-[520px] z-50 flex flex-col rounded-xl border border-[#E2E0DA] bg-white shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#0F1B3C] px-4 py-3.5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-[#D4A847] flex items-center justify-center">
                <span className="text-[#0F1B3C] text-xs font-bold">C</span>
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-none">Clarix</p>
                <p className="text-white/50 text-[10px] mt-0.5">AI Assistant · Online</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8F7F3]" style={{ maxHeight: "340px" }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#0F1B3C] text-white rounded-br-sm"
                      : "bg-white border border-[#E2E0DA] text-[#0D0D0D] rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#E2E0DA] rounded-xl rounded-bl-sm px-3.5 py-2.5">
                  <Loader2 size={14} className="text-[#B8902A] animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-[#E2E0DA] p-3 flex gap-2 bg-white flex-shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask a question..."
              className="flex-1 text-sm bg-[#F8F7F3] border border-[#E2E0DA] rounded-lg px-3 py-2 text-[#0D0D0D] placeholder-[#ABABAB] focus:outline-none focus:border-[#0F1B3C] transition-colors"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-lg bg-[#0F1B3C] hover:bg-[#1a2d5a] disabled:bg-[#E2E0DA] text-white flex items-center justify-center transition-colors flex-shrink-0"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-[#0F1B3C] hover:bg-[#1a2d5a] text-white shadow-lg flex items-center justify-center transition-all hover:scale-105"
        aria-label="Open chat"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </>
  );
}
