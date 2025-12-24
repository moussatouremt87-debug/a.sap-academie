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
import { useTranslation } from "@/lib/i18n";

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


const FEMALE_NAMES = [
  "Fatou", "Aminata", "Awa", "Mariama", "Khady", "Aissatou", "Ndéye", "Coumba", 
  "Rama", "Binta", "Sokhna", "Mame", "Astou", "Dieynaba", "Yacine", "Rokhaya",
  "Seynabou", "Adja", "Ndeye Fatou", "Oumou", "Diary", "Khadija", "Aby", "Nabou", "Thioro"
];

const MALE_NAMES = [
  "Moustapha", "Mamadou", "Ibrahima", "Ousmane", "Cheikh", "Abdoulaye",
  "Modou", "Papa", "Serigne", "Alioune", "Babacar", "Pape", "El Hadji", "Demba",
  "Malick", "Saliou", "Amadou", "Mbaye", "Lamine", "Youssou", "Daouda", "Samba",
  "Boubacar", "Djibril", "Thierno"
];

function getRandomCommercial(): { name: string; isFemale: boolean } {
  const allNames = [...FEMALE_NAMES.map(n => ({ name: n, isFemale: true })), ...MALE_NAMES.map(n => ({ name: n, isFemale: false }))];
  return allNames[Math.floor(Math.random() * allNames.length)];
}

const MEETING_KEYWORDS = [
  "google meet", "rendez-vous", "rdv", "réunion", "meeting", 
  "appel", "call", "visio", "visioconférence", "consultation"
];

const TIME_PATTERNS = [
  /demain\s+\d{1,2}h/i,
  /demain\s+à\s+\d{1,2}h/i,
  /demain\s+\d{1,2}:\d{2}/i,
  /lundi|mardi|mercredi|jeudi|vendredi/i,
  /\d{1,2}h\d{0,2}/i,
  /\d{1,2}:\d{2}/,
  /à\s+\d{1,2}h/i,
  /prochain\s+créneau/i,
  /disponible\s+demain/i,
  /monday|tuesday|wednesday|thursday|friday/i,
  /tomorrow\s+at\s+\d{1,2}/i,
];

const DAYS_FR = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const DAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS_FR = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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
  onChangeMonth,
  language
}: { 
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  currentMonth: Date;
  onChangeMonth: (date: Date) => void;
  language: string;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days_labels = language === "fr" ? DAYS_FR : DAYS_EN;
  const months_labels = language === "fr" ? MONTHS_FR : MONTHS_EN;

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
          {months_labels[month]} {year}
        </span>
        <Button variant="ghost" size="icon" onClick={nextMonth} data-testid="button-next-month">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {days_labels.map(day => (
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
  onSelectTime,
  language
}: {
  selectedDate: Date;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  language: string;
}) {
  const now = new Date();
  const isToday = selectedDate.toDateString() === now.toDateString();
  const months = language === "fr" ? MONTHS_FR : MONTHS_EN;

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
        {language === "fr" 
          ? `Créneaux disponibles le ${selectedDate.getDate()} ${months[selectedDate.getMonth()]} :`
          : `Available slots on ${months[selectedDate.getMonth()]} ${selectedDate.getDate()}:`}
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
        <p className="text-sm text-muted-foreground">
          {language === "fr" ? "Aucun créneau disponible pour cette date." : "No slots available for this date."}
        </p>
      )}
    </div>
  );
}

