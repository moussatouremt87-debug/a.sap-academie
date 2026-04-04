import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Menu,
  X,
  Send,
  ArrowLeft,
  Sparkles,
  ChevronDown,
  Dot,
} from 'lucide-react';
import { AI_TUTOR_PROMPTS, SAP_MODULES } from '@/data/sap-modules-db';

// Types
interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  source?: string;
  timestamp: Date;
}

interface PromptCategory {
  [key: string]: string[];
}

// Mock AI Response Generator
function generateMockAIResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  // Financial Accounting - FB50
  if (lowerMessage.includes('fb50') || lowerMessage.includes('écriture')) {
    return `**FB50 - Création d'une Écriture Comptable**

La transaction FB50 permet de créer manuellement des écritures comptables dans le grand livre.

**Caractéristiques principales:**
• Société: Saisissez la société cible
• Date de comptabilisation: La date de l'écriture
• Devise: Devise de la société
• Montant débit/crédit: Doit être équilibré
• Texte: Description de l'écriture

**Processus:**
1. Accédez à FB50
2. Saisissez les paramètres de la société
3. Entrez les lignes de débit et crédit
4. Vérifiez que le total débit = total crédit
5. Enregistrez l'écriture

**Sources: Module FI - Leçon 3 | Comptabilité Financière Avancée`;
  }

  // Procurement - ME21N
  if (lowerMessage.includes('commande') || lowerMessage.includes('me21n')) {
    return `**ME21N - Création de Commande d'Achat**

La transaction ME21N permet de créer une nouvelle commande d'achat (PO) avec tous les paramètres nécessaires.

**Informations obligatoires:**
• Fournisseur: Numéro ou nom du fournisseur
• Société acheteur: La société qui achète
• Lieu de livraison: Où les articles seront livrés
• Articles: Code article et quantité
• Prix unitaire: Validation contre le référentiel fournisseur

**Étapes clés:**
1. Accédez à ME21N
2. Saisissez le fournisseur et la société
3. Ajoutez les articles et quantités
4. Vérifiez les conditions de paiement
5. Créez la commande

**Sources: Module MM - Leçon 2 | Gestion des Achats`;
  }

  // Sales - VA01
  if (lowerMessage.includes('va01') || lowerMessage.includes('vente') || lowerMessage.includes('commande client')) {
    return `**VA01 - Création d'une Commande Client**

La transaction VA01 permet de créer une nouvelle commande de vente (SO) pour les clients.

**Données essentielles:**
• Client: Numéro de compte du client
• Langue de la commande: Sélectionnez la langue appropriée
• Type de commande: Standard, contrat, etc.
• Articles: Articles à vendre avec quantités
• Conditions commerciales: Prix, remises, conditions de paiement

**Processus:**
1. Lancez VA01
2. Saisissez le type et le client
3. Entrez la date et les conditions
4. Ajoutez les articles avec quantités
5. Validez et enregistrez

**Conseil:** Assurez-vous que les articles existent en stock et que les conditions tarifaires sont à jour.

**Sources: Module SD - Leçon 1 | Ventes et Distribution`;
  }

  // Cost Centers - KS01
  if (lowerMessage.includes('centre de coûts') || lowerMessage.includes('ks01') || lowerMessage.includes('cost center')) {
    return `**KS01 - Création d'un Centre de Coûts**

La transaction KS01 permet de créer et configurer des centres de coûts pour la comptabilité analytique.

**Informations requises:**
• Société: La société propriétaire du centre de coûts
• Centre de coûts: Code unique du centre (ex: 1100)
• Dénomination: Nom descriptif (ex: "Ventes - Région Ouest")
• Responsable: Utilisateur responsable
• Devise: Devise par défaut

**Configuration avancée:**
• Hiérarchie: Positionnement dans l'arborescence
• Validité: Date de début/fin d'utilisation
• Paramètres de reporting: Lignes analytiques
• Contrôles budgétaires: Si applicable

**Validation:**
Après création, le centre de coûts peut être utilisé dans les imputations analytiques.

**Sources: Module CO - Leçon 2 | Comptabilité Analytique`;
  }

  // Default response
  return `**Tuteur IA SAP**

Merci pour votre question ! Je suis spécialisé dans le traitement des transactions SAP principales.

**Je peux vous aider avec:**
• **FB50** - Écritures comptables
• **ME21N** - Commandes d'achat
• **VA01** - Commandes clients
• **KS01** - Centres de coûts
• Questions générales sur SAP

**Conseil utile:**
Mentionnez le code de transaction (comme FB50) ou le domaine métier (ventes, achats, finance) pour obtenir une réponse plus précise.

**Sources: Module Général - Introduction à SAP ERP `;
}

// Components
const ChatMessage: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={"flex " + (isUser ? "justify-end" : "justify-start") + " mb-4"}>
        <div className={"max-w-[85%] rounded-lg p-4 " + (isUser ? "bg-blue-600 text-white rounded-br-none" : "bg-gradient-to-br from-slate-800 to-slate-900 text-slate-50 rounded-bl-none")}>
        <div className="text-sm whitespace-pre-wrap break-words">
          {message.role === 'ai' ? (
            <MarkdownContent content={message.content} />
          ) : (
            message.content
          )}
        </div>
        {message.source && message.role === 'ai' && (
          <div className="text-xs mt-2 pt-2 border-t border-slate-600 text-slate-400">
            {message.source}
          </div>
        )}
      </div>
    </div>
  );
};

