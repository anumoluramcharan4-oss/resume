// ==========================================
// src/pages/CareerAdvisor.jsx
// ==========================================
// Minimalist, calm AI Career Advisor chat interface
// Inspired by Notion AI and Linear — clean message bubbles with fixed bottom input bar

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Zap,
  Sparkles,
  RefreshCw,
  UserCircle2,
  Trash2
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";

const suggestedPrompts = [
  "How can I optimize my resume bullet points for ATS scanners?",
  "What skills should I learn next to target Senior Frontend roles?",
  "How do I highlight technical achievements without inflating metrics?",
  "What questions should I expect in a full-stack system design interview?"
];

const CareerAdvisor = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await api.get("/advisor/profile");
        if (res.data?.advisor?.chatHistory?.length > 0) {
          setMessages(
            res.data.advisor.chatHistory.map((m) => ({
              id: m._id || Math.random().toString(),
              sender: m.sender === "user" ? "user" : "ai",
              text: m.text,
            }))
          );
        } else {
          // Default welcoming greeting
          setMessages([
            {
              id: "welcome-1",
              sender: "ai",
              text: `Hello ${user?.name ? user.name.split(" ")[0] : "there"}! I'm your AI Career Advisor. I have context on your resume, target roles, and skill gaps. How can I help you accelerate your search today?`,
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch chat history", err);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchChatHistory();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (messageText) => {
    const textToSend = messageText || inputValue;
    if (!textToSend.trim() || loading) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const res = await api.post("/advisor/chat", { message: textToSend.trim() });
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: res.data.response || "I have analyzed your request. Here are my recommendations...",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      toast.error("Failed to send message. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: "I encountered an issue processing that query. Please verify your connection or try a different question.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: "cleared-welcome",
        sender: "ai",
        text: "Conversation cleared. How can I assist you with your career goals today?",
      },
    ]);
    toast.success("Chat history cleared");
  };

  return (
    <DashboardLayout title="AI Career Advisor">
      <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-4xl mx-auto card-clean rounded-2xl bg-[#131316] border border-white/[0.08] overflow-hidden">
        
        {/* Top Minimal Bar */}
        <div className="h-14 px-6 border-b border-white/[0.08] bg-[#0E0E11] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Zap size={14} className="fill-blue-400" />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-white tracking-tight leading-none">
                AI Career Advisor
              </h2>
              <span className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClearHistory}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-2 py-1 rounded-lg hover:bg-white/[0.04]"
            title="Clear conversation"
          >
            <Trash2 size={13} />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto chat-scroll p-4 sm:p-6 space-y-4">
          {initialLoading ? (
            <div className="flex items-center justify-center h-full text-xs text-zinc-500">
              <RefreshCw size={14} className="animate-spin mr-2" /> Connecting with AI Advisor...
            </div>
          ) : (
            <>
              {messages.map((msg) => {
                const isUser = msg.sender === "user";

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    {!isUser ? (
                      <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles size={13} />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-white/[0.08] text-zinc-300 flex items-center justify-center shrink-0 mt-0.5 text-xs font-semibold">
                        {user?.name ? user.name.charAt(0).toUpperCase() : <UserCircle2 size={14} />}
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`max-w-[82%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                        isUser
                          ? "bg-blue-600 text-white rounded-tr-sm"
                          : "bg-[#0E0E11] text-zinc-200 border border-white/[0.08] rounded-tl-sm whitespace-pre-wrap"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                );
              })}

              {/* Typing Indicator */}
              {loading && (
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Sparkles size={13} />
                  </div>
                  <div className="bg-[#0E0E11] border border-white/[0.08] rounded-2xl px-4 py-3 text-xs text-zinc-400 flex items-center gap-1.5 rounded-tl-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse delay-100" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse delay-200" />
                  </div>
                </div>
              )}

              {/* Suggested Prompts (when only welcome message present) */}
              {messages.length <= 1 && (
                <div className="pt-6 space-y-2">
                  <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block">
                    Suggested Questions
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {suggestedPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSend(prompt)}
                        className="text-left p-3 rounded-xl bg-[#0E0E11] hover:bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.12] text-xs text-zinc-300 transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Bottom Fixed Input Bar */}
        <div className="p-4 border-t border-white/[0.08] bg-[#0E0E11] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about resume phrasing, skills, or interview prep..."
              disabled={loading}
              className="flex-1 input-clean text-xs !py-3 !px-4 bg-[#131316] border border-white/[0.08] focus:border-blue-500 text-white placeholder:text-zinc-600 rounded-xl"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="btn-primary text-xs !py-3 !px-4 shrink-0 disabled:opacity-40"
              aria-label="Send message"
            >
              <Send size={14} />
            </button>
          </form>
          <p className="text-[10px] text-zinc-600 text-center mt-2 font-light">
            CareerAI provides guidance synthesized from enterprise recruiter criteria.
          </p>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default CareerAdvisor;
