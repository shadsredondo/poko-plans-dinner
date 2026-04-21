import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PokoAvatar from "@/components/PokoAvatar";
import AccountMenu from "@/components/AccountMenu";
import heroImage from "@/assets/hero-poko.jpg";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-between px-6 md:px-10 py-5 sticky top-0 z-20 bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <PokoAvatar size="sm" animate={false} />
          <span className="font-display text-lg tracking-tight text-foreground">Poko</span>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/new")}
            className="hidden sm:inline-flex text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground transition-colors"
          >
            Plan a dinner
          </button>
          <AccountMenu />
        </div>
      </header>

      <main className="flex-1">
        <section className="relative px-6 md:px-10 pt-8 md:pt-16 pb-20 md:pb-28">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Headline column */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 space-y-10"
            >
              <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                A hosting companion
              </p>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-normal text-foreground leading-[1.02] tracking-tight">
                Tonight&rsquo;s dinner,
                <br />
                <span className="italic text-primary">already</span> under control.
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
                Poko quietly orchestrates your menu, pantry and timing — so the only thing
                left to do is welcome your guests.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-2">
                <button
                  onClick={() => navigate("/new")}
                  className="group inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 text-xs uppercase tracking-[0.22em] hover:bg-primary transition-colors duration-300"
                >
                  Plan tonight&rsquo;s dinner
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
                <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  Free · 2 minutes
                </span>
              </div>
            </motion.div>

            {/* Hero image column */}
            <motion.div
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7 relative"
            >
              <div className="relative overflow-hidden aspect-[16/10] bg-muted">
                <img
                  src={heroImage}
                  alt="A calm modern kitchen with a relaxed host preparing dinner, with subtle Poko interface cards floating in the scene."
                  className="w-full h-full object-cover"
                  width={1376}
                  height={768}
                />
              </div>
              <div className="hidden md:flex items-center justify-between mt-5 text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                <span>Menu · 7:30 PM</span>
                <span>Burrata · Risotto · Tart</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quiet value props */}
        <section className="px-6 md:px-10 py-20 md:py-28 border-t border-border/60">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {[
              {
                kicker: "Menu",
                title: "A considered plan",
                body: "Three or four courses, balanced for your guests, your pantry and the hour you have.",
              },
              {
                kicker: "Pantry",
                title: "Less waste, less spend",
                body: "Poko reaches for what you already own first, then suggests only what's truly missing.",
              },
              {
                kicker: "Timing",
                title: "A calm timeline",
                body: "Gentle reminders, sequenced perfectly — so nothing burns and nothing waits.",
              },
            ].map((item) => (
              <div key={item.kicker} className="bg-background p-10 md:p-12 space-y-5">
                <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                  {item.kicker}
                </p>
                <h3 className="font-display text-2xl md:text-3xl text-foreground leading-[1.1]">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="px-6 md:px-10 py-24 md:py-32 text-center">
          <div className="max-w-2xl mx-auto space-y-10">
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              Begin
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground leading-[1.05]">
              Who&rsquo;s coming over?
            </h2>
            <button
              onClick={() => navigate("/new")}
              className="group inline-flex items-center gap-3 border border-foreground/80 text-foreground px-10 py-4 text-xs uppercase tracking-[0.22em] hover:bg-foreground hover:text-background transition-colors duration-300"
            >
              Plan an evening
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </section>
      </main>

      <footer className="px-6 md:px-10 py-8 border-t border-border/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
          <span>Poko</span>
          <span>A quieter way to host</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
