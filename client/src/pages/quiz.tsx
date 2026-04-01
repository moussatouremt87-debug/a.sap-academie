import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useLocation } from "wouter";
import {
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Trophy,
  RotateCcw,
  Home,
  Award,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

/* ────────────────────── types ────────────────────────────── */
interface Answer {
  id: number;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: number;
  text: string;
  explanation: string;
  answers: Answer[];
}

interface QuizData {
  id: number;
  title: string;
  courseId: number;
  courseTitle: string;
  moduleTitle: string;
  passingScore: number; // percentage
  timeLimit: number; // seconds, 0 = unlimited
  questions: Question[];
}

type QuizState = "intro" | "active" | "review" | "results";

/* ────────────────────── mock data ────────────────────────── */
const MOCK_QUIZ: QuizData = {
  id: 1,
  title: "Quiz – Comptabilité Générale (FI-GL)",
  courseId: 1,
  courseTitle: "SAP FI/CO – Finance & Contrôle de gestion",
  moduleTitle: "Comptabilité Générale",
  passingScore: 70,
  timeLimit: 600, // 10 minutes
  questions: [
    {
      id: 1,
      text: "Quelle transaction SAP permet de créer un plan comptable ?",
      explanation: "La transaction OB13 est utilisée pour créer et configurer un plan comptable dans SAP FI.",
      answers: [
        { id: 1, text: "OB13", isCorrect: true },
        { id: 2, text: "FB01", isCorrect: false },
        { id: 3, text: "KS01", isCorrect: false },
        { id: 4, text: "ME21N", isCorrect: false },
      ],
    },
    {
      id: 2,
      text: "Que signifie FI dans le module SAP FI ?",
      explanation: "FI = Financial Accounting (Comptabilité Financière). C'est le module principal pour la gestion comptable.",
      answers: [
        { id: 5, text: "Financial Instruments", isCorrect: false },
        { id: 6, text: "Financial Accounting", isCorrect: true },
        { id: 7, text: "Fiscal Integration", isCorrect: false },
        { id: 8, text: "Finance & Investment", isCorrect: false },
      ],
    },
    {
      id: 3,
      text: "Quelle est la transaction pour saisir une écriture comptable ?",
      explanation: "FB01 (ou son successeur FB50 en mode Enjoy) permet de saisir des écritures comptables dans le Grand Livre.",
      answers: [
        { id: 9, text: "FB01", isCorrect: true },
        { id: 10, text: "VA01", isCorrect: false },
        { id: 11, text: "MM01", isCorrect: false },
        { id: 12, text: "CO01", isCorrect: false },
      ],
    },
    {
      id: 4,
      text: "Le document comptable dans SAP doit toujours être :",
      explanation: "Principe fondamental de la comptabilité en partie double : chaque écriture doit être équilibrée (débit = crédit).",
      answers: [
        { id: 13, text: "Archivé immédiatement", isCorrect: false },
        { id: 14, text: "Approuvé par un manager", isCorrect: false },
        { id: 15, text: "Équilibré (débit = crédit)", isCorrect: true },
        { id: 16, text: "En devise locale uniquement", isCorrect: false },
      ],
    },
    {
      id: 5,
      text: "Combien de segments minimum un document FI doit-il avoir ?",
      explanation: "Un document FI doit avoir au minimum 2 postes (lignes) : un débit et un crédit pour respecter la partie double.",
      answers: [
        { id: 17, text: "1 poste", isCorrect: false },
        { id: 18, text: "2 postes", isCorrect: true },
        { id: 19, text: "3 postes", isCorrect: false },
        { id: 20, text: "4 postes", isCorrect: false },
      ],
    },
  ],
};

/* ────────────────────── helpers ──────────────────────────── */
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* ────────────────── intro screen ─────────────────────────── */
function QuizIntro({
  quiz,
  onStart,
}: {
  quiz: QuizData;
  onStart: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center pb-2">
          <Badge variant="secondary" className="w-fit mx-auto mb-3">
            {quiz.moduleTitle}
          </Badge>
          <CardTitle className="text-2xl">{quiz.title}</CardTitle>
          <p className="text-muted-foreground mt-2">{quiz.courseTitle}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-muted/50">
              <p className="text-2xl font-bold">{quiz.questions.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Questions</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50">
              <p className="text-2xl font-bold">
                {quiz.timeLimit > 0 ? formatTime(quiz.timeLimit) : "∞"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Temps limite</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50">
              <p className="text-2xl font-bold">{quiz.passingScore}%</p>
              <p className="text-xs text-muted-foreground mt-1">Score requis</p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-xl text-sm">
            <p className="font-medium text-blue-700 dark:text-blue-300 mb-2">
              Avant de commencer :
            </p>
            <ul className="space-y-1 text-blue-600 dark:text-blue-400">
              <li>• Lisez chaque question attentivement</li>
              <li>• Sélectionnez une seule réponse par question</li>
              <li>• Vous pouvez naviguer entre les questions</li>
              <li>
                • Score minimum de {quiz.passingScore}% pour valider le module
              </li>
            </ul>
          </div>

          <Button onClick={onStart} className="w-full gap-2" size="lg">
            Commencer le quiz
            <ArrowRight className="w-5 h-5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/* ────────────────── question card ────────────────────────── */
function QuestionCard({
  question,
  index,
  total,
  selectedAnswerId,
  onSelect,
  showFeedback,
}: {
  question: Question;
  index: number;
  total: number;
  selectedAnswerId: number | null;
  onSelect: (answerId: number) => void;
  showFeedback: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Badge variant="outline">
          Question {index + 1} / {total}
        </Badge>
      </div>

      <h2 className="text-xl font-semibold mb-6">{question.text}</h2>

      <div className="space-y-3">
        {question.answers.map((answer) => {
          const isSelected = selectedAnswerId === answer.id;
          let styles = "border-2 transition-all cursor-pointer hover:border-primary/50";

          if (showFeedback) {
            if (answer.isCorrect) {
              styles = "border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30";
            } else if (isSelected && !answer.isCorrect) {
              styles = "border-2 border-red-500 bg-red-50 dark:bg-red-950/30";
            } else {
              styles = "border-2 border-muted opacity-50";
            }
          } else if (isSelected) {
            styles = "border-2 border-primary bg-primary/5";
          }

          return (
            <button
              key={answer.id}
              onClick={() => !showFeedback && onSelect(answer.id)}
              disabled={showFeedback}
              className={`w-full text-left p-4 rounded-xl flex items-center gap-3 ${styles}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                  isSelected && !showFeedback
                    ? "bg-primary text-primary-foreground"
                    : showFeedback && answer.isCorrect
                    ? "bg-emerald-500 text-white"
                    : showFeedback && isSelected && !answer.isCorrect
                    ? "bg-red-500 text-white"
                    : "bg-muted"
                }`}
              >
                {showFeedback ? (
                  answer.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isSelected ? (
                    <XCircle className="w-4 h-4" />
                  ) : (
                    String.fromCharCode(65 + question.answers.indexOf(answer))
                  )
                ) : (
                  String.fromCharCode(65 + question.answers.indexOf(answer))
                )}
              </div>
              <span className="flex-1">{answer.text}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation after feedback */}
      {showFeedback && (
        <div className="mt-4 p-4 bg-muted/50 rounded-xl border">
          <p className="text-sm font-medium mb-1">Explication :</p>
          <p className="text-sm text-muted-foreground">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}

/* ────────────────── results screen ───────────────────────── */
function QuizResults({
  quiz,
  answers,
  timeSpent,
  onRetry,
}: {
  quiz: QuizData;
  answers: Map<number, number>;
  timeSpent: number;
  onRetry: () => void;
}) {
  const [, navigate] = useLocation();

  const correctCount = quiz.questions.filter((q) => {
    const selectedId = answers.get(q.id);
    return q.answers.find((a) => a.id === selectedId)?.isCorrect;
  }).length;

  const score = Math.round((correctCount / quiz.questions.length) * 100);
  const passed = score >= quiz.passingScore;
  const xpEarned = passed ? 100 + correctCount * 20 : correctCount * 10;

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardContent className="pt-8 text-center">
          {/* Trophy / Result */}
          <div
            className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
              passed
                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
                : "bg-red-100 dark:bg-red-900/30 text-red-600"
            }`}
          >
            {passed ? (
              <Trophy className="w-10 h-10" />
            ) : (
              <XCircle className="w-10 h-10" />
            )}
          </div>

          <h2 className="text-2xl font-bold mb-2">
            {passed ? "Félicitations !" : "Pas encore..."}
          </h2>
          <p className="text-muted-foreground mb-6">
            {passed
              ? "Vous avez réussi ce quiz avec succès !"
              : `Il faut ${quiz.passingScore}% pour valider. Réessayez !`}
          </p>

          {/* Score circle */}
          <div className="relative w-40 h-40 mx-auto mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted/30"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${score * 2.64} 264`}
                strokeLinecap="round"
                className={passed ? "text-emerald-500" : "text-red-500"}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{score}%</span>
              <span className="text-xs text-muted-foreground">Score</span>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-3 rounded-xl bg-muted/50">
              <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-emerald-500" />
              <p className="text-lg font-bold">{correctCount}/{quiz.questions.length}</p>
              <p className="text-xs text-muted-foreground">Correctes</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/50">
              <Clock className="w-5 h-5 mx-auto mb-1 text-blue-500" />
              <p className="text-lg font-bold">{formatTime(timeSpent)}</p>
              <p className="text-xs text-muted-foreground">Temps</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/50">
              <Zap className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
              <p className="text-lg font-bold">+{xpEarned}</p>
              <p className="text-xs text-muted-foreground">XP gagnés</p>
            </div>
          </div>

          {/* Badges earned */}
          {passed && (
            <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-xl mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-yellow-700 dark:text-yellow-300">
                  Badge débloqué !
                </span>
              </div>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                Quiz Master – Vous avez validé le module {quiz.moduleTitle}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {!passed && (
              <Button onClick={onRetry} variant="default" className="flex-1 gap-2">
                <RotateCcw className="w-4 h-4" />
                Réessayer
              </Button>
            )}
            <Link href={`/courses/${quiz.courseId}`} className="flex-1">
              <Button variant={passed ? "default" : "outline"} className="w-full gap-2">
                <ChevronRight className="w-4 h-4" />
                {passed ? "Continuer le cours" : "Revoir les leçons"}
              </Button>
            </Link>
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full gap-2">
                <Home className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   QUIZ PAGE
   ════════════════════════════════════════════════════════════ */
export default function QuizPage() {
  const params = useParams<{ quizId: string }>();
  const [quiz] = useState<QuizData>(MOCK_QUIZ);
  const [state, setState] = useState<QuizState>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Map<number, number>>(new Map());
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit);
  const [timeSpent, setTimeSpent] = useState(0);

  // Timer
  useEffect(() => {
    if (state !== "active" || quiz.timeLimit === 0) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setState("results");
          return 0;
        }
        return t - 1;
      });
      setTimeSpent((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [state, quiz.timeLimit]);

  const handleSelect = (answerId: number) => {
    const q = quiz.questions[currentQ];
    setAnswers((prev) => new Map(prev).set(q.id, answerId));
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    if (currentQ < quiz.questions.length - 1) {
      setCurrentQ((c) => c + 1);
    } else {
      setState("results");
    }
  };

  const handleStart = () => {
    setState("active");
    setTimeLeft(quiz.timeLimit);
    setTimeSpent(0);
  };

  const handleRetry = () => {
    setAnswers(new Map());
    setCurrentQ(0);
    setShowFeedback(false);
    setState("intro");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* ── Intro ────────── */}
        {state === "intro" && <QuizIntro quiz={quiz} onStart={handleStart} />}

        {/* ── Active quiz ──── */}
        {state === "active" && (
          <div className="max-w-2xl mx-auto">
            {/* Timer + progress */}
            <div className="flex items-center gap-4 mb-6">
              <Progress
                value={((currentQ + 1) / quiz.questions.length) * 100}
                className="flex-1 h-2"
              />
              {quiz.timeLimit > 0 && (
                <div
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-mono ${
                    timeLeft < 60
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      : "bg-muted"
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  {formatTime(timeLeft)}
                </div>
              )}
            </div>

            {/* Question */}
            <Card>
              <CardContent className="pt-6">
                <QuestionCard
                  question={quiz.questions[currentQ]}
                  index={currentQ}
                  total={quiz.questions.length}
                  selectedAnswerId={answers.get(quiz.questions[currentQ].id) ?? null}
                  onSelect={handleSelect}
                  showFeedback={showFeedback}
                />

                {/* Next button */}
                {showFeedback && (
                  <div className="mt-6 flex justify-end">
                    <Button onClick={handleNext} className="gap-2">
                      {currentQ < quiz.questions.length - 1
                        ? "Question suivante"
                        : "Voir les résultats"}
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Question dots */}
            <div className="flex justify-center gap-2 mt-6">
              {quiz.questions.map((q, i) => (
                <div
                  key={q.id}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i === currentQ
                      ? "bg-primary scale-125"
                      : answers.has(q.id)
                      ? "bg-primary/40"
                      : "bg-muted-foreground/20"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Results ───────┈ */}
        {state === "results" && (
          <QuizResults
            quiz={quiz}
            answers={answers}
            timeSpent={timeSpent}
            onRetry={handleRetry}
          />
        )}
      </div>
    </div>
  );
}
