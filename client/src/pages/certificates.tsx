import { useState, useRef } from "react";
import { Link } from "wouter";
import {
  Award,
  Download,
  Share2,
  Calendar,
  BookOpen,
  CheckCircle2,
  Lock,
  ExternalLink,
  Printer,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/* ────────────────────── types ────────────────────────────── */
interface Certificate {
  id: number;
  courseId: number;
  courseTitle: string;
  module: string;
  earnedAt: string;
  certificateNumber: string;
  score: number;
  hoursCompleted: number;
  status: "earned" | "locked";
}

/* ────────────────────── mock data ────────────────────────── */
const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: 1,
    courseId: 1,
    courseTitle: "SAP FI/CO – Finance & Contrôle de gestion",
    module: "SAP FI/CO",
    earnedAt: "2026-03-28",
    certificateNumber: "ASAP-FICO-2026-0042",
    score: 92,
    hoursCompleted: 40,
    status: "earned",
  },
  {
    id: 2,
    courseId: 2,
    courseTitle: "SAP MM – Gestion des achats et stocks",
    module: "SAP MM",
    earnedAt: "",
    certificateNumber: "",
    score: 0,
    hoursCompleted: 12,
    status: "locked",
  },
  {
    id: 3,
    courseId: 3,
    courseTitle: "SAP SD – Administration des ventes",
    module: "SAP SD",
    earnedAt: "",
    certificateNumber: "",
    score: 0,
    hoursCompleted: 4,
    status: "locked",
  },
];

/* ────────────────────── helpers ──────────────────────────── */
function formatDate(dateStr: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getModuleColor(mod: string) {
  if (mod.includes("FI")) return "bg-blue-600";
  if (mod.includes("MM")) return "bg-emerald-600";
  if (mod.includes("SD")) return "bg-purple-600";
  return "bg-gray-600";
}

/* ────────────── certificate preview ──────────────────────── */
function CertificatePreview({
  cert,
  userName,
}: {
  cert: Certificate;
  userName: string;
}) {
  const certRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    // TODO: call server-side PDF generation endpoint
    // For now, use browser print
    window.print();
  };

  const handleShareLinkedIn = () => {
    const text = encodeURIComponent(
      `Je viens d'obtenir ma certification ${cert.module} sur A.SAP Académie ! 🎓\n\nCertificat N°${cert.certificateNumber}\nScore : ${cert.score}%\n\n#SAP #Formation #Certification #AfriqueDigitale`
    );
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        "https://asap-academie.com"
      )}&summary=${text}`,
      "_blank"
    );
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🎓 J'ai obtenu ma certification ${cert.module} sur A.SAP Académie !\nScore : ${cert.score}% | Certificat N°${cert.certificateNumber}\nhttps://asap-academie.com`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Certificate visual */}
      <div
        ref={certRef}
        className="relative bg-white rounded-2xl border-2 border-gold/30 shadow-xl overflow-hidden print:shadow-none"
      >
        {/* Gold border decoration */}
        <div className="absolute inset-0 border-8 border-yellow-400/20 rounded-2xl pointer-events-none" />
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-yellow-400/20 to-transparent rounded-tl-full" />

        <div className="relative px-8 py-12 md:px-16 md:py-16 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`w-10 h-10 rounded-lg ${getModuleColor(cert.module)} flex items-center justify-center`}>
              <Award className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">
              A.SAP Académie
            </span>
          </div>

          {/* Title */}
          <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-2">
            Certificat de réussite
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            {cert.courseTitle}
          </h2>

          {/* Divider */}
          <div className="w-24 h-1 bg-yellow-400 mx-auto my-6 rounded-full" />

          {/* Recipient */}
          <p className="text-gray-500 mb-1">Décerné à</p>
          <p className="text-2xl font-bold text-gray-800 mb-6">{userName}</p>

          {/* Details */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(cert.earnedAt)}
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Score : {cert.score}%
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {cert.hoursCompleted}h de formation
            </div>
          </div>

          {/* Certificate number */}
          <p className="text-xs text-gray-400 font-mono">
            N° {cert.certificateNumber}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button onClick={handleDownload} className="gap-2">
          <Download className="w-4 h-4" />
          Télécharger PDF
        </Button>
        <Button variant="outline" onClick={() => window.print()} className="gap-2">
          <Printer className="w-4 h-4" />
          Imprimer
        </Button>
        <Button
          variant="outline"
          onClick={handleShareLinkedIn}
          className="gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Partager sur LinkedIn
        </Button>
        <Button
          variant="outline"
          onClick={handleShareWhatsApp}
          className="gap-2"
        >
          <Share2 className="w-4 h-4" />
          WhatsApp
        </Button>
      </div>
    </div>
  );
}

/* ────────────── certificate card (list) ──────────────────── */
function CertificateCard({
  cert,
  onView,
}: {
  cert: Certificate;
  onView: () => void;
}) {
  const earned = cert.status === "earned";

  return (
    <Card
      className={`transition-all ${
        earned ? "hover:shadow-md cursor-pointer" : "opacity-60"
      }`}
      onClick={earned ? onView : undefined}
    >
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
              earned
                ? `${getModuleColor(cert.module)} text-white`
                : "bg-gray-200 dark:bg-gray-700 text-gray-400"
            }`}
          >
            {earned ? (
              <Award className="w-7 h-7" />
            ) : (
              <Lock className="w-6 h-6" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{cert.courseTitle}</h3>
            <Badge variant="secondary" className="mt-1 text-xs">
              {cert.module}
            </Badge>

            {earned ? (
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(cert.earnedAt)}
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  {cert.score}%
                </span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-2">
                Terminez le cours et réussissez le quiz final pour obtenir ce
                certificat.
              </p>
            )}
          </div>

          {earned && (
            <Button variant="ghost" size="sm" className="flex-shrink-0">
              Voir
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════
   CERTIFICATES PAGE
   ════════════════════════════════════════════════════════════ */
export default function CertificatesPage() {
  const [certificates] = useState<Certificate[]>(MOCK_CERTIFICATES);
  const [viewing, setViewing] = useState<Certificate | null>(null);
  const userName = "Moussa Touré"; // TODO: from auth context

  const earnedCount = certificates.filter((c) => c.status === "earned").length;

  if (viewing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => setViewing(null)}
            className="mb-6 gap-1"
          >
            ← Retour aux certificats
          </Button>
          <CertificatePreview cert={viewing} userName={userName} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Award className="w-8 h-8 text-yellow-500" />
              Mes Certificats
            </h1>
            <p className="text-muted-foreground mt-1">
              {earnedCount} certificat{earnedCount !== 1 ? "s" : ""} obtenu
              {earnedCount !== 1 ? "s" : ""} sur {certificates.length}
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              Dashboard
            </Button>
          </Link>
        </div>

        {/* Empty state */}
        {earnedCount === 0 && (
          <Card className="mb-6">
            <CardContent className="py-12 text-center">
              <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
              <h2 className="text-xl font-semibold mb-2">
                Pas encore de certificat
              </h2>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Terminez une formation complète et réussissez le quiz final pour
                obtenir votre premier certificat SAP.
              </p>
              <Link href="/courses">
                <Button>Explorer les formations</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Certificate list */}
        <div className="space-y-4">
          {certificates.map((cert) => (
            <CertificateCard
              key={cert.id}
              cert={cert}
              onView={() => setViewing(cert)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
