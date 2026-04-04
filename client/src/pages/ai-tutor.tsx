import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Send,
  User,
  BookOpen,
  Lightbulb,
  ArrowLeft,
  Sparkles,
  MessageCircle,
  GraduationCap,
  Brain,
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

const sapModules = [
  { code: "FI", name: "Finance", icon: BookOpen, color: "bg-blue-600" },
  { code: "CO", name: "Controlling", icon: Brain, color: "bg-purple-600" },
  { code: "MM", name: "Materials Management", icon: Lightbulb, color: "bg-green-600" },
  { code: "SD", name: "Sales & Distribution", icon: MessageCircle, color: "bg-orange-600" },
];

// Mock AI Response generator
function generateAIResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  // Financial Accounting responses
  if (lowerMessage.includes("fb50") || lowerMessage.includes("ecriture") || lowerMessage.includes("comptab")) {
    return "**FB50 - Saisie d'ecritures comptables**\n\nLa transaction FB50 est utilisee pour saisir des ecritures comptables dans SAP FI.\n\n**Caracteristiques principales:**\n- Societe: Saisie obligatoire\n- Date de comptabilisation: Date du jour par defaut\n- Devise: Devise de la societe\n- Montant debit = Montant credit\n- Texte: Description de l'ecriture\n\n**Etapes:**\n1. Accedez a la transaction FB50\n2. Renseignez la societe et la date\n3. Saisissez les lignes debit/credit\n4. Verifiez l'equilibre\n5. Enregistrez le document\n\n**Sources: Module FI - Comptabilite Financiere SAP ERP**";
  }

  // Materials Management responses
  if (lowerMessage.includes("me21n") || lowerMessage.includes("commande") || lowerMessage.includes("achat")) {
    return "**ME21N - Creation de commande d'achat**\n\nLa transaction ME21N permet de creer des commandes d'achat dans SAP MM.\n\n**Caracteristiques principales:**\n- Type de commande: NB (standard)\n- Organisation d'achats: Obligatoire\n- Groupe d'acheteurs: Responsable\n- Fournisseur: Partenaire commercial\n- Conditions de prix: Automatiques ou manuelles\n\n**Etapes:**\n1. Lancez ME21N\n2. Selectionnez le type de commande\n3. Renseignez le fournisseur\n4. Ajoutez les postes (articles)\n5. Verifiez les conditions\n6. Enregistrez\n\n**Sources: Module MM - Gestion des Articles SAP ERP**";
  }

  // Sales & Distribution responses
  if (lowerMessage.includes("va01") || lowerMessage.includes("vente") || lowerMessage.includes("client")) {
    return "**VA01 - Creation de commande de vente**\n\nLa transaction VA01 permet de creer des commandes de vente dans SAP SD.\n\n**Caracteristiques principales:**\n- Type de commande: OR (standard)\n- Organisation commerciale: Structure de vente\n- Canal de distribution: Mode de vente\n- Secteur d'activite: Categorie produit\n- Donneur d'ordre: Client qui commande\n\n**Etapes:**\n1. Accedez a VA01\n2. Selectionnez le type de commande\n3. Renseignez le donneur d'ordre\n4. Ajoutez les postes de vente\n5. Verifiez la disponibilite\n6. Enregistrez le document\n\n**Sources: Module SD - Administration des Ventes SAP ERP**";
  }

  // Controlling responses
  if (lowerMessage.includes("ks01") || lowerMessage.includes("centre") || lowerMessage.includes("cout") || lowerMessage.includes("controlling")) {
    return "**KS01 - Creation de centre de couts**\n\nLa transaction KS01 permet de creer des centres de couts dans SAP CO.\n\n**Caracteristiques principales:**\n- Perimetre analytique: Obligatoire\n- Centre de couts: Code unique\n- Designation: Nom descriptif\n- Responsable: Personne en charge\n- Categorie: Type de centre (production, admin, etc.)\n\n**Etapes:**\n1. Accedez a KS01\n2. Selectionnez le perimetre analytique\n3. Renseignez le code du centre de couts\n4. Completez les donnees de base\n5. Affectez la hierarchie\n6. Enregistrez\n\n**Sources: Module CO - Le Controlling SAP ERP**";
  }

  // Default response
  return "**Tuteur IA SAP**\n\nMerci pour votre question ! Je suis specialise dans la formation SAP ERP pour l'Afrique de l'Ouest.\n\n**Je peux vous aider avec:**\n- **FB50** - Ecritures comptables (Module FI)\n- **ME21N** - Commandes d'achat (Module MM)\n- **VA01** - Commandes de vente (Module SD)\n- **KS01** - Centres de couts (Module CO)\n- Questions generales sur SAP ERP\n\n**Conseil utile:**\nMentionnez le code de transaction ou le module SAP pour obtenir une reponse plus precise et detaillee.\n\n**Sources: Module General - Formation SAP ERP**";
}

