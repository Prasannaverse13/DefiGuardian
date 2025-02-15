import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Terminal } from "lucide-react";
import { chatWithAI } from "@/lib/ai";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chatWithAI(
        userMessage,
        messages.map(m => m.content)
      );
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error in AI chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-[600px] flex flex-col bg-black/60 backdrop-blur-xl border border-neon-blue/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-neon-purple font-mono">
          <Terminal className="h-5 w-5" />
          [AI_SECURITY_ASSISTANT]
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`rounded-none px-4 py-2 max-w-[80%] font-mono border ${
                    message.role === 'user'
                      ? 'bg-neon-purple/10 border-neon-purple/30 text-white'
                      : 'bg-black/40 border-neon-blue/30 text-neon-blue'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-none px-4 py-2 bg-black/40 border border-neon-blue/30">
                  <Loader2 className="h-5 w-5 animate-spin text-neon-blue" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="[ENTER_SECURITY_QUERY]"
            className="font-mono bg-black/40 border-neon-purple/30 text-white placeholder:text-neon-purple/50"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-neon-purple hover:bg-neon-pink transition-colors duration-300"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}