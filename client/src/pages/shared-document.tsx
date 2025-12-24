import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { FileText, Download, Lock, AlertCircle, Clock, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { SEO } from "@/components/seo";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SharedDocumentData {
  document: {
    id: number;
    name: string;
    description?: string;
    mimeType: string;
    fileSize: number;
  };
  permission: string;
  hasPassword: boolean;
}

export default function SharedDocument() {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  
  const { data, isLoading, error } = useQuery<SharedDocumentData>({
    queryKey: ["/api/shared", token],
    enabled: !!token,
    retry: false
  });
  
  const verifyPasswordMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/shared/${token}/verify`, { password });
      return res.json();
    },
    onSuccess: () => {
      setPasswordVerified(true);
      setPasswordError("");
    },
    onError: () => {
      setPasswordError("Mot de passe incorrect");
    }
  });
  
  const [downloading, setDownloading] = useState(false);
  
  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(`/api/shared/${token}/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include"
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur de téléchargement");
      }
      
      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get("Content-Disposition");
      let fileName = data?.document.name || "document";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) fileName = decodeURIComponent(match[1]);
      }
      
      // Create blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Téléchargement terminé",
        description: fileName
      });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message.includes("401") ? "Mot de passe requis" : err.message,
        variant: "destructive"
      });
    } finally {
      setDownloading(false);
    }
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" data-testid="loading-shared-doc">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
    const errorMessage = (error as Error).message;
    const isExpired = errorMessage.includes("410") || errorMessage.includes("expiré");
    
    return (
      <>
        <SEO title="Lien invalide | A.SAP" noIndex />
        <div className="min-h-screen bg-background flex items-center justify-center p-4" data-testid="error-shared-doc">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="mx-auto mb-4 p-3 bg-destructive/10 rounded-full w-fit">
                {isExpired ? (
                  <Clock className="h-8 w-8 text-destructive" />
                ) : (
                  <AlertCircle className="h-8 w-8 text-destructive" />
                )}
              </div>
              <CardTitle data-testid="text-error-title">
                {isExpired ? "Lien expiré" : "Lien invalide"}
              </CardTitle>
              <CardDescription data-testid="text-error-description">
                {isExpired 
                  ? "Ce lien de partage a expiré ou a atteint sa limite de téléchargements."
                  : "Ce lien de partage n'existe pas ou a été révoqué."}
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
              <Button variant="outline" onClick={() => window.location.href = "/"} data-testid="button-back-home">
                Retour à l'accueil
              </Button>
            </CardFooter>
          </Card>
        </div>
      </>
    );
  }
  
  if (!data) return null;
  
  if (data.hasPassword && !passwordVerified) {
    return (
      <>
        <SEO title="Document protégé | A.SAP" noIndex />
        <div className="min-h-screen bg-background flex items-center justify-center p-4" data-testid="password-required">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-muted rounded-full w-fit">
                <Lock className="h-8 w-8 text-muted-foreground" />
              </div>
              <CardTitle data-testid="text-protected-title">Document protégé</CardTitle>
              <CardDescription>
                Ce document est protégé par un mot de passe.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Mot de passe</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Entrez le mot de passe"
                  data-testid="input-share-password"
                />
                {passwordError && (
                  <p className="text-sm text-destructive" data-testid="text-password-error">{passwordError}</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-gold text-gold-foreground"
                onClick={() => verifyPasswordMutation.mutate()}
                disabled={!password.trim() || verifyPasswordMutation.isPending}
                data-testid="button-submit-password"
              >
                {verifyPasswordMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Accéder au document
              </Button>
            </CardFooter>
          </Card>
        </div>
      </>
    );
  }
  
  return (
    <>
      <SEO title={`${data.document.name} | A.SAP`} noIndex />
      <div className="min-h-screen bg-background flex items-center justify-center p-4" data-testid="shared-doc-view">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 bg-muted rounded-full w-fit">
              <FileText className="h-10 w-10 text-muted-foreground" />
            </div>
            <CardTitle className="text-xl" data-testid="text-doc-name">{data.document.name}</CardTitle>
            <CardDescription data-testid="text-doc-meta">
              {formatFileSize(data.document.fileSize)} - {data.document.mimeType}
            </CardDescription>
          </CardHeader>
          
          {data.document.description && (
            <CardContent>
              <p className="text-sm text-muted-foreground text-center" data-testid="text-doc-description">
                {data.document.description}
              </p>
            </CardContent>
          )}
          
          <CardContent className="pt-0">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span data-testid="text-permission">
                {data.permission === "edit" 
                  ? "Vous pouvez modifier ce document"
                  : data.permission === "comment"
                  ? "Vous pouvez commenter ce document"
                  : "Vous pouvez consulter ce document"}
              </span>
            </div>
            
            <Button 
              className="w-full bg-gold text-gold-foreground" 
              onClick={handleDownload}
              disabled={downloading}
              data-testid="button-download-shared"
            >
              {downloading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Télécharger le document
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
