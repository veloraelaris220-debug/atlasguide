import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Loader as Loader2, Sparkles, Trash2, Clock, Plus, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AIBotAnimation } from '@/components/AIBotAnimation';
import ReactMarkdown from 'react-markdown';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/travel-guide-chat`;
const STORAGE_KEY = 'wanderlust-chat-history';

const GREETING: Message = {
  role: 'assistant',
  content: 'Your journey begins here. How may I assist your travel plans today?',
};

function loadSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: ChatSession[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function deriveTitle(messages: Message[]): string {
  const first = messages.find((m) => m.role === 'user');
  if (!first) return 'New Chat';
  return first.content.length > 40 ? first.content.slice(0, 40) + '…' : first.content;
}

const Chat = () => {
  const [sessions, setSessions] = useState<ChatSession[]>(loadSessions);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Persist sessions whenever they change
  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeId]);

  const persistCurrentChat = useCallback(
    (msgs: Message[]) => {
      if (msgs.length <= 1) return; // only greeting
      setSessions((prev) => {
        const title = deriveTitle(msgs);
        if (activeId) {
          return prev.map((s) =>
            s.id === activeId ? { ...s, messages: msgs, title, updatedAt: Date.now() } : s
          );
        }
        const newId = generateId();
        setActiveId(newId);
        return [{ id: newId, title, messages: msgs, updatedAt: Date.now() }, ...prev];
      });
    },
    [activeId]
  );

  const startNewChat = () => {
    setActiveId(null);
    setMessages([GREETING]);
    setInput('');
  };

  const loadSession = (session: ChatSession) => {
    setActiveId(session.id);
    setMessages(session.messages);
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeId === id) startNewChat();
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    let assistantContent = '';

    try {
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!response.ok || !response.body) throw new Error('Failed to get response');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'assistant', content: assistantContent };
                return updated;
              });
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Persist after stream completes
      const finalMessages = [...nextMessages, { role: 'assistant' as const, content: assistantContent }];
      persistCurrentChat(finalMessages);
    } catch (error) {
      console.error('Chat error:', error);
      const errMsg: Message = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex flex-1 pt-16 overflow-hidden">
        {/* Sidebar – Chat History */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="border-r border-border bg-card flex flex-col overflow-hidden shrink-0"
            >
              <div className="p-4 border-b border-border">
                <Button onClick={startNewChat} className="w-full gap-2 rounded-xl" variant="outline">
                  <Plus className="w-4 h-4" />
                  New Chat
                </Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {sessions.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-8">No chat history yet</p>
                  )}
                  {sessions.map((session) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                        activeId === session.id
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted text-foreground'
                      }`}
                      onClick={() => loadSession(session)}
                    >
                      <Clock className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                      <span className="text-sm truncate flex-1">{session.title}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(session.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
          {/* Chat Header */}
          <div className="border-b border-border px-6 py-3 flex items-center gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <button
              onClick={() => setSidebarOpen((p) => !p)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-ocean flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">Travel Guide</h2>
                <p className="text-xs text-muted-foreground">AI-powered travel assistant</p>
              </div>
            </div>
            <div className="ml-auto">
              <Link to="/explore">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Explore
                </Button>
              </Link>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea ref={scrollRef} className="flex-1 px-4 md:px-8 py-8">
            <div className="max-w-2xl mx-auto space-y-6">
              {messages.length === 1 && (
                <div className="flex flex-col items-center justify-center py-12 space-y-6">
                  <AIBotAnimation />
                  <div className="text-center space-y-3">
                    <h3 className="text-2xl font-bold text-foreground">Welcome to Your Travel Guide</h3>
                    <p className="text-muted-foreground max-w-md">
                      Ask me anything about destinations, travel tips, itineraries, and more. I'm here to help plan your perfect journey!
                    </p>
                  </div>
                </div>
              )}
              {messages.slice(1).map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-ocean flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-xs md:max-w-lg px-4 py-3 rounded-3xl text-sm leading-relaxed shadow-sm ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-slate-800 text-foreground rounded-bl-none border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      message.content
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-ocean flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                  <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-3xl rounded-bl-none border border-slate-200 dark:border-slate-700">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t border-slate-200 dark:border-slate-700 p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <div className="max-w-2xl mx-auto flex gap-3">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="How can I help you today?"
                  className="flex-1 rounded-full px-5 py-3 h-12 border-2 border-blue-200 dark:border-blue-900 focus:border-blue-500 dark:focus:border-blue-500 bg-white dark:bg-slate-800 transition-all"
                  disabled={isLoading}
                />
                <motion.div
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              </div>
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="rounded-full w-12 h-12 shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