// Simple markdown renderer component
function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith("**") && line.endsWith("**")) {
          return <p key={i} className="font-bold text-sm">{line.replace(/\*\*/g, "")}</p>;
        }
        if (line.startsWith("- ")) {
          return <p key={i} className="text-sm pl-4">{line}</p>;
        }
        if (line.match(/^\d+\./)) {
          return <p key={i} className="text-sm pl-4">{line}</p>;
        }
        if (line.trim() === "") {
          return <div key={i} className="h-1" />;
        }
        // Handle inline bold
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className="text-sm">
            {parts.map((part, j) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={j}>{part.replace(/\*\*/g, "")}</strong>;
              }
              return <span key={j}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}

export default function AITutorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "ai",
      content:
        "**Bienvenue sur le Tuteur IA SAP !**\n\nJe suis votre assistant intelligent specialise dans la formation SAP ERP.\n\n**Comment puis-je vous aider ?**\n- Posez une question sur un module SAP\n- Demandez de l'aide sur une transaction\n- Explorez les concepts SAP\n\nEssayez par exemple: \"Comment utiliser FB50 ?\" ou \"Expliquez ME21N\"",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    const messageText = inputMessage.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: "msg-" + Date.now(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI thinking delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate AI response
    const aiResponse: ChatMessage = {
      id: "ai-" + Date.now(),
      role: "ai",
      content: generateAIResponse(messageText),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "Comment utiliser FB50 ?",
    "Expliquez ME21N",
    "Qu'est-ce que VA01 ?",
    "Centre de couts KS01",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Tuteur IA SAP</h1>
              <p className="text-xs text-slate-400">Assistant intelligent de formation</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline" className="text-green-400 border-green-400/30">
              <Sparkles className="h-3 w-3 mr-1" />
              En ligne
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 flex gap-6 h-[calc(100vh-80px)]">
        {/* Sidebar - SAP Modules */}
        <div className="hidden lg:block w-64 space-y-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Modules SAP
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {sapModules.map((mod) => (
                <button
                  key={mod.code}
                  onClick={() => setInputMessage("Expliquez le module " + mod.code + " - " + mod.name)}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors text-left"
                >
                  <div className={"h-8 w-8 rounded-lg flex items-center justify-center " + mod.color}>
                    <mod.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{mod.code}</p>
                    <p className="text-xs text-slate-400">{mod.name}</p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Questions rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInputMessage(q);
                    inputRef.current?.focus();
                  }}
                  className="w-full text-left text-xs p-2 rounded-lg bg-slate-800/30 hover:bg-slate-800/60 text-slate-300 transition-colors"
                >
                  {q}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col bg-slate-900/50 border-slate-800 overflow-hidden">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => {
                  const isUser = message.role === "user";
                  return (
                    <div key={message.id} className={"flex " + (isUser ? "justify-end" : "justify-start") + " mb-4"}>
                      <div className={"max-w-[85%] rounded-lg p-4 " + (isUser ? "bg-blue-600 text-white rounded-br-none" : "bg-gradient-to-br from-slate-800 to-slate-900 text-slate-50 rounded-bl-none")}>
                        <div className="text-sm whitespace-pre-wrap break-words">
                          {message.role === "ai" ? (
                            <MarkdownContent content={message.content} />
                          ) : (
                            message.content
                          )}
                        </div>
                        <p className={"text-xs mt-2 " + (isUser ? "text-blue-200" : "text-slate-500")}>
                          {message.timestamp.toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800 rounded-lg p-4 rounded-bl-none">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-blue-400 animate-pulse" />
                        <span className="text-sm text-slate-300">Le tuteur IA reflechit...</span>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-800">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Posez votre question sur SAP..."
                  className="flex-1 bg-slate-800/50 border-slate-700 text-white placeholder-slate-500"
                  disabled={isTyping}
                />
                <Button
                  onClick={sendMessage}
                  disabled={isTyping || !inputMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center">
                Tuteur IA SAP - Formation SAP ERP pour l'Afrique de l'Ouest
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