const MarkdownContent: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');

  return (
    <>
      {lines.map((line, idx) => {
        // Bold headings (**, ###, etc.)
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <div key={idx} className="font-bold mb-2">
              {line.replace(/\*\*/g, '')}
            </div>
          );
        }

        // Bullet points
        if (line.trim().startsWith('•')) {
          return (
            <div key={idx} className="ml-4 mb-1">
              {line}
            </div>
          );
        }

        // Numbered items
        if (/^\d+\./.test(line.trim())) {
          return (
            <div key={idx} className="ml-4 mb-1">
              {line}
            </div>
          );
        }

        // Source footer
        if (line.trim().startsWith('**Sources:')) {
          return (
            <div key={idx} className="text-xs mt-3 pt-2 border-t border-slate-600 text-slate-400">
              {line.replace(/\*\*/g, '')}
            </div>
          );
        }

        return (
          <div key={idx} className="mb-1">
            {line}
          </div>
        );
      })}
    </>
  );
};

const TypingIndicator: React.FC = () => (
  <div className="flex items-center gap-1 p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg rounded-bl-none w-fit">
    <span className="text-slate-50">Tuteur IA réfléchit</span>
    <span className="flex gap-1">
      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
    </span>
  </div>
);

const WelcomeScreen: React.FC<{
  onSelectPrompt: (prompt: string) => void;
}> = ({ onSelectPrompt }) => {
  const starterQuestions = [
    'Qu\'est-ce que FB50 et comment l\'utiliser ?',
    'Comment créer une commande d\'achat avec ME21N ?',
    'Expliquez-moi VA01 pour les ventes',
    'Que sont les centres de coûts en SAP ?',
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 py-12 px-4">
      <div className="text-6xl">
        <Sparkles className="w-16 h-16 text-blue-600 mx-auto mb-4" />
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Bonjour ! Je suis votre tuteur IA SAP
        </h1>
        <p className="text-slate-600">
          Posez vos questions sur SAP ERP et je vous aiderai
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
        {starterQuestions.map((question, idx) => (
          <Card
            key={idx}
            className="cursor-pointer hover:shadow-lg hover:border-blue-400 transition-all"
            onClick={() => onSelectPrompt(question)}
          >
            <CardContent className="p-4">
              <p className="text-sm text-slate-700">{question}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const SuggestedPrompts: React.FC<{
  onSelectPrompt: (prompt: string) => void;
}> = ({ onSelectPrompt }) => {
  const categorized: PromptCategory = {
    'Débutant': [],
    'Intermédiaire': [],
    'Avancé': [],
    'Pratique': [],
  };

  // Group prompts by category from AI_TUTOR_PROMPTS
  AI_TUTOR_PROMPTS.forEach((prompt) => {
    const category = prompt.category || 'Débutant';
    if (category in categorized) {
      categorized[category].push(prompt.text);
    }
  });

  return (
    <div className="bg-slate-50 border-t border-slate-200 p-4 max-h-64 overflow-y-auto">
      <h3 className="font-semibold text-slate-900 mb-3 text-sm">
        Questions suggérées
      </h3>
      <div className="space-y-3">
        {Object.entries(categorized).map(([category, prompts]) => (
          <div key={category}>
            <h4 className="text-xs font-semibold text-slate-600 mb-2 uppercase">
              {category}
            </h4>
            <div className="space-y-1 ml-2">
              {prompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectPrompt(prompt)}
                  className="block w-full text-left text-sm p-2 rounded hover:bg-blue-100 text-slate-700 hover:text-blue-900 transition-colors"
                >
                  • {prompt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Component
export const AiTutorPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModule, setSelectedModule] = useState('Tous les modules');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiContent = generateMockAIResponse(messageText);

      const aiMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'ai',
        content: aiContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSelectSuggestion = (prompt: string) => {
    setInput(prompt);
    setTimeout(() => handleSendMessage(prompt), 100);
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-1 hover:bg-slate-700 rounded"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-2">
            <Sparkles size={24} className="text-blue-400" />
            <span className="font-bold">SAP Tuteur IA</span>
          </div>
          <div className="flex items-center gap-1">
            <Dot className="text-green-400 fill-green-400" size={12} />
            <span className="text-xs text-slate-400">En ligne</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="hidden sm:block">
            {selectedModule}
          </Badge>
          <Link href="/">
            <Button variant="ghost" size="sm" className="hover:bg-slate-700">
              <ArrowLeft size={16} className="mr-2" />
              <span className="hidden sm:inline">Retour</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-64 border-r border-slate-200 bg-white flex flex-col overflow-hidden">
            {/* Module Selector */}
            <div className="p-4 border-b border-slate-200">
              <label className="text-xs font-semibold text-slate-600 mb-2 block">
                Module
              </label>
              <div className="relative">
                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm appearance-none bg-white cursor-pointer"
                >
                  <option>Tous les modules</option>
                  {SAP_MODULES.map((module) => (
                    <option key={module.id} value={module.name}>
                      {module.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />
              </div>
            </div>

            {/* Suggested Prompts */}
            <SuggestedPrompts onSelectPrompt={handleSelectSuggestion} />
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <WelcomeScreen onSelectPrompt={handleSelectSuggestion} />
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isTyping && (
                  <div className="mb-4">
                    <TypingIndicator />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-200 bg-white p-4">
            <div className="flex gap-2 max-w-4xl mx-auto">
              <Input
                type="text"
                placeholder="Posez votre question sur SAP..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isTyping}
                className="flex-1"
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={isTyping || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiTutorPage;