export default function Agent() {
  const { t, language } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [commercial] = useState(() => getRandomCommercial());
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [booking, setBooking] = useState<BookingState>({
    step: "hidden",
    selectedDate: null,
    selectedSlot: null,
    email: "",
    meetLink: ""
  });
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const quickActions = [
    { icon: CalendarDays, label: t("agent.quickAction.rdv"), prompt: t("agent.quickAction.rdvPrompt") },
    { icon: Video, label: t("agent.quickAction.meet"), prompt: t("agent.quickAction.meetPrompt") },
    { icon: Monitor, label: t("agent.quickAction.teams"), prompt: t("agent.quickAction.teamsPrompt") },
  ];

  const suggestedPrompts = [
    t("agent.suggested.deploy"),
    t("agent.suggested.formations"),
    t("agent.suggested.audit"),
    t("agent.suggested.accompagnement"),
  ];

  const createConversation = async () => {
    try {
      const response = await apiRequest('POST', '/api/conversations', { 
        title: `Conversation avec ${commercial.name}`,
        commercialName: commercial.name 
      });
      const data = await response.json();
      setConversationId(data.id);
      return data.id;
    } catch (error) {
      console.error("Failed to create conversation:", error);
      return null;
    }
  };

  const saveMessage = async (convId: number, role: string, content: string) => {
    if (!convId || !content) return;
    try {
      const response = await apiRequest('POST', `/api/conversations/${convId}/messages`, { role, content });
      await response.json();
    } catch (error) {
      console.error("Failed to save message:", error);
    }
  };

  const bookMutation = useMutation({
    mutationFn: async ({ email, datetime }: { email: string; datetime: string }) => {
      const response = await apiRequest('POST', '/api/calendar/book', { 
        email, 
        datetime, 
        duration: 15,
        conversationId,
        commercialName: commercial.name
      });
      return response.json();
    },
    onSuccess: (data: any) => {
      setBooking(prev => ({ 
        ...prev, 
        step: "success",
        meetLink: data.meetLink || ""
      }));
      
      const atWord = language === "fr" ? "à" : "at";
      const successMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `${t("agent.booking.successMessage")} ${booking.email}.

${language === "fr" ? "Votre créneau" : "Your slot"} : **${booking.selectedSlot?.date} ${atWord} ${booking.selectedSlot?.time}**

${t("agent.booking.lookingForward")}

${t("agent.booking.seeYouSoon")}`
      };
      setMessages(prev => [...prev, successMessage]);
    },
    onError: () => {
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: t("agent.booking.error")
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
    const hasKeyword = MEETING_KEYWORDS.some(keyword => lowerText.includes(keyword));
    const hasTimePattern = TIME_PATTERNS.some(pattern => pattern.test(text));
    return hasKeyword || hasTimePattern;
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

    // Create conversation on first message
    let currentConvId = conversationId;
    if (!currentConvId) {
      currentConvId = await createConversation();
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    // Save user message to database
    if (currentConvId) {
      saveMessage(currentConvId, "user", content.trim());
    }

    if (checkForMeetingRequest(content)) {
      const assistantContent = `${t("agent.booking.invite")}

**${t("agent.booking.chooseSlot")}**`;
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: assistantContent,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Save assistant message
      if (currentConvId) {
        saveMessage(currentConvId, "assistant", assistantContent);
      }
      
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

    let fullAssistantResponse = "";

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
                  fullAssistantResponse += data.content;
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

      // Save assistant response to database
      if (currentConvId && fullAssistantResponse) {
        saveMessage(currentConvId, "assistant", fullAssistantResponse);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => {
        const updated = [...prev];
        const lastMessage = updated[updated.length - 1];
        if (lastMessage.role === "assistant" && !lastMessage.content) {
          lastMessage.content = language === "fr" ? "Désolé, une erreur s'est produite. Veuillez réessayer." : "Sorry, an error occurred. Please try again.";
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
            <span className="font-semibold">{t("agent.booking.selectDate")}</span>
          </div>
          
          <CalendarPicker
            selectedDate={booking.selectedDate}
            onSelectDate={handleDateSelect}
            currentMonth={currentMonth}
            onChangeMonth={setCurrentMonth}
            language={language}
          />
          
          {booking.selectedDate && (
            <div className="mt-4 border-t pt-4">
              <TimeSlotPicker
                selectedDate={booking.selectedDate}
                selectedTime={selectedTime}
                onSelectTime={handleTimeSelect}
                language={language}
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
              {t("agent.booking.confirmSlot")}
            </Button>
            <Button 
              variant="outline"
              onClick={() => setBooking({ step: "hidden", selectedDate: null, selectedSlot: null, email: "", meetLink: "" })}
            >
              {language === "fr" ? "Annuler" : "Cancel"}
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
              <span className="font-semibold">{t("agent.booking.yourSlot")}</span>
            </div>
            <Badge variant="secondary" className="mt-2">
              {booking.selectedSlot?.date} - {booking.selectedSlot?.time}
            </Badge>
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              <Mail className="mr-2 inline h-4 w-4" />
              {t("agent.booking.enterEmail")}
            </label>
            <Input
              type="email"
              placeholder={t("agent.booking.emailPlaceholder")}
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
              {t("agent.booking.confirmBooking")}
            </Button>
            <Button 
              variant="outline"
              onClick={() => setBooking(prev => ({ ...prev, step: "calendar" }))}
            >
              {language === "fr" ? "Retour" : "Back"}
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
            <p className="mt-4 text-muted-foreground">{t("agent.booking.creating")}</p>
          </div>
        </Card>
      );
    }

    if (booking.step === "success" && booking.meetLink) {
      return (
        <Card className="mx-auto my-4 max-w-md border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-2 text-primary">
            <CheckCircle2 className="h-6 w-6" />
            <span className="font-semibold">{t("agent.booking.success")}</span>
          </div>
          <div className="mt-3 space-y-2">
            <p className="text-sm">
              <strong>{t("agent.booking.date")} :</strong> {booking.selectedSlot?.date} {language === "fr" ? "à" : "at"} {booking.selectedSlot?.time}
            </p>
            <p className="text-sm">
              <strong>{t("agent.booking.email")} :</strong> {booking.email}
            </p>
          </div>
          <Button
            className="mt-4 w-full bg-gold text-gold-foreground"
            onClick={() => window.open(booking.meetLink, '_blank')}
            data-testid="button-join-meet"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            {t("agent.booking.joinMeet")}
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
            <h1 className="font-semibold" data-testid="text-agent-title">{commercial.name} - {commercial.isFemale ? t("agent.commercialTitleFemale") : t("agent.commercialTitle")} A.SAP Consulting</h1>
            <p className="text-sm text-muted-foreground">{commercial.isFemale ? t("agent.advisorDedicatedFemale") : t("agent.advisorDedicated")}</p>
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
                {t("agent.greeting")} {commercial.name}
              </h2>
              <p className="mb-8 max-w-md text-center text-muted-foreground">
                {commercial.isFemale ? t("agent.roleIntroFemale") : t("agent.roleIntro")}
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
              placeholder={t("agent.placeholder")}
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
