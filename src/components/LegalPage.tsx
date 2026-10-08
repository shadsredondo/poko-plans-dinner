import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import PokoAvatar from "@/components/PokoAvatar";

export const CONTACT_EMAIL = "shraddhagadoo@gmail.com";

interface LegalPageProps {
  title: string;
  updated: string;
  children: ReactNode;
}

export const LegalSection = ({ heading, children }: { heading: string; children: ReactNode }) => (
  <section className="space-y-3">
    <h2 className="font-display text-2xl text-foreground leading-tight">{heading}</h2>
    <div className="space-y-3 text-[15px] leading-relaxed text-muted-foreground">{children}</div>
  </section>
);

const LegalPage = ({ title, updated, children }: LegalPageProps) => (
  <div className="min-h-screen bg-background flex flex-col">
    <header className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-border/40">
      <Link to="/" className="flex items-center gap-3">
        <PokoAvatar size="sm" animate={false} />
        <span className="font-display text-lg tracking-tight text-foreground">Poko</span>
      </Link>
      <Link
        to="/new"
        className="text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground transition-colors"
      >
        Plan a dinner
      </Link>
    </header>

    <main className="flex-1 px-6 md:px-10 py-12 md:py-16">
      <article className="max-w-2xl mx-auto space-y-10">
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Last updated {updated}</p>
          <h1 className="font-display text-4xl md:text-5xl text-foreground leading-[1.05] tracking-tight">{title}</h1>
        </div>
        {children}
        <p className="text-[15px] text-muted-foreground">
          Questions? Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline underline-offset-4">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </article>
    </main>

    <LegalFooter />
  </div>
);

export const LegalFooter = () => (
  <footer className="px-6 md:px-10 py-8 border-t border-border/40">
    <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
      <span>Poko</span>
      <nav className="flex gap-6">
        <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
        <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
      </nav>
    </div>
  </footer>
);

export default LegalPage;
