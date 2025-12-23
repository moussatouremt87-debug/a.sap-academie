import { Link } from "wouter";
import { MapPin, Phone, Mail, Linkedin, Twitter } from "lucide-react";
import logoImage from "@assets/image_1766486404362.png";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img 
                src={logoImage} 
                alt="A.SAP Consulting" 
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-muted-foreground">
              Cabinet de conseil en transformation digitale, SAP et formation.
              Votre partenaire pour la modernisation de vos systèmes d'information.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/expertises" className="hover:text-foreground transition-colors">Conseil & Stratégie</Link></li>
              <li><Link href="/expertises" className="hover:text-foreground transition-colors">Transformation SI</Link></li>
              <li><Link href="/expertises" className="hover:text-foreground transition-colors">SAP Consulting</Link></li>
              <li><Link href="/formations" className="hover:text-foreground transition-colors">Formations SAP</Link></li>
              <li><Link href="/expertises" className="hover:text-foreground transition-colors">Business Services</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Ressources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/agent" className="hover:text-foreground transition-colors">Contact Commercial</Link></li>
              <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link href="/pourquoi-asap" className="hover:text-foreground transition-colors">Pourquoi A.SAP</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>Dakar, Sénégal</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+221 XX XXX XX XX</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>contact@asap.sn</span>
              </li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} A.SAP Consulting. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
