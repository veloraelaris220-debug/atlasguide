import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader as Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AIBotAnimation } from '@/components/AIBotAnimation';
import ReactMarkdown from 'react-markdown';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/travel-guide-chat`;

export const TravelGuideChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Your journey begins here. How may I assist your travel plans today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
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
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to get response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';

      // Add empty assistant message
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
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
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
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full shadow-2xl hover:shadow-3xl transition-shadow group"
          >
            <motion.div
              className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center relative overflow-hidden"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-300 via-blue-500 to-blue-700 opacity-90"
              />
              <div className="absolute inset-0 flex items-center justify-center gap-2 z-10">
                <motion.div
                  className="w-3 h-3 bg-white rounded-full"
                  animate={{ scaleY: [1, 0, 1] }}
                  transition={{ duration: 0.3, times: [0, 0.5, 1], repeat: Infinity, repeatDelay: 3 }}
                />
                <motion.div
                  className="w-3 h-3 bg-white rounded-full"
                  animate={{ scaleY: [1, 0, 1] }}
                  transition={{ duration: 0.3, times: [0, 0.5, 1], repeat: Infinity, repeatDelay: 3 }}
                />
              </div>
              <motion.div
                className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full opacity-40"
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-8 right-8 z-50 w-[420px] h-[600px] bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700"
          >
            {/* Header with Bot Animation */}
            <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-6 flex flex-col items-center justify-center relative">
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="mb-4"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-300 to-blue-500 rounded-3xl flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-300 via-blue-500 to-blue-700 rounded-3xl opacity-90" />
                  <div className="absolute inset-0 flex items-center justify-center gap-3 z-10">
                    <motion.div
                      className="w-3 h-3 bg-white rounded-full"
                      animate={{ scaleY: [1, 0, 1] }}
                      transition={{ duration: 0.3, times: [0, 0.5, 1], repeat: Infinity, repeatDelay: 3 }}
                    />
                    <motion.div
                      className="w-3 h-3 bg-white rounded-full"
                      animate={{ scaleY: [1, 0, 1] }}
                      transition={{ duration: 0.3, times: [0, 0.5, 1], repeat: Infinity, repeatDelay: 3 }}
                    />
                  </div>
                  <motion.div
                    className="absolute top-2 left-2 w-4 h-4 bg-white rounded-full opacity-40"
                    animate={{ opacity: [0.2, 0.6, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>
              <h3 className="font-semibold text-white text-lg">Travel Guide</h3>
              <p className="text-xs text-blue-100">AI-powered travel assistant</p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea ref={scrollRef} className="flex-1 p-4">
              <div className="space-y-4">
                {messages.slice(1).map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-3 rounded-3xl text-sm leading-relaxed shadow-sm ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none'
                          : 'bg-white dark:bg-slate-700 text-foreground rounded-bl-none border border-slate-200 dark:border-slate-600'
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
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white dark:bg-slate-700 px-4 py-3 rounded-3xl rounded-bl-none border border-slate-200 dark:border-slate-600">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="How can I help?"
                    className="flex-1 rounded-full px-4 py-2.5 border-2 border-blue-200 dark:border-blue-900 focus:border-blue-500 dark:focus:border-blue-500 bg-white dark:bg-slate-700 transition-all"
                    disabled={isLoading}
                  />
                  <motion.div
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400"
                    animate={{ scale: [1, 1.15, 1], rotate: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                </div>
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="rounded-full w-10 h-10 shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
