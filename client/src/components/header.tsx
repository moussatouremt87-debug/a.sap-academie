import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Sparkles, Home, Compass, GraduationCap, HelpCircle, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/agent", label: "Agent IA", icon: Sparkles },
  { href: "/expertises", label: "Expertises", icon: Compass },
  { href: "/formations", label: "Formations", icon: GraduationCap },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/pourquoi-asap", label: "Pourquoi A.SAP", icon: Award },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2" data-testid="link-home">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
            <span className="text-lg font-bold text-primary-foreground">A</span>
          </div>
          <span className="text-xl font-bold tracking-tight">
            A.<span className="text-primary">SAP</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={location === item.href ? "secondary" : "ghost"}
                size="sm"
                className="text-sm"
                data-testid={`link-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/agent" className="hidden sm:block">
            <Button className="bg-gold text-gold-foreground" data-testid="button-cta-agent">
              <Sparkles className="mr-2 h-4 w-4" />
              Parler à l'Agent IA
            </Button>
          </Link>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            data-testid="button-mobile-menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t bg-background md:hidden">
          <nav className="container mx-auto flex flex-col gap-1 px-4 py-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={location === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start gap-3"
                  onClick={() => setIsOpen(false)}
                  data-testid={`link-mobile-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
            <Link href="/agent">
              <Button
                className="mt-2 w-full bg-gold text-gold-foreground"
                onClick={() => setIsOpen(false)}
                data-testid="button-mobile-agent"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Parler à l'Agent IA
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
