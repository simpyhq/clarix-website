"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi, I'm Clarix — your AI assistant. Ask me anything about how we can help you, our pricing, or how setup works." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      const reply = data.reply || "Sorry, I'm having trouble right now. Email jarvis@simpyhq.com and we'll help you out.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Email jarvis@simpyhq.com and we'll get back to you." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-20 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[380px] max-h-[520px] z-50 flex flex-col rounded-xl border border-[#e2e8f0] bg-white shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#0f172a] px-4 py-3.5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-[#e2e8f0] flex items-center justify-center">
                <span className="text-[#0f172a] text-xs font-bold">C</span>
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
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8f9fa]" style={{ maxHeight: "340px" }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#0f172a] text-white rounded-br-sm"
                    : "bg-[#f8f9fa] border border-[#e2e8f0] text-[#0f172a] rounded-bl-sm"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#f8f9fa] border border-[#e2e8f0] rounded-xl rounded-bl-sm px-3.5 py-2.5">
                  <Loader2 size={14} className="text-[#64748b] animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-[#e2e8f0] p-3 flex gap-2 bg-white flex-shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask a question..."
              className="flex-1 text-sm bg-[#f8f9fa] border border-[#e2e8f0] rounded-lg px-3 py-2 text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#0f172a] transition-colors"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-lg bg-[#0f172a] hover:bg-[#1e293b] disabled:bg-[#e2e8f0] text-white flex items-center justify-center transition-colors flex-shrink-0"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-[#0f172a] hover:bg-[#1e293b] text-white shadow-lg flex items-center justify-center transition-all hover:scale-105"
        aria-label="Open Clarix chat"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </>
  );
}
