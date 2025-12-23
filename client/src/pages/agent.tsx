import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Calendar, Video, Monitor, Loader2, Mail, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface TimeSlot {
  date: string;
  time: string;
  datetime: string;
}

interface BookingState {
  step: "hidden" | "slots" | "email" | "confirming" | "success";
  selectedSlot: TimeSlot | null;
  email: string;
  meetLink: string;
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

const MEETING_KEYWORDS = [
  "google meet", "rendez-vous", "rdv", "réunion", "meeting", 
  "appel", "call", "visio", "visioconférence", "consultation"
];

export default function Agent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [booking, setBooking] = useState<BookingState>({
    step: "hidden",
    selectedSlot: null,
    email: "",
    meetLink: ""
  });
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: slotsData, isLoading: slotsLoading, refetch: refetchSlots } = useQuery<{ slots: TimeSlot[] }>({
    queryKey: ['/api/calendar/slots'],
    enabled: false
  });

  const bookMutation = useMutation({
    mutationFn: async ({ email, datetime }: { email: string; datetime: string }) => {
      const response = await apiRequest('POST', '/api/calendar/book', { email, datetime, duration: 30 });
      return response.json();
    },
    onSuccess: (data: any) => {
      setBooking(prev => ({ 
        ...prev, 
        step: "success",
        meetLink: data.meetLink || ""
      }));
      
      const successMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `Excellent ! Votre réunion Google Meet a été créée avec succès ! Une invitation a été envoyée à ${booking.email}.

Votre créneau : **${booking.selectedSlot?.date} à ${booking.selectedSlot?.time}**

Je me réjouis de vous retrouver pour cette consultation. Nous discuterons de vos besoins et vous présenterons les meilleures solutions A.SAP pour votre projet.

À très bientôt !`
      };
      setMessages(prev => [...prev, successMessage]);
    },
    onError: () => {
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Désolé, une erreur s'est produite lors de la création de la réunion. Veuillez réessayer ou nous contacter directement."
      };
      setMessages(prev => [...prev, errorMessage]);
      setBooking({ step: "hidden", selectedSlot: null, email: "", meetLink: "" });
    }
  });

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
  }, [messages, booking.step]);

  const checkForMeetingRequest = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return MEETING_KEYWORDS.some(keyword => lowerText.includes(keyword));
  };

  const showMeetingSlots = async () => {
    setBooking(prev => ({ ...prev, step: "slots" }));
    await refetchSlots();
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setBooking(prev => ({ ...prev, selectedSlot: slot, step: "email" }));
  };

  const handleEmailSubmit = () => {
    if (!booking.email || !booking.selectedSlot) return;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(booking.email)) return;
    
    setBooking(prev => ({ ...prev, step: "confirming" }));
    bookMutation.mutate({ 
      email: booking.email, 
      datetime: booking.selectedSlot.datetime 
    });
  };

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

    if (checkForMeetingRequest(content)) {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Parfait ! Je vous propose de réserver un créneau pour une consultation Google Meet de 30 minutes avec notre équipe.

Voici les créneaux disponibles cette semaine. **Cliquez sur le créneau qui vous convient** :`,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsStreaming(false);
      await showMeetingSlots();
      return;
    }

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

  const renderBookingUI = () => {
    if (booking.step === "hidden") return null;

    if (booking.step === "slots") {
      return (
        <Card className="mx-auto my-4 max-w-lg p-4">
          <div className="mb-4 flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            <span className="font-semibold">Créneaux disponibles</span>
          </div>
          {slotsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Chargement des créneaux...</span>
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {slotsData?.slots?.map((slot, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto flex-col items-start p-3 text-left"
                  onClick={() => handleSlotSelect(slot)}
                  data-testid={`button-slot-${index}`}
                >
                  <span className="font-medium">{slot.date}</span>
                  <span className="text-sm text-muted-foreground">{slot.time}</span>
                </Button>
              ))}
            </div>
          )}
          <Button 
            variant="ghost" 
            className="mt-4 w-full"
            onClick={() => setBooking({ step: "hidden", selectedSlot: null, email: "", meetLink: "" })}
          >
            Annuler
          </Button>
        </Card>
      );
    }

    if (booking.step === "email") {
      return (
        <Card className="mx-auto my-4 max-w-lg p-4">
          <div className="mb-4">
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold">Créneau sélectionné</span>
            </div>
            <Badge variant="secondary" className="mt-2">
              {booking.selectedSlot?.date} - {booking.selectedSlot?.time}
            </Badge>
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              <Mail className="mr-2 inline h-4 w-4" />
              Votre email pour recevoir l'invitation
            </label>
            <Input
              type="email"
              placeholder="votre@email.com"
              value={booking.email}
              onChange={(e) => setBooking(prev => ({ ...prev, email: e.target.value }))}
              data-testid="input-booking-email"
            />
          </div>
          <div className="flex gap-2">
            <Button
              className="flex-1 bg-gold text-gold-foreground"
              onClick={handleEmailSubmit}
              disabled={!booking.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.email)}
              data-testid="button-confirm-booking"
            >
              <Video className="mr-2 h-4 w-4" />
              Confirmer le rendez-vous
            </Button>
            <Button 
              variant="outline"
              onClick={() => setBooking(prev => ({ ...prev, step: "slots" }))}
            >
              Retour
            </Button>
          </div>
        </Card>
      );
    }

    if (booking.step === "confirming") {
      return (
        <Card className="mx-auto my-4 max-w-lg p-6">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Création de votre réunion Google Meet...</p>
          </div>
        </Card>
      );
    }

    if (booking.step === "success" && booking.meetLink) {
      return (
        <Card className="mx-auto my-4 max-w-lg border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-2 text-primary">
            <CheckCircle2 className="h-6 w-6" />
            <span className="font-semibold">Réunion confirmée</span>
          </div>
          <div className="mt-3 space-y-2">
            <p className="text-sm">
              <strong>Date :</strong> {booking.selectedSlot?.date} à {booking.selectedSlot?.time}
            </p>
            <p className="text-sm">
              <strong>Email :</strong> {booking.email}
            </p>
          </div>
          <Button
            className="mt-4 w-full bg-gold text-gold-foreground"
            onClick={() => window.open(booking.meetLink, '_blank')}
            data-testid="button-join-meet"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Rejoindre Google Meet
          </Button>
        </Card>
      );
    }

    return null;
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
              {messages.map((message, index) => (
                <div key={message.id}>
                  <div
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
                  {message.role === "assistant" && 
                   index === messages.length - 1 && 
                   booking.step !== "hidden" && 
                   booking.step !== "success" && 
                   renderBookingUI()}
                </div>
              ))}
              {booking.step === "success" && renderBookingUI()}
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
              disabled={isStreaming || booking.step === "confirming"}
              data-testid="input-chat-message"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isStreaming || booking.step === "confirming"}
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
