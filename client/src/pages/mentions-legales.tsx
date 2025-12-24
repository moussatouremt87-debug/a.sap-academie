import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, Mail, Phone } from "lucide-react";

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <Shield className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-legal-title">
            Mentions Légales & Protection des Données
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Votre confiance est notre priorité. Découvrez comment nous protégeons vos données.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Database className="h-6 w-6 text-primary" />
                Informations Légales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Raison Sociale</h3>
                <p>A.SAP SARL (Académie Internationale SAP)</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Forme Juridique</h3>
                <p>Société à Responsabilité Limitée (SARL) - OHADA</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Capital Social</h3>
                <p>1 000 000 Francs CFA</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Siège Social</h3>
                <p>SICAP Liberté 2, Villa N°1690<br />Dakar, Sénégal</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Co-gérantes</h3>
                <p>Mme SALL Mame Marieme & Mme SYLLA Khadidiatou</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Activité</h3>
                <p>Ingénierie informatique, conseil en transformation digitale, intégration SAP, formation professionnelle, tierce maintenance applicative</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Hébergement</h3>
                <p>Ce site est hébergé par Replit, Inc. - San Francisco, CA, USA</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Lock className="h-6 w-6 text-primary" />
                Protection des Données Personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi sénégalaise 
                n°2008-12 du 25 janvier 2008 sur la protection des données personnelles, nous nous engageons 
                à protéger vos informations.
              </p>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Données Collectées</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Nom et prénom</li>
                  <li>Adresse email professionnelle</li>
                  <li>Numéro de téléphone</li>
                  <li>Nom de l'entreprise</li>
                  <li>Informations de connexion (pour le CRM)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Finalité du Traitement</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Réponse à vos demandes de contact</li>
                  <li>Prise de rendez-vous et suivi commercial</li>
                  <li>Envoi d'informations sur nos services (avec votre consentement)</li>
                  <li>Gestion de la relation client</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                Mesures de Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>Nous mettons en œuvre les mesures techniques et organisationnelles suivantes :</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground">Chiffrement SSL/TLS</h4>
                    <p className="text-sm">Toutes les communications sont chiffrées</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground">Authentification Sécurisée</h4>
                    <p className="text-sm">Accès CRM protégé par Replit Auth</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Database className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground">Base de Données Sécurisée</h4>
                    <p className="text-sm">PostgreSQL avec accès restreint</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Eye className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground">Accès Contrôlé</h4>
                    <p className="text-sm">Seuls les utilisateurs autorisés accèdent aux données</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Eye className="h-6 w-6 text-primary" />
                Vos Droits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>Conformément à la réglementation, vous disposez des droits suivants :</p>
              
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Droit d'accès :</strong> Obtenir une copie de vos données personnelles</li>
                <li><strong>Droit de rectification :</strong> Corriger vos données inexactes</li>
                <li><strong>Droit à l'effacement :</strong> Demander la suppression de vos données</li>
                <li><strong>Droit d'opposition :</strong> Vous opposer au traitement de vos données</li>
                <li><strong>Droit à la portabilité :</strong> Recevoir vos données dans un format structuré</li>
                <li><strong>Droit de retrait du consentement :</strong> Retirer votre consentement à tout moment</li>
              </ul>

              <p className="text-sm">
                Pour exercer ces droits, contactez-nous à l'adresse indiquée ci-dessous.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Database className="h-6 w-6 text-primary" />
                Conservation des Données
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Vos données personnelles sont conservées pendant la durée nécessaire à la réalisation 
                des finalités pour lesquelles elles ont été collectées :
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Données de contact : 3 ans après le dernier contact</li>
                <li>Données clients : durée de la relation commerciale + 5 ans</li>
                <li>Données de connexion : 1 an</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Mail className="h-6 w-6 text-primary" />
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Pour toute question concernant la protection de vos données personnelles 
                ou pour exercer vos droits, contactez-nous :
              </p>
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gold" />
                  <a href="mailto:contact@asap-academie.sn" className="text-primary hover:underline">
                    contact@asap-academie.sn
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gold" />
                  <span>+221 77 000 00 00</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground pt-8 border-t">
            <p>Dernière mise à jour : Décembre 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
}
