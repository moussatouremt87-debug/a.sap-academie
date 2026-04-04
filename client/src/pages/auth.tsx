import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GraduationCap,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Shield,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

type UserRole = "etudiant" | "formateur" | "admin";

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
}

function LoginForm() {
  const [, setLocation] = useLocation();
  const { signIn, signInWithGoogle } = useAuth();
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const { error: authError } = await signIn(formData.email, formData.password);
    if (authError) {
      setError(authError === "Invalid login credentials"
        ? "Email ou mot de passe incorrect"
        : authError);
      setIsLoading(false);
    } else {
      setLocation("/dashboard");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="login-email">Adresse email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="login-email"
            type="email"
            placeholder="votre@email.com"
            className="pl-10"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password">Mot de passe</Label>
          <button
            type="button"
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Mot de passe oubliÃ© ?
          </button>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="********"
            className="pl-10 pr-10"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Connexion en cours...
          </div>
        ) : (
          "Se connecter"
        )}
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-400">ou continuer avec</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Button
          variant="outline"
          type="button"
          className="text-sm"
          onClick={() => signInWithGoogle()}
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continuer avec Google
        </Button>
      </div>
    </form>
  );
}

function RegisterForm() {
  const [, setLocation] = useLocation();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "etudiant",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1);

  const passwordStrength = (
    password: string
  ): { score: number; label: string; color: string } => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score, label: "Faible", color: "bg-red-500" };
    if (score === 2) return { score, label: "Moyen", color: "bg-yellow-500" };
    if (score === 3) return { score, label: "Fort", color: "bg-green-400" };
    return { score, label: "TrÃ¨s fort", color: "bg-green-600" };
  };

  const strength = passwordStrength(formData.password || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.role) {
        setError("Veuillez remplir tous les champs");
        return;
      }
      setError("");
      setStep(2);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (strength.score < 2) {
      setError("Le mot de passe est trop faible");
      return;
    }

    setIsLoading(true);
    setError("");

    const { error: authError } = await signUp(
      formData.email,
      formData.password,
      {
        firstName: formData.firstName!,
        lastName: formData.lastName!,
        role: formData.role!,
      }
    );

    if (authError) {
      setError(authError);
      setIsLoading(false);
    } else {
      setSuccess("Compte crÃ©Ã© ! VÃ©rifiez votre email pour confirmer votre inscription.");
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <CheckCircle2 className="w-12 h-12 text-green-500" />
        <p className="text-center text-sm text-gray-600">{success}</p>
        <Button
          variant="outline"
          onClick={() => setLocation("/auth")}
          className="mt-2"
        >
          Retour Ã  la connexion
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="flex items-center gap-2 mb-2">
        <div
          className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
            step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
          }`}
        >
          1
        </div>
        <div
          className={`flex-1 h-1 rounded ${
            step >= 2 ? "bg-blue-600" : "bg-gray-200"
          }`}
        />
        <div
          className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
            step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
          }`}
        >
          2
        </div>
      </div>

      {step === 1 ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="reg-firstname">PrÃ©nom</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="reg-firstname"
                  placeholder="PrÃ©nom"
                  className="pl-10"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-lastname">Nom</Label>
              <Input
                id="reg-lastname"
                placeholder="Nom"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-role">Je suis</Label>
            <Select
              value={formData.role}
              onValueChange={(v: UserRole) =>
                setFormData({ ...formData, role: v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="SÃ©lectionnez votre profil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="etudiant">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Ãtudiant / Apprenant
                  </div>
                </SelectItem>
                <SelectItem value="formateur">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Formateur / Consultant
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Administrateur
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Continuer
          </Button>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            <ArrowLeft className="w-3 h-3" /> Retour
          </button>

          <div className="space-y-2">
            <Label htmlFor="reg-email">Adresse email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="reg-email"
                type="email"
                placeholder="votre@email.com"
                className="pl-10"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-password">Mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="pl-10 pr-10"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {formData.password && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${
                        i <= strength.score ? strength.color : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Force : {strength.label}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-confirm">Confirmer le mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="reg-confirm"
                type="password"
                placeholder="********"
                className="pl-10"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />
              {formData.confirmPassword &&
                formData.password === formData.confirmPassword && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                )}
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
            <Shield className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              En crÃ©ant un compte, vous acceptez nos conditions d'utilisation et
              notre politique de confidentialitÃ©. Vos donnÃ©es sont protÃ©gÃ©es.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                CrÃ©ation en cours...
              </div>
            ) : (
              "CrÃ©er mon compte"
            )}
          </Button>
        </>
      )}
    </form>
  );
}

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, loading } = useAuth();

  // Redirect if already logged in
  if (!loading && user) {
    setLocation("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative z-10">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-3 mb-16 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold">A.SAP AcadÃ©mie</span>
          </button>
          <h1 className="text-4xl font-bold leading-tight mb-6">
            Formez-vous aux mÃ©tiers SAP les plus demandÃ©s en Afrique
          </h1>
          <p className="text-lg text-blue-100 leading-relaxed">
            Rejoignez plus de 2 500 professionnels formÃ©s sur SAP FI, CO, MM, SD
            et HANA. AccÃ©dez Ã  des formations certifiantes, un tuteur IA et une
            communautÃ© active.
          </p>
        </div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {["bg-yellow-400", "bg-green-400", "bg-pink-400", "bg-purple-400"].map(
                (color, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full ${color} border-2 border-white/50 flex items-center justify-center text-xs font-bold text-white`}
                  >
                    {["MT", "AK", "FD", "SB"][i]}
                  </div>
                )
              )}
            </div>
            <p className="text-sm text-blue-100">
              <strong className="text-white">+2 500</strong> apprenants nous font
              confiance
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "95%", label: "Taux de rÃ©ussite" },
              { value: "12+", label: "Modules SAP" },
              { value: "24/7", label: "Support IA" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <button
              onClick={() => setLocation("/")}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                A.SAP AcadÃ©mie
              </span>
            </button>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-center text-xl">Bienvenue</CardTitle>
              <p className="text-center text-sm text-gray-500">
                Connectez-vous ou crÃ©ez votre compte pour accÃ©der Ã  vos
                formations
              </p>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Connexion</TabsTrigger>
                  <TabsTrigger value="register">Inscription</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <LoginForm />
                </TabsContent>
                <TabsContent value="register">
                  <RegisterForm />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-gray-400 mt-6">
            ProtÃ©gÃ© par chiffrement SSL 256-bit. Vos donnÃ©es sont en sÃ©curitÃ©.
          </p>
        </div>
      </div>
    </div>
  );
}
