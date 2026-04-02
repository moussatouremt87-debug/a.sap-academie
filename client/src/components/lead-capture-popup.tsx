import { useState, useEffect } from "react";
import { X, Download, Gift, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface LeadCapturePopupProps {
  trigger?: "timer" | "scroll" | "exit" | "manual";
  delay?: number;
  onClose?: () => void;
  variant?: "guide" | "newsletter" | "promo" | "webinar";
}

const POPUP_VARIANTS = {
  guide: {
    icon: Download,
    title: "Guide SAP Gratuit",
    subtitle: "Téléchargez notre guide complet",
    description: "50 pages pour maîtriser les bases de SAP ERP. Transactions essentielles, bonnes pratiques et cas d'usage adaptés à l'Afrique de l'Ouest.",
    cta: "Télécharger le Guide",
    color: "from-blue-600 to-indigo-700",
    badge: "PDF Gratuit",
  },
  newsletter: {
    icon: BookOpen,
    title: "Newsletter SAP Hebdo",
    subtitle: "Restez à jour sur l'écosystème SAP",
    description: "Chaque semaine : nouveautés SAP, offres d'emploi ERP en Afrique, tutoriels exclusifs et conseils de consultants seniors.",
    cta: "S'abonner Gratuitement",
    color: "from-emerald-600 to-teal-700",
    badge: "Hebdomadaire",
  },
  promo: {
    icon: Gift,
    title: "-30% sur votre 1ère Formation",
    subtitle: "Offre limitée pour les nouveaux inscrits",
    description: "Profitez de 30% de réduction sur n'importe quelle formation SAP. Valable 48h après inscription. Code envoyé par email.",
    cta: "Obtenir mon Code Promo",
    color: "from-orange-500 to-red-600",
    badge: "Offre Limitée",
  },
  webinar: {
    icon: Sparkles,
    title: "Webinaire SAP Live",
    subtitle: "Prochaine session en direct",
    description: "Participez à notre webinaire gratuit : 'Débuter une carrière SAP en Afrique de l'Ouest'. Q&A avec des consultants expérimentés.",
    cta: "Réserver ma Place",
    color: "from-purple-600 to-violet-700",
    badge: "Live Gratuit",
  },
};

export function LeadCapturePopup({
  trigger = "timer",
  delay = 5000,
  onClose,
  variant = "guide",
}: LeadCapturePopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const config = POPUP_VARIANTS[variant];
  const IconComponent = config.icon;

  useEffect(() => {
    // Vérifier si déjà fermé récemment
    const dismissed = localStorage.getItem(`popup_dismissed_${variant}`);
    if (dismissed) {
      const dismissedAt = parseInt(dismissed);
      const hoursSince = (Date.now() - dismissedAt) / (1000 * 60 * 60);
      if (hoursSince < 24) return; // Ne pas réafficher avant 24h
    }

    if (trigger === "timer") {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }

    if (trigger === "scroll") {
      const handleScroll = () => {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent > 50) {
          setIsVisible(true);
          window.removeEventListener("scroll", handleScroll);
        }
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }

    if (trigger === "exit") {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0) {
          setIsVisible(true);
          document.removeEventListener("mouseleave", handleMouseLeave);
        }
      };
      document.addEventListener("mouseleave", handleMouseLeave);
      return () => document.removeEventListener("mouseleave", handleMouseLeave);
    }

    if (trigger === "manual") {
      setIsVisible(true);
    }
  }, [trigger, delay, variant]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem(`popup_dismissed_${variant}`, Date.now().toString());
    onClose?.();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    // Simulation d'envoi API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    toast({
      title: "Inscription réussie ! 🎉",
      description: `Un email de confirmation a été envoyé à ${email}`,
    });

    // Sauvegarder le lead localement
    const leads = JSON.parse(localStorage.getItem("asap_leads") || "[]");
    leads.push({
      email,
      nom,
      variant,
      date: new Date().toISOString(),
      source: window.location.pathname,
    });
    localStorage.setItem("asap_leads", JSON.stringify(leads));

    setTimeout(handleClose, 3000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* Popup Card */}
      <div className="relative w-full max-w-lg animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header gradient */}
        <div className={`bg-gradient-to-r ${config.color} px-6 py-8 text-white relative`}>
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-white/25 backdrop-blur-sm">
              {config.badge}
            </span>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm shrink-0">
              <IconComponent className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold leading-tight">{config.title}</h2>
              <p className="text-white/85 mt-1 text-sm">{config.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {!isSubmitted ? (
            <>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                {config.description}
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                  type="text"
                  placeholder="Votre nom (optionnel)"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="h-11"
                />
                <Input
                  type="email"
                  placeholder="Votre adresse email *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full h-12 text-base font-semibold bg-gradient-to-r ${config.color} hover:opacity-90 transition-opacity`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Envoi en cours...
                    </span>
                  ) : (
                    config.cta
                  )}
                </Button>
              </form>

              <p className="text-xs text-gray-400 mt-3 text-center">
                🔒 Vos données sont protégées. Désabonnement en un clic.
              </p>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Merci {nom || ""} ! 🎉</h3>
              <p className="text-gray-500 mt-2 text-sm">
                Vérifiez votre boîte email ({email}) pour confirmer votre inscription.
              </p>
            </div>
          )}
        </div>

        {/* Footer trust badges */}
        {!isSubmitted && (
          <div className="px-6 pb-5 flex items-center justify-center gap-6 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              +2,500 inscrits
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
              Contenu exclusif
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
              100% Gratuit
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Inline CTA Banner (non-popup) ──────────────────────
interface LeadBannerProps {
  variant?: "guide" | "newsletter" | "promo" | "webinar";
}

export function LeadBanner({ variant = "newsletter" }: LeadBannerProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const config = POPUP_VARIANTS[variant];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const leads = JSON.parse(localStorage.getItem("asap_leads") || "[]");
    leads.push({ email, variant, date: new Date().toISOString(), source: "banner" });
    localStorage.setItem("asap_leads", JSON.stringify(leads));

    setIsSubmitted(true);
    toast({ title: "Inscription réussie !", description: `Bienvenue dans la communauté A.SAP !` });
  };

  return (
    <section className={`bg-gradient-to-r ${config.color} py-12 px-4`}>
      <div className="max-w-3xl mx-auto text-center text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">{config.title}</h2>
        <p className="text-white/80 mb-6">{config.description}</p>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 bg-white/15 border-white/25 text-white placeholder:text-white/60 focus:bg-white/20"
            />
            <Button type="submit" variant="secondary" className="h-12 px-6 font-semibold shrink-0">
              {config.cta}
            </Button>
          </form>
        ) : (
          <p className="text-lg font-semibold">✅ Vous êtes inscrit ! Vérifiez votre email.</p>
        )}
      </div>
    </section>
  );
}

export default LeadCapturePopup;
