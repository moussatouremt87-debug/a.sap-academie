import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Upload, FileText, FolderOpen, Share2, Trash2, MoreVertical, 
  Link2, Eye, Download, MessageSquare, Clock, Plus, X, Search,
  Users, Lock, Copy, Check, Calendar, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useTranslation } from "@/lib/i18n";
import { SEO, generateBreadcrumbSchema } from "@/components/seo";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import type { Document, DocumentFolder, DocumentShare } from "@shared/schema";

export default function Documents() {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: documents, isLoading: loadingDocs } = useQuery<Document[]>({
    queryKey: ["/api/documents"]
  });
  
  const { data: folders, isLoading: loadingFolders } = useQuery<DocumentFolder[]>({
    queryKey: ["/api/folders"]
  });
  
  const { data: sharedWithMe } = useQuery<Document[]>({
    queryKey: ["/api/shared-with-me"]
  });
  
  const createFolderMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await apiRequest("POST", "/api/folders", { name });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/folders"] });
      setFolderDialogOpen(false);
      setNewFolderName("");
      toast({ title: language === "fr" ? "Dossier créé" : "Folder created" });
    }
  });
  
  const deleteDocMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/documents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({ title: language === "fr" ? "Document supprimé" : "Document deleted" });
    }
  });
  
  const filteredDocs = documents?.filter(doc => {
    const matchesSearch = !searchQuery || 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolder === null || doc.folderId === selectedFolder;
    return matchesSearch && matchesFolder;
  }) || [];
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType === "application/pdf") return "pdf";
    if (mimeType.includes("word") || mimeType.includes("document")) return "doc";
    if (mimeType.includes("sheet") || mimeType.includes("excel")) return "spreadsheet";
    return "file";
  };
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: language === "fr" ? "Accueil" : "Home", url: "/" },
    { name: language === "fr" ? "Mes Documents" : "My Documents", url: "/documents" }
  ]);
  
  return (
    <>
      <SEO
        title={language === "fr" ? "Mes Documents | A.SAP" : "My Documents | A.SAP"}
        description={language === "fr" 
          ? "Gérez vos documents en toute sécurité. Partagez des fichiers avec contrôle d'accès."
          : "Manage your documents securely. Share files with access control."}
        schema={breadcrumbSchema}
      />
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">
                  {language === "fr" ? "Mes Documents" : "My Documents"}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {language === "fr" 
                    ? "Stockez et partagez vos documents en toute sécurité"
                    : "Store and share your documents securely"}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Dialog open={folderDialogOpen} onOpenChange={setFolderDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="default" data-testid="button-new-folder">
                      <FolderOpen className="h-4 w-4 mr-2" />
                      {language === "fr" ? "Nouveau dossier" : "New folder"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{language === "fr" ? "Créer un dossier" : "Create folder"}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <Label>{language === "fr" ? "Nom du dossier" : "Folder name"}</Label>
                      <Input
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        placeholder={language === "fr" ? "Mon dossier" : "My folder"}
                        data-testid="input-folder-name"
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={() => createFolderMutation.mutate(newFolderName)}
                        disabled={!newFolderName.trim() || createFolderMutation.isPending}
                        data-testid="button-create-folder"
                      >
                        {language === "fr" ? "Créer" : "Create"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Button className="bg-gold text-gold-foreground" data-testid="button-upload">
                  <Upload className="h-4 w-4 mr-2" />
                  {language === "fr" ? "Importer" : "Upload"}
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === "fr" ? "Rechercher des documents..." : "Search documents..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-documents"
              />
            </div>
            
            <Tabs defaultValue="my-docs" className="w-full">
              <TabsList>
                <TabsTrigger value="my-docs" data-testid="tab-my-docs">
                  <FileText className="h-4 w-4 mr-2" />
                  {language === "fr" ? "Mes documents" : "My documents"}
                </TabsTrigger>
                <TabsTrigger value="shared" data-testid="tab-shared">
                  <Users className="h-4 w-4 mr-2" />
                  {language === "fr" ? "Partagés avec moi" : "Shared with me"}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="my-docs" className="mt-6">
                <div className="flex gap-6">
                  <div className="w-48 flex-shrink-0 hidden lg:block">
                    <div className="space-y-1">
                      <Button
                        variant={selectedFolder === null ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setSelectedFolder(null)}
                        data-testid="button-all-files"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        {language === "fr" ? "Tous les fichiers" : "All files"}
                      </Button>
                      {loadingFolders ? (
                        <Skeleton className="h-9 w-full" />
                      ) : (
                        folders?.map(folder => (
                          <Button
                            key={folder.id}
                            variant={selectedFolder === folder.id ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => setSelectedFolder(folder.id)}
                            data-testid={`button-folder-${folder.id}`}
                          >
                            <FolderOpen className="h-4 w-4 mr-2" />
                            {folder.name}
                          </Button>
                        ))
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    {loadingDocs ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                          <Card key={i}>
                            <CardHeader>
                              <Skeleton className="h-5 w-3/4" />
                              <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent>
                              <Skeleton className="h-20 w-full" />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : filteredDocs.length === 0 ? (
                      <Card className="p-12 text-center">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          {language === "fr" ? "Aucun document" : "No documents"}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {language === "fr" 
                            ? "Importez votre premier document pour commencer"
                            : "Upload your first document to get started"}
                        </p>
                        <Button className="bg-gold text-gold-foreground">
                          <Upload className="h-4 w-4 mr-2" />
                          {language === "fr" ? "Importer un fichier" : "Upload a file"}
                        </Button>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredDocs.map(doc => (
                          <Card key={doc.id} className="group" data-testid={`card-document-${doc.id}`}>
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="p-2 bg-muted rounded-md flex-shrink-0">
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                  <div className="min-w-0">
                                    <CardTitle className="text-base truncate">{doc.name}</CardTitle>
                                    <CardDescription className="text-xs">
                                      {formatFileSize(doc.fileSize)} - {format(new Date(doc.createdAt), "d MMM yyyy", { locale: language === "fr" ? fr : enUS })}
                                    </CardDescription>
                                  </div>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="flex-shrink-0" data-testid={`button-menu-doc-${doc.id}`}>
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem data-testid={`button-view-doc-${doc.id}`}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      {language === "fr" ? "Voir" : "View"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem data-testid={`button-download-doc-${doc.id}`}>
                                      <Download className="h-4 w-4 mr-2" />
                                      {language === "fr" ? "Télécharger" : "Download"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => {
                                        setSelectedDocument(doc);
                                        setShareDialogOpen(true);
                                      }}
                                      data-testid={`button-share-doc-${doc.id}`}
                                    >
                                      <Share2 className="h-4 w-4 mr-2" />
                                      {language === "fr" ? "Partager" : "Share"}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      className="text-destructive"
                                      onClick={() => deleteDocMutation.mutate(doc.id)}
                                      data-testid={`button-delete-doc-${doc.id}`}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      {language === "fr" ? "Supprimer" : "Delete"}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </CardHeader>
                            {doc.description && (
                              <CardContent className="pt-0">
                                <p className="text-sm text-muted-foreground line-clamp-2">{doc.description}</p>
                              </CardContent>
                            )}
                            <CardContent className="pt-0">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {doc.isPublic ? (
                                  <Badge variant="secondary" className="gap-1">
                                    <Users className="h-3 w-3" />
                                    {language === "fr" ? "Public" : "Public"}
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="gap-1">
                                    <Lock className="h-3 w-3" />
                                    {language === "fr" ? "Privé" : "Private"}
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="shared" className="mt-6">
                {!sharedWithMe || sharedWithMe.length === 0 ? (
                  <Card className="p-12 text-center">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {language === "fr" ? "Aucun document partagé" : "No shared documents"}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === "fr" 
                        ? "Les documents partagés avec vous apparaîtront ici"
                        : "Documents shared with you will appear here"}
                    </p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {sharedWithMe.map((doc: any) => (
                      <Card key={doc.id} data-testid={`card-shared-doc-${doc.id}`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-muted rounded-md">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <CardTitle className="text-base">{doc.name}</CardTitle>
                              <CardDescription className="text-xs">
                                {formatFileSize(doc.fileSize)}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Badge variant="outline" className="gap-1">
                            {doc.permission === "edit" ? (
                              <>{language === "fr" ? "Peut modifier" : "Can edit"}</>
                            ) : doc.permission === "comment" ? (
                              <>{language === "fr" ? "Peut commenter" : "Can comment"}</>
                            ) : (
                              <>{language === "fr" ? "Lecture seule" : "View only"}</>
                            )}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        document={selectedDocument}
        language={language}
      />
    </>
  );
}

function ShareDialog({ 
  open, 
  onOpenChange, 
  document, 
  language 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  document: Document | null;
  language: string;
}) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("view");
  const [copied, setCopied] = useState(false);
  const [expiresIn, setExpiresIn] = useState("never");
  
  const { data: shares } = useQuery<DocumentShare[]>({
    queryKey: ["/api/documents", document?.id, "shares"],
    enabled: !!document
  });
  
  const createShareMutation = useMutation({
    mutationFn: async () => {
      let expiresAt = null;
      if (expiresIn === "1day") {
        expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      } else if (expiresIn === "7days") {
        expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      } else if (expiresIn === "30days") {
        expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      }
      
      const res = await apiRequest("POST", `/api/documents/${document?.id}/shares`, {
        sharedWithEmail: email || null,
        permission,
        expiresAt,
        isActive: true
      });
      return res.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents", document?.id, "shares"] });
      setEmail("");
      
      const shareUrl = `${window.location.origin}/shared/${data.shareToken}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({ 
        title: language === "fr" ? "Lien copié!" : "Link copied!",
        description: language === "fr" ? "Le lien de partage a été copié" : "Share link has been copied"
      });
    }
  });
  
  const revokeShareMutation = useMutation({
    mutationFn: async (shareId: number) => {
      await apiRequest("DELETE", `/api/shares/${shareId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents", document?.id, "shares"] });
      toast({ title: language === "fr" ? "Accès révoqué" : "Access revoked" });
    }
  });
  
  if (!document) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            {language === "fr" ? "Partager le document" : "Share document"}
          </DialogTitle>
          <DialogDescription>{document.name}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{language === "fr" ? "Partager avec (optionnel)" : "Share with (optional)"}</Label>
            <Input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="input-share-email"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{language === "fr" ? "Permission" : "Permission"}</Label>
              <Select value={permission} onValueChange={setPermission}>
                <SelectTrigger data-testid="select-permission">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">{language === "fr" ? "Lecture" : "View"}</SelectItem>
                  <SelectItem value="comment">{language === "fr" ? "Commenter" : "Comment"}</SelectItem>
                  <SelectItem value="edit">{language === "fr" ? "Modifier" : "Edit"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>{language === "fr" ? "Expiration" : "Expires"}</Label>
              <Select value={expiresIn} onValueChange={setExpiresIn}>
                <SelectTrigger data-testid="select-expires">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">{language === "fr" ? "Jamais" : "Never"}</SelectItem>
                  <SelectItem value="1day">{language === "fr" ? "1 jour" : "1 day"}</SelectItem>
                  <SelectItem value="7days">{language === "fr" ? "7 jours" : "7 days"}</SelectItem>
                  <SelectItem value="30days">{language === "fr" ? "30 jours" : "30 days"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            className="w-full bg-gold text-gold-foreground" 
            onClick={() => createShareMutation.mutate()}
            disabled={createShareMutation.isPending}
            data-testid="button-create-share"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                {language === "fr" ? "Lien copié!" : "Link copied!"}
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4 mr-2" />
                {language === "fr" ? "Générer un lien de partage" : "Generate share link"}
              </>
            )}
          </Button>
          
          {shares && shares.length > 0 && (
            <div className="border-t pt-4 mt-4">
              <Label className="text-sm font-medium mb-2 block">
                {language === "fr" ? "Liens actifs" : "Active links"}
              </Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {shares.filter(s => s.isActive).map(share => (
                  <div key={share.id} className="flex items-center justify-between p-2 bg-muted rounded-md text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <Link2 className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      <span className="truncate">
                        {share.sharedWithEmail || (language === "fr" ? "Lien public" : "Public link")}
                      </span>
                      <Badge variant="outline" className="flex-shrink-0">
                        {share.permission}
                      </Badge>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => revokeShareMutation.mutate(share.id)}
                      data-testid={`button-revoke-share-${share.id}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
