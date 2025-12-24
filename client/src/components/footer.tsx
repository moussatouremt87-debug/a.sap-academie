import { Link } from "wouter";
import { MapPin, Phone, Mail, Linkedin, Twitter } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import logoImage from "@assets/image_1766486404362.png";

export function Footer() {
  const { t } = useI18n();
  
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
              {t("footer.description")}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">{t("footer.services")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/expertises" className="hover:text-foreground transition-colors">Conseil & Stratégie</Link></li>
              <li><Link href="/expertises" className="hover:text-foreground transition-colors">Transformation SI</Link></li>
              <li><Link href="/expertises" className="hover:text-foreground transition-colors">SAP Consulting</Link></li>
              <li><Link href="/formations" className="hover:text-foreground transition-colors">{t("nav.formations")}</Link></li>
              <li><Link href="/expertises" className="hover:text-foreground transition-colors">Business Services</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">{t("footer.resources")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/agent" className="hover:text-foreground transition-colors">{t("nav.contact")}</Link></li>
              <li><Link href="/faq" className="hover:text-foreground transition-colors">{t("nav.faq")}</Link></li>
              <li><Link href="/pourquoi-asap" className="hover:text-foreground transition-colors">{t("nav.whyAsap")}</Link></li>
              <li><Link href="/mentions-legales" className="hover:text-foreground transition-colors">{t("nav.legal")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">{t("footer.contact")}</h3>
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
          <p>&copy; {new Date().getFullYear()} A.SAP Consulting. {t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}
