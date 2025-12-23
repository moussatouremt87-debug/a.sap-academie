import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, User, CalendarDays, Video, Monitor, Loader2, Mail, CheckCircle2, ExternalLink, ChevronLeft, ChevronRight, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "@tanstack/react-query";
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
  step: "hidden" | "calendar" | "email" | "confirming" | "success";
  selectedDate: Date | null;
  selectedSlot: TimeSlot | null;
  email: string;
  meetLink: string;
}

const quickActions = [
  { icon: CalendarDays, label: "Prendre RDV", prompt: "Je souhaite prendre un rendez-vous avec un consultant." },
  { icon: Video, label: "Google Meet", prompt: "Je voudrais organiser une réunion Google Meet." },
  { icon: Monitor, label: "Teams", prompt: "Je préfère une réunion Microsoft Teams." },
];

const suggestedPrompts = [
  "Je veux déployer SAP dans mon entreprise",
  "Quelles formations SAP proposez-vous ?",
  "J'ai besoin d'un audit de mon SI",
  "Comment fonctionne votre accompagnement ?",
];

const SENEGALESE_NAMES = [
  "Fatou", "Aminata", "Awa", "Mariama", "Khady", "Aissatou", "Ndéye", "Coumba", 
  "Rama", "Binta", "Sokhna", "Mame", "Astou", "Dieynaba", "Yacine", "Rokhaya",
  "Seynabou", "Adja", "Ndeye Fatou", "Oumou", "Diary", "Khadija", "Aby", "Nabou",
  "Thioro", "Moustapha", "Mamadou", "Ibrahima", "Ousmane", "Cheikh", "Abdoulaye",
  "Modou", "Papa", "Serigne", "Alioune", "Babacar", "Pape", "El Hadji", "Demba",
  "Malick", "Saliou", "Amadou", "Mbaye", "Lamine", "Youssou", "Daouda", "Samba",
  "Boubacar", "Djibril", "Thierno"
];

function getRandomCommercialName(): string {
  return SENEGALESE_NAMES[Math.floor(Math.random() * SENEGALESE_NAMES.length)];
}

const MEETING_KEYWORDS = [
  "google meet", "rendez-vous", "rdv", "réunion", "meeting", 
  "appel", "call", "visio", "visioconférence", "consultation"
];

