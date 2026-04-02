import { useState } from "react";
import { Gift, Users, Copy, Check, Star, ArrowRight, Trophy, Share2, Zap, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// ── Types ──────────────────────────────────────────────
interface ReferralReward {
  id: string;
  threshold: number;
  reward: string;
  description: string;
  icon: typeof Gift;
  unlocked: boolean;
}

interface ReferralStats {
  totalReferrals: number;
  pendingReferrals: number;
  completedReferrals: number;
  totalEarnings: string;
  referralCode: string;
  referralLink: string;
}

// ── Données ────────────────────────────────────────────
const REWARDS: ReferralReward[] = [
  {
    id: "1",
    threshold: 1,
    reward: "-15% sur votre prochaine formation",
    description: "Parrainez 1 ami et obtenez une réduction immédiate",
    icon: Gift,
    unlocked: false,
  },
  {
    id: "2",
    threshold: 3,
    reward: "Accès Tuteur IA Premium (1 mois)",
    description: "3 parrainages = accès illimité au tuteur IA pendant 30 jours",
    icon: Zap,
    unlocked: false,
  },
  {
    id: "3",
    threshold: 5,
    reward: "Formation SAP au choix GRATUITE",
    description: "5 parrainages = une formation complète offerte dans le module de votre choix",
    icon: Trophy,
    unlocked: false,
  },
  {
    id: "4",
    threshold: 10,
    reward: "Certification SAP sponsorisée",
    description: "10 parrainages = A.SAP finance votre passage de certification officielle SAP",
    icon: Star,
    unlocked: false,
  },
];

const STEPS = [
  {
    step: 1,
    title: "Partagez votre lien",
    description: "Copiez votre lien unique de parrainage et envoyez-le à vos amis, collègues ou sur les réseaux sociaux.",
    icon: Share2,
  },
  {
    step: 2,
    title: "Votre ami s'inscrit",
    description: "Quand votre ami s'inscrit via votre lien et commence une formation, le parrainage est validé.",
    icon: Users,
  },
  {
    step: 3,
    title: "Récoltez vos récompenses",
    description: "Vous et votre ami recevez des réductions. Plus vous parrainez, plus les récompenses sont grandes !",
    icon: Gift,
  },
];

const TESTIMONIALS = [
  {
    name: "Ousmane D.",
    location: "Dakar, Sénégal",
    text: "J'ai parrainé 5 collègues et obtenu une formation SAP SD gratuite. Le système est vraiment généreux !",
    referrals: 5,
  },
  {
    name: "Mariam K.",
    location: "Abidjan, Côte d'Ivoire",
    text: "Grâce au parrainage, toute mon équipe comptable suit des formations SAP FI à prix réduit.",
    referrals: 8,
  },
  {
    name: "Abdoulaye B.",
    location: "Bamako, Mali",
    text: "3 parrainages en une semaine. L'accès au Tuteur IA Premium a changé ma façon d'apprendre SAP.",
    referrals: 3,
  },
];

// ── Composants ─────────────────────────────────────────

function StepCard({ step }: { step: (typeof STEPS)[0] }) {
  const Icon = step.icon;
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
        <Icon className="h-7 w-7 text-white" />
      </div>
      <div className="text-sm font-bold text-blue-600 mb-1">Étape {step.step}</div>
      <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
    </div>
  );
}

