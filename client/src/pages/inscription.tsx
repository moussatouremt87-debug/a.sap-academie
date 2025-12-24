import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Upload, FileText, CheckCircle, Loader2 } from "lucide-react";
import { SEO } from "@/components/seo";
import type { Formation } from "@shared/schema";

const inscriptionSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  educationLevel: z.string().min(1, "Veuillez sélectionner votre niveau d'études"),
  educationField: z.string().optional(),
  currentPosition: z.string().optional(),
  company: z.string().optional(),
  experience: z.string().optional(),
  motivation: z.string().optional(),
});

type InscriptionFormData = z.infer<typeof inscriptionSchema>;

export default function Inscription() {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const formationId = params.get("formation");

  const { data: formation, isLoading: formationLoading } = useQuery<Formation>({
    queryKey: ["/api/formations", formationId],
    enabled: !!formationId,
  });

  const form = useForm<InscriptionFormData>({
    resolver: zodResolver(inscriptionSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      educationLevel: "",
      educationField: "",
      currentPosition: "",
      company: "",
      experience: "",
      motivation: "",
    },
  });

  const enrollMutation = useMutation({
    mutationFn: async (data: InscriptionFormData & { formationId: number; cvUrl?: string }) => {
      const response = await apiRequest("POST", "/api/enrollments", data);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: language === "fr" ? "Inscription envoyée !" : "Registration submitted!",
        description: language === "fr" 
          ? "Nous avons bien reçu votre demande. Notre équipe vous contactera sous 24-48h."
          : "We have received your request. Our team will contact you within 24-48h.",
      });
    },
    onError: (error) => {
      toast({
        title: language === "fr" ? "Erreur" : "Error",
        description: language === "fr" 
          ? "Une erreur est survenue. Veuillez réessayer."
          : "An error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: language === "fr" ? "Fichier trop volumineux" : "File too large",
        description: language === "fr" 
          ? "Le fichier ne doit pas dépasser 10 Mo"
          : "File must not exceed 10 MB",
        variant: "destructive",
      });
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: language === "fr" ? "Format non supporté" : "Unsupported format",
        description: language === "fr" 
          ? "Seuls les fichiers PDF et Word sont acceptés"
          : "Only PDF and Word files are accepted",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const response = await fetch("/api/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name,
          size: file.size,
          contentType: file.type,
        }),
      });

      if (!response.ok) throw new Error("Failed to get upload URL");

      const { uploadURL, objectPath } = await response.json();

      await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      setCvUrl(objectPath);
      setCvFileName(file.name);
      
      toast({
        title: language === "fr" ? "CV uploadé" : "CV uploaded",
        description: file.name,
      });
    } catch (error) {
      toast({
        title: language === "fr" ? "Erreur d'upload" : "Upload error",
        description: language === "fr" 
          ? "Impossible d'uploader le fichier"
          : "Unable to upload file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = (data: InscriptionFormData) => {
    if (!formationId) return;
    
    enrollMutation.mutate({
      ...data,
      formationId: parseInt(formationId),
      cvUrl: cvUrl || undefined,
    });
  };

  if (isSubmitted) {
    return (
      <>
        <SEO
          title={language === "fr" ? "Inscription confirmée" : "Registration confirmed"}
          description={language === "fr" ? "Votre inscription a été enregistrée" : "Your registration has been recorded"}
          includeOrgSchema={false}
        />
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {language === "fr" ? "Inscription enregistrée !" : "Registration recorded!"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === "fr" 
                  ? "Merci pour votre inscription. Notre équipe commerciale vous contactera sous 24-48h pour finaliser votre dossier."
                  : "Thank you for your registration. Our sales team will contact you within 24-48h to finalize your application."}
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/formations" data-testid="link-back-formations">
                    {language === "fr" ? "Voir d'autres formations" : "View other courses"}
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/agent" data-testid="link-contact-agent">
                    {language === "fr" ? "Contacter un conseiller" : "Contact an advisor"}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (!formationId) {
    return (
      <>
        <SEO
          title={language === "fr" ? "Inscription" : "Registration"}
          description={language === "fr" ? "Inscrivez-vous à une formation SAP" : "Register for SAP training"}
          includeOrgSchema={false}
        />
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center">
              <h2 className="text-xl font-semibold mb-4">
                {language === "fr" ? "Aucune formation sélectionnée" : "No course selected"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === "fr" 
                  ? "Veuillez sélectionner une formation depuis notre catalogue."
                  : "Please select a course from our catalog."}
              </p>
              <Button asChild>
                <Link href="/formations" data-testid="link-formations-catalog">
                  {language === "fr" ? "Voir le catalogue" : "View catalog"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const educationLevels = language === "fr" ? [
    { value: "bac", label: "Baccalauréat" },
    { value: "bac+2", label: "Bac+2 (BTS, DUT, DEUG)" },
    { value: "bac+3", label: "Bac+3 (Licence, Bachelor)" },
    { value: "bac+4", label: "Bac+4 (Maîtrise, M1)" },
    { value: "bac+5", label: "Bac+5 (Master, Ingénieur)" },
    { value: "bac+8", label: "Bac+8 (Doctorat)" },
    { value: "autre", label: "Autre" },
  ] : [
    { value: "high_school", label: "High School Diploma" },
    { value: "associate", label: "Associate Degree" },
    { value: "bachelor", label: "Bachelor's Degree" },
    { value: "master", label: "Master's Degree" },
    { value: "doctorate", label: "Doctorate" },
    { value: "other", label: "Other" },
  ];

  const experienceLevels = language === "fr" ? [
    { value: "0", label: "Aucune expérience" },
    { value: "1-2", label: "1-2 ans" },
    { value: "3-5", label: "3-5 ans" },
    { value: "5-10", label: "5-10 ans" },
    { value: "10+", label: "Plus de 10 ans" },
  ] : [
    { value: "0", label: "No experience" },
    { value: "1-2", label: "1-2 years" },
    { value: "3-5", label: "3-5 years" },
    { value: "5-10", label: "5-10 years" },
    { value: "10+", label: "More than 10 years" },
  ];

  return (
    <>
      <SEO
        title={language === "fr" ? `Inscription - ${formation?.title || "Formation"}` : `Registration - ${formation?.title || "Course"}`}
        description={language === "fr" ? "Inscrivez-vous à une formation SAP professionnelle" : "Register for professional SAP training"}
        includeOrgSchema={false}
      />
      <div className="min-h-screen bg-background">
        <div className="container max-w-3xl mx-auto py-8 px-4">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/formations" data-testid="link-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === "fr" ? "Retour au catalogue" : "Back to catalog"}
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {language === "fr" ? "Formulaire d'inscription" : "Registration Form"}
              </CardTitle>
              <CardDescription>
                {formationLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {language === "fr" ? "Chargement..." : "Loading..."}
                  </span>
                ) : formation ? (
                  <span>
                    {language === "fr" ? "Formation : " : "Course: "}
                    <strong>{formation.title}</strong>
                  </span>
                ) : null}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">
                      {language === "fr" ? "Informations personnelles" : "Personal Information"}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{language === "fr" ? "Prénom *" : "First Name *"}</FormLabel>
                            <FormControl>
                              <Input placeholder="Jean" {...field} data-testid="input-firstname" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{language === "fr" ? "Nom *" : "Last Name *"}</FormLabel>
                            <FormControl>
                              <Input placeholder="Dupont" {...field} data-testid="input-lastname" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="jean.dupont@email.com" {...field} data-testid="input-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{language === "fr" ? "Téléphone" : "Phone"}</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="+221 77 123 45 67" {...field} data-testid="input-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">
                      {language === "fr" ? "Parcours scolaire & professionnel" : "Education & Professional Background"}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="educationLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{language === "fr" ? "Niveau d'études *" : "Education Level *"}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-education-level">
                                  <SelectValue placeholder={language === "fr" ? "Sélectionnez..." : "Select..."} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {educationLevels.map((level) => (
                                  <SelectItem key={level.value} value={level.value}>
                                    {level.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="educationField"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{language === "fr" ? "Domaine d'études" : "Field of Study"}</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder={language === "fr" ? "Ex: Informatique, Gestion..." : "Ex: Computer Science, Business..."} 
                                {...field} 
                                data-testid="input-education-field"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="currentPosition"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{language === "fr" ? "Poste actuel" : "Current Position"}</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder={language === "fr" ? "Ex: Consultant, Étudiant..." : "Ex: Consultant, Student..."} 
                                {...field} 
                                data-testid="input-position"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{language === "fr" ? "Entreprise" : "Company"}</FormLabel>
                            <FormControl>
                              <Input placeholder={language === "fr" ? "Nom de l'entreprise" : "Company name"} {...field} data-testid="input-company" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{language === "fr" ? "Expérience professionnelle" : "Professional Experience"}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-experience">
                                <SelectValue placeholder={language === "fr" ? "Sélectionnez..." : "Select..."} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {experienceLevels.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                  {level.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">
                      {language === "fr" ? "CV & Motivation" : "Resume & Motivation"}
                    </h3>

                    <div className="space-y-2">
                      <Label>{language === "fr" ? "Télécharger votre CV" : "Upload your Resume"}</Label>
                      <div className="border-2 border-dashed rounded-md p-6 text-center">
                        {cvFileName ? (
                          <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                            <FileText className="w-5 h-5" />
                            <span>{cvFileName}</span>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => { setCvUrl(null); setCvFileName(null); }}
                              data-testid="button-remove-cv"
                            >
                              {language === "fr" ? "Supprimer" : "Remove"}
                            </Button>
                          </div>
                        ) : isUploading ? (
                          <div className="flex items-center justify-center gap-2 text-muted-foreground">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>{language === "fr" ? "Upload en cours..." : "Uploading..."}</span>
                          </div>
                        ) : (
                          <label className="cursor-pointer">
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                              <Upload className="w-8 h-8" />
                              <span>{language === "fr" ? "Cliquez pour télécharger" : "Click to upload"}</span>
                              <span className="text-xs">{language === "fr" ? "PDF ou Word (max 10 Mo)" : "PDF or Word (max 10 MB)"}</span>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileUpload}
                              data-testid="input-cv-upload"
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="motivation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{language === "fr" ? "Motivation" : "Motivation"}</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder={language === "fr" 
                                ? "Pourquoi souhaitez-vous suivre cette formation ? Quels sont vos objectifs ?"
                                : "Why do you want to take this course? What are your goals?"}
                              className="min-h-[100px]"
                              {...field} 
                              data-testid="textarea-motivation"
                            />
                          </FormControl>
                          <FormDescription>
                            {language === "fr" 
                              ? "Décrivez brièvement vos objectifs et attentes"
                              : "Briefly describe your goals and expectations"}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={enrollMutation.isPending}
                      data-testid="button-submit-inscription"
                    >
                      {enrollMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {language === "fr" ? "Envoi en cours..." : "Submitting..."}
                        </>
                      ) : (
                        language === "fr" ? "Soumettre mon inscription" : "Submit my registration"
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      {language === "fr" 
                        ? "En soumettant ce formulaire, vous acceptez d'être contacté par notre équipe commerciale."
                        : "By submitting this form, you agree to be contacted by our sales team."}
                    </p>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
