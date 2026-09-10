import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Bot,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  CornerDownLeft,
  Loader2,
  Cpu,
} from 'lucide-react';
import { AnalysisResult, Recycler, ChatMessage } from '../types';

interface ItemChatbotProps {
  analysis: AnalysisResult | null;
  matchedRecyclers?: Recycler[];
}

export const ItemChatbot: React.FC<ItemChatbotProps> = ({
  analysis,
  matchedRecyclers = [],
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize/reset conversation when analysis item changes
  useEffect(() => {
    if (analysis && (analysis.imageUrl || analysis.device_summary)) {
      setMessages([
        {
          id: `welcome-${analysis.id}`,
          role: 'assistant',
          text: `I have reviewed the uploaded photo of this ${analysis.device_summary}. I can answer questions about the visible components in this photo, estimated recovery value, handling precautions, or why specific recyclers were recommended. What would you like to know?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } else {
      setMessages([]);
    }
  }, [analysis?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  const suggestedQuestions = [
    'What is this?',
    'Why is this valuable?',
    'Is it safe to handle?',
    'What materials can be recovered?',
    'Why did you recommend this recycler?',
    'How can I store it safely?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading || !analysis) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Append user message immediately
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputQuery('');
    setIsLoading(true);

    try {
      // Send message, current image, analysis context, recyclers, and conversation history
      const res = await fetch('/api/item-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          image: analysis.imageUrl,
          analysis,
          recyclers: matchedRecyclers,
          history: updatedMessages.slice(-6).map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const botReply =
        data.answer ||
        'I am analyzing this item based on the visual photo and component breakdown.';

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Error communicating with item chatbot:', err);
      // Helpful fallback response
      const fallbackMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        role: 'assistant',
        text: `Regarding this ${analysis.device_summary}: Key recoverable materials include ${analysis.materials.map((m) => m.name).join(', ')} with an estimated total value of ₹${analysis.total_estimated_value}. Safety guidance: ${analysis.safety.warnings[0] || 'Wear protective gloves and eye protection.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // If no active analysis is available, show required fallback prompt
  if (!analysis || (!analysis.imageUrl && !analysis.device_summary)) {
    return (
      <div
        id="item-chatbot-empty-state"
        className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-2 shadow-xs"
      >
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
          <HelpCircle className="w-5 h-5" />
        </div>
        <p className="text-sm font-medium text-slate-700">
          Analyze an e-waste image first to start a conversation about it.
        </p>
      </div>
    );
  }

  return (
    <div
      id="item-chatbot-section"
      className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
    >
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base sm:text-lg text-white">
                Discuss this item with EcoValue AI
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Image-Aware
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Ask questions directly about this photo, detected components, scrap value, or handling safety
            </p>
          </div>
        </div>

        {/* Current Context Chip */}
        <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-xl self-start sm:self-auto text-xs">
          {analysis.imageUrl && (
            <img
              src={analysis.imageUrl}
              alt="Context item"
              className="w-7 h-7 rounded-md object-cover border border-slate-600 shrink-0"
            />
          )}
          <div className="text-left line-clamp-1">
            <span className="text-slate-400 text-[10px] block leading-tight">Active Context:</span>
            <span className="font-bold text-emerald-400 text-[11px] truncate block max-w-[180px]">
              {analysis.device_summary}
            </span>
          </div>
        </div>
      </div>

      {/* Suggested Questions Section */}
      <div className="px-4 sm:px-5 py-3 bg-slate-50 border-b border-slate-200">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
          Suggested Questions for This Item:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              id={`suggested-q-${idx}`}
              type="button"
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 text-slate-700 border border-slate-200 transition-all text-left shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        id="item-chat-messages-container"
        className="p-4 sm:p-5 space-y-4 max-h-[380px] min-h-[220px] overflow-y-auto bg-slate-50/40"
      >
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed max-w-[85%] sm:max-w-[75%] shadow-2xs ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-tr-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div
                  className={`text-[10px] mt-1.5 text-right font-medium ${
                    isUser ? 'text-slate-400' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-white border border-slate-200 text-slate-600 rounded-2xl rounded-tl-xs px-4 py-3 text-xs shadow-2xs flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Analyzing photo and assessment data...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            id="item-chat-input"
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Ask about this specific item (e.g., 'Is it safe to handle?', 'Why is this valuable?')..."
            className="flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-100 disabled:cursor-not-allowed transition-all"
          />
          <button
            id="item-chat-send-btn"
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors shrink-0 cursor-pointer disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
        <p className="text-[10px] text-slate-400 mt-2 text-center">
          EcoValue AI uses your active uploaded photo and report context to answer specific inquiries.
        </p>
      </div>
    </div>
  );
};
