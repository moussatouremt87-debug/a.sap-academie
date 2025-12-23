import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Calendar, Video, Monitor, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const quickActions = [
  { icon: Calendar, label: "Prendre RDV", prompt: "Je souhaite prendre un rendez-vous avec un consultant." },
  { icon: Video, label: "Google Meet", prompt: "Je voudrais organiser une réunion Google Meet." },
  { icon: Monitor, label: "Teams", prompt: "Je préfère une réunion Microsoft Teams." },
];

const suggestedPrompts = [
  "Je veux déployer SAP dans mon entreprise",
  "Quelles formations SAP proposez-vous ?",
  "J'ai besoin d'un audit de mon SI",
  "Comment fonctionne votre accompagnement ?",
];

export default function Agent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content.trim(), messages }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  setMessages((prev) => {
                    const updated = [...prev];
                    const lastMessage = updated[updated.length - 1];
                    if (lastMessage.role === "assistant") {
                      lastMessage.content += data.content;
                    }
                    return updated;
                  });
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => {
        const updated = [...prev];
        const lastMessage = updated[updated.length - 1];
        if (lastMessage.role === "assistant" && !lastMessage.content) {
          lastMessage.content = "Désolé, une erreur s'est produite. Veuillez réessayer.";
        }
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="border-b bg-card px-4 py-3">
        <div className="container mx-auto flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold" data-testid="text-agent-title">Agent IA A.SAP</h1>
            <p className="text-sm text-muted-foreground">Votre consultant digital senior</p>
          </div>
        </div>
      </div>

      <ScrollArea ref={scrollAreaRef} className="flex-1 px-4">
        <div className="container mx-auto max-w-3xl py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mb-2 text-xl font-semibold" data-testid="text-agent-welcome">
                Bienvenue sur l'Agent IA A.SAP
              </h2>
              <p className="mb-8 max-w-md text-center text-muted-foreground">
                Je suis votre consultant digital. Décrivez-moi votre projet ou besoin,
                et je vous guiderai vers les meilleures solutions.
              </p>
              <div className="mb-6 flex flex-wrap justify-center gap-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => sendMessage(action.prompt)}
                    data-testid={`button-quick-action-${index}`}
                  >
                    <action.icon className="mr-2 h-4 w-4" />
                    {action.label}
                  </Button>
                ))}
              </div>
              <div className="grid w-full max-w-lg gap-2">
                {suggestedPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="h-auto justify-start whitespace-normal text-left text-sm"
                    onClick={() => sendMessage(prompt)}
                    data-testid={`button-suggested-${index}`}
                  >
                    <span className="text-muted-foreground">{prompt}</span>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                  data-testid={`message-${message.role}-${message.id}`}
                >
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                      message.role === "user"
                        ? "bg-secondary"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <Card
                    className={`max-w-[80%] px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                      {message.role === "assistant" && !message.content && isStreaming && (
                        <Loader2 className="inline h-4 w-4 animate-spin" />
                      )}
                    </p>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t bg-background p-4">
        <form onSubmit={handleSubmit} className="container mx-auto max-w-3xl">
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Décrivez votre besoin..."
              className="min-h-[44px] max-h-32 resize-none"
              disabled={isStreaming}
              data-testid="input-chat-message"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isStreaming}
              className="flex-shrink-0"
              data-testid="button-send-message"
            >
              {isStreaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            L'Agent IA peut faire des erreurs. Vérifiez les informations importantes.
          </p>
        </form>
      </div>
    </div>
  );
}