const DAYS_FR = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTHS_FR = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let hour = 9; hour <= 19; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 19) {
      slots.push(`${hour.toString().padStart(2, '0')}:15`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
      slots.push(`${hour.toString().padStart(2, '0')}:45`);
    }
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots();

function CalendarPicker({ 
  selectedDate, 
  onSelectDate,
  currentMonth,
  onChangeMonth
}: { 
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  currentMonth: Date;
  onChangeMonth: (date: Date) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDay = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const prevMonth = () => {
    onChangeMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    onChangeMonth(new Date(year, month + 1, 1));
  };

  const isDateSelectable = (day: number) => {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    return date >= today && dayOfWeek !== 0 && dayOfWeek !== 6;
  };

  const isSelectedDate = (day: number) => {
    if (!selectedDate) return false;
    return selectedDate.getDate() === day && 
           selectedDate.getMonth() === month && 
           selectedDate.getFullYear() === year;
  };

  const isToday = (day: number) => {
    const now = new Date();
    return day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
  };

  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-9 w-9" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const selectable = isDateSelectable(day);
    const selected = isSelectedDate(day);
    const todayClass = isToday(day);
    
    days.push(
      <button
        key={day}
        onClick={() => selectable && onSelectDate(new Date(year, month, day))}
        disabled={!selectable}
        className={`h-9 w-9 rounded-md text-sm font-medium transition-colors
          ${selected ? 'bg-primary text-primary-foreground' : ''}
          ${!selected && selectable ? 'hover:bg-muted' : ''}
          ${!selectable ? 'text-muted-foreground/40 cursor-not-allowed' : ''}
          ${todayClass && !selected ? 'border border-primary' : ''}
        `}
        data-testid={`calendar-day-${day}`}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={prevMonth} data-testid="button-prev-month">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-semibold">
          {MONTHS_FR[month]} {year}
        </span>
        <Button variant="ghost" size="icon" onClick={nextMonth} data-testid="button-next-month">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {DAYS_FR.map(day => (
          <div key={day} className="h-9 w-9 flex items-center justify-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        {days}
      </div>
    </div>
  );
}

function TimeSlotPicker({
  selectedDate,
  selectedTime,
  onSelectTime
}: {
  selectedDate: Date;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
}) {
  const now = new Date();
  const isToday = selectedDate.toDateString() === now.toDateString();

  const availableSlots = TIME_SLOTS.filter(time => {
    if (!isToday) return true;
    const [hours, minutes] = time.split(':').map(Number);
    const slotTime = new Date(selectedDate);
    slotTime.setHours(hours, minutes, 0, 0);
    return slotTime > now;
  });

  return (
    <div>
      <p className="mb-3 text-sm font-medium">
        Créneaux disponibles le {selectedDate.getDate()} {MONTHS_FR[selectedDate.getMonth()]} :
      </p>
      <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
        {availableSlots.map(time => (
          <Button
            key={time}
            variant={selectedTime === time ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectTime(time)}
            className="text-xs"
            data-testid={`button-time-${time.replace(':', '')}`}
          >
            {time}
          </Button>
        ))}
      </div>
      {availableSlots.length === 0 && (
        <p className="text-sm text-muted-foreground">Aucun créneau disponible pour cette date.</p>
      )}
    </div>
  );
}

export default function Agent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [commercialName] = useState(() => getRandomCommercialName());
  const [booking, setBooking] = useState<BookingState>({
    step: "hidden",
    selectedDate: null,
    selectedSlot: null,
    email: "",
    meetLink: ""
  });
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const bookMutation = useMutation({
    mutationFn: async ({ email, datetime }: { email: string; datetime: string }) => {
      const response = await apiRequest('POST', '/api/calendar/book', { email, datetime, duration: 15 });
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

Je me réjouis de vous retrouver pour cette consultation. Nous discuterons de vos besoins et vous présenterons les meilleures solutions A.SAP Consulting pour votre projet.

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
      setBooking({ step: "hidden", selectedDate: null, selectedSlot: null, email: "", meetLink: "" });
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

  const showCalendar = () => {
    setBooking(prev => ({ ...prev, step: "calendar" }));
    setCurrentMonth(new Date());
    setSelectedTime(null);
  };

  const handleDateSelect = (date: Date) => {
    setBooking(prev => ({ ...prev, selectedDate: date }));
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirmSlot = () => {
    if (!booking.selectedDate || !selectedTime) return;
    
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const datetime = new Date(booking.selectedDate);
    datetime.setHours(hours, minutes, 0, 0);
    
    const slot: TimeSlot = {
      date: `${DAYS_FR[datetime.getDay()]} ${datetime.getDate()} ${MONTHS_FR[datetime.getMonth()]}`,
      time: selectedTime,
      datetime: datetime.toISOString()
    };
    
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
        content: `Parfait ! Je vous propose de réserver un créneau pour une consultation Google Meet de 15 minutes avec notre équipe.

**Choisissez votre date et heure** dans le calendrier ci-dessous :`,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsStreaming(false);
      showCalendar();
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

    if (booking.step === "calendar") {
      return (
        <Card className="mx-auto my-4 max-w-md p-4">
          <div className="mb-4 flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            <span className="font-semibold">Réserver une consultation</span>
          </div>
          
          <CalendarPicker
            selectedDate={booking.selectedDate}
            onSelectDate={handleDateSelect}
            currentMonth={currentMonth}
            onChangeMonth={setCurrentMonth}
          />
          
          {booking.selectedDate && (
            <div className="mt-4 border-t pt-4">
              <TimeSlotPicker
                selectedDate={booking.selectedDate}
                selectedTime={selectedTime}
                onSelectTime={handleTimeSelect}
              />
            </div>
          )}
          
          <div className="mt-4 flex gap-2">
            <Button
              className="flex-1 bg-gold text-gold-foreground"
              onClick={handleConfirmSlot}
              disabled={!booking.selectedDate || !selectedTime}
              data-testid="button-confirm-slot"
            >
              Confirmer ce créneau
            </Button>
            <Button 
              variant="outline"
              onClick={() => setBooking({ step: "hidden", selectedDate: null, selectedSlot: null, email: "", meetLink: "" })}
            >
              Annuler
            </Button>
          </div>
        </Card>
      );
    }

    if (booking.step === "email") {
      return (
        <Card className="mx-auto my-4 max-w-md p-4">
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
              onClick={() => setBooking(prev => ({ ...prev, step: "calendar" }))}
            >
              Retour
            </Button>
          </div>
        </Card>
      );
    }

    if (booking.step === "confirming") {
      return (
        <Card className="mx-auto my-4 max-w-md p-6">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Création de votre réunion Google Meet...</p>
          </div>
        </Card>
      );
    }

    if (booking.step === "success" && booking.meetLink) {
      return (
        <Card className="mx-auto my-4 max-w-md border-primary/20 bg-primary/5 p-4">
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
            <MessageCircle className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold" data-testid="text-agent-title">{commercialName} - Commercial A.SAP Consulting</h1>
            <p className="text-sm text-muted-foreground">Votre conseiller dédié</p>
          </div>
        </div>
      </div>

      <ScrollArea ref={scrollAreaRef} className="flex-1 px-4">
        <div className="container mx-auto max-w-3xl py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mb-2 text-xl font-semibold" data-testid="text-agent-welcome">
                Bonjour, je m'appelle {commercialName}
              </h2>
              <p className="mb-8 max-w-md text-center text-muted-foreground">
                Je suis votre conseiller commercial A.SAP Consulting. En quoi puis-je vous aider ?
                Décrivez-moi votre projet et je vous guiderai vers les meilleures solutions.
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
                        <MessageCircle className="h-4 w-4" />
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
            Ce service utilise l'IA pour vous assister. Vérifiez les informations importantes.
          </p>
        </form>
      </div>
    </div>
  );
}