function RewardTier({ reward, index }: { reward: ReferralReward; index: number }) {
  const Icon = reward.icon;
  const colors = [
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-orange-500 to-red-500",
    "from-yellow-500 to-amber-500",
  ];

  return (
    <Card className={`border-2 ${reward.unlocked ? "border-green-300 bg-green-50/50" : "border-gray-100"} transition-all hover:shadow-lg`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[index]} text-white shrink-0 shadow-lg`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs font-bold">
                {reward.threshold} parrainage{reward.threshold > 1 ? "s" : ""}
              </Badge>
              {reward.unlocked && (
                <Badge className="bg-green-500 text-white text-xs">Débloqué ✓</Badge>
              )}
            </div>
            <h3 className="font-bold text-gray-900 mb-1">{reward.reward}</h3>
            <p className="text-gray-500 text-sm">{reward.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Page Principale ────────────────────────────────────
export default function ParrainagePage() {
  const [email, setEmail] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const [stats] = useState<ReferralStats>({
    totalReferrals: 0,
    pendingReferrals: 0,
    completedReferrals: 0,
    totalEarnings: "0 FCFA",
    referralCode: "ASAP-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    referralLink: "",
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsRegistered(true);
    toast({
      title: "Bienvenue dans le programme ! 🎉",
      description: "Votre lien de parrainage est prêt à être partagé.",
    });
  };

  const referralLink = `https://asap-academie.com/inscription?ref=${stats.referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({ title: "Lien copié !", description: "Partagez-le avec vos amis." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const text = `Découvrez A.SAP Académie, la meilleure plateforme de formation SAP en Afrique ! Inscrivez-vous avec mon lien pour bénéficier d'une réduction : ${referralLink}`;
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      email: `mailto:?subject=${encodeURIComponent("Rejoins A.SAP Académie !")}&body=${encodeURIComponent(text)}`,
    };
    window.open(urls[platform], "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white py-16 md:py-24 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <Badge className="bg-white/15 text-white border-white/20 mb-6 text-sm px-4 py-1">
            <Gift className="h-4 w-4 mr-1" />
            Programme de Parrainage
          </Badge>

          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
            Parrainez vos amis,{" "}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              gagnez des formations gratuites
            </span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            Invitez vos collègues et amis à rejoindre A.SAP Académie. Pour chaque inscription, vous et votre filleul recevez des avantages exclusifs.
          </p>

          {/* Stats rapides */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/10">
              <div className="text-2xl font-bold">-15%</div>
              <div className="text-xs text-white/60">par parrainage</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/10">
              <div className="text-2xl font-bold">∞</div>
              <div className="text-xs text-white/60">parrainages illimités</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/10">
              <div className="text-2xl font-bold">2x</div>
              <div className="text-xs text-white/60">double récompense</div>
            </div>
          </div>

          {/* Registration / Referral Link */}
          {!isRegistered ? (
            <form onSubmit={handleRegister} className="max-w-md mx-auto flex gap-3">
              <Input
                type="email"
                placeholder="Votre email pour commencer"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-white/15 border-white/25 text-white placeholder:text-white/50"
              />
              <Button type="submit" className="h-12 px-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold hover:opacity-90">
                Commencer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          ) : (
            <div className="max-w-lg mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-xs text-white/60 mb-2">Votre lien de parrainage :</p>
                <div className="flex gap-2">
                  <Input value={referralLink} readOnly className="h-11 bg-white/10 border-white/20 text-white text-sm" />
                  <Button onClick={handleCopy} variant="secondary" className="h-11 px-4 shrink-0">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex gap-2 mt-3 justify-center">
                  {["whatsapp", "linkedin", "twitter", "email"].map((p) => (
                    <Button
                      key={p}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(p)}
                      className="text-white/70 hover:text-white hover:bg-white/15 capitalize text-xs"
                    >
                      {p === "email" ? "📧 Email" : p === "whatsapp" ? "💬 WhatsApp" : p === "linkedin" ? "💼 LinkedIn" : "🐦 Twitter"}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">Comment ça marche ?</h2>
        <p className="text-gray-500 text-center mb-10">3 étapes simples pour commencer à gagner</p>
        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <StepCard key={step.step} step={step} />
          ))}
        </div>
      </section>

      {/* Paliers de récompenses */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">Paliers de Récompenses</h2>
          <p className="text-gray-500 text-center mb-10">Plus vous parrainez, plus les récompenses sont grandes</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {REWARDS.map((reward, i) => (
              <RewardTier key={reward.id} reward={reward} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages parrains */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">Ils ont parrainé</h2>
          <p className="text-gray-500 text-center mb-10">Découvrez les témoignages de nos meilleurs parrains</p>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <Card key={i} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.location}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <Heart className="h-3 w-3 mr-1 text-red-500" />
                      {t.referrals} parrainages
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Prêt à parrainer ?</h2>
          <p className="text-white/70 mb-6">
            Rejoignez +500 parrains actifs et gagnez des formations SAP gratuites pour vous et vos amis.
          </p>
          <Button
            size="lg"
            className="bg-white text-indigo-700 hover:bg-gray-100 font-bold px-8 h-12"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Gift className="mr-2 h-5 w-5" />
            Commencer à Parrainer
          </Button>
        </div>
      </section>
    </div>
  );
}
