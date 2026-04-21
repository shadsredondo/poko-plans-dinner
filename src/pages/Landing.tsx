import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Citrus, Soup, Salad, Wine, Flame, Sparkles } from "lucide-react";
import PokoAvatar from "@/components/PokoAvatar";
import AccountMenu from "@/components/AccountMenu";
import heroImage from "@/assets/hero-poko.jpg";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Decorative background food elements */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-citrus-soft/60 blur-3xl opacity-70" />
        <div className="absolute top-[40%] -left-32 w-[24rem] h-[24rem] rounded-full bg-sage-soft/70 blur-3xl opacity-60" />
        <div className="absolute bottom-0 right-1/4 w-[20rem] h-[20rem] rounded-full bg-berry-soft/50 blur-3xl opacity-60" />
        <Citrus className="absolute top-[12%] right-[8%] w-10 h-10 text-citrus/40 rotate-12" strokeWidth={1.25} />
        <Salad className="absolute top-[55%] left-[6%] w-9 h-9 text-primary/40 -rotate-12" strokeWidth={1.25} />
        <Wine className="absolute bottom-[18%] right-[12%] w-9 h-9 text-berry/40" strokeWidth={1.25} />
      </div>

      <header className="relative flex items-center justify-between px-6 md:px-10 py-5 sticky top-0 z-20 bg-background/70 backdrop-blur-md">
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

      <main className="flex-1 relative">
        <section className="relative px-6 md:px-10 pt-8 md:pt-16 pb-20 md:pb-28">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Headline column */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 space-y-10"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-cream-warm/80 backdrop-blur-sm border border-border/40 px-4 py-1.5 shadow-[0_4px_20px_-8px_hsl(var(--shadow-warm)/0.15)]">
                <Sparkles className="w-3 h-3 text-citrus" strokeWidth={2} />
                <p className="text-[10px] uppercase tracking-[0.32em] text-foreground/70">
                  Your hosting little secret
                </p>
              </div>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-normal text-foreground leading-[1.02] tracking-tight">
                Tonight&rsquo;s dinner,
                <br />
                <span className="italic text-primary">already</span> under control.
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
                Tell Poko who&rsquo;s coming and what&rsquo;s in the fridge. We&rsquo;ll spin a menu,
                a shopping list and a calm timeline — so you can pour the wine, not panic.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-2">
                <button
                  onClick={() => navigate("/new")}
                  className="group inline-flex items-center gap-3 rounded-full bg-foreground text-background px-8 py-4 text-xs uppercase tracking-[0.22em] hover:bg-primary transition-all duration-300 shadow-[0_10px_30px_-12px_hsl(var(--shadow-warm)/0.45)] hover:shadow-[0_14px_36px_-10px_hsl(var(--primary)/0.45)] hover:-translate-y-0.5"
                >
                  Plan tonight&rsquo;s dinner
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
                <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  Free · ready in 2 min
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
              <div className="relative overflow-hidden aspect-[16/10] bg-muted rounded-[28px] shadow-[0_30px_80px_-30px_hsl(var(--shadow-warm)/0.35)] ring-1 ring-border/50">
                <img
                  src={heroImage}
                  alt="A calm modern kitchen with a relaxed host preparing dinner, with subtle Poko interface cards floating in the scene."
                  className="w-full h-full object-cover"
                  width={1376}
                  height={768}
                />
                {/* Floating menu card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="absolute bottom-5 left-5 md:bottom-7 md:left-7 bg-cream/95 backdrop-blur-md rounded-2xl p-4 md:p-5 shadow-[0_20px_50px_-20px_hsl(var(--shadow-warm)/0.5)] border border-border/40 max-w-[240px]"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="w-3.5 h-3.5 text-accent" strokeWidth={2} />
                    <p className="text-[9px] uppercase tracking-[0.28em] text-muted-foreground">Tonight · 7:30</p>
                  </div>
                  <p className="font-display text-base text-foreground leading-snug">
                    Burrata, fig &amp; basil — then risotto.
                  </p>
                </motion.div>
              </div>
              <div className="hidden md:flex items-center justify-between mt-5 text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                <span className="flex items-center gap-2"><Flame className="w-3 h-3 text-accent" strokeWidth={2} />Menu · 7:30 PM</span>
                <span>Burrata · Risotto · Tart</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quiet value props */}
        <section className="relative px-6 md:px-10 py-20 md:py-28">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14 md:mb-20 space-y-4">
              <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">How Poko helps</p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground leading-[1.05]">
                The quiet bits, <span className="italic text-accent">handled</span>.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Soup,
                accent: "text-primary",
                bg: "bg-sage-soft/60",
                kicker: "Menu",
                title: "A considered plan",
                body: "Three or four courses, balanced for your guests, your pantry and the hour you have — never the same twice.",
              },
              {
                icon: Salad,
                accent: "text-accent",
                bg: "bg-terracotta-soft/70",
                kicker: "Pantry",
                title: "Less waste, more wow",
                body: "Poko reaches for what you already own first, then quietly nudges you to grab only what's truly missing.",
              },
              {
                icon: Flame,
                accent: "text-berry",
                bg: "bg-berry-soft/60",
                kicker: "Timing",
                title: "A calm timeline",
                body: "Gentle reminders, sequenced perfectly — so nothing burns, nothing waits, and you stay in the conversation.",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.kicker}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  className="group bg-cream rounded-3xl p-8 md:p-10 space-y-5 border border-border/40 shadow-[0_12px_40px_-20px_hsl(var(--shadow-warm)/0.25)] hover:shadow-[0_20px_50px_-20px_hsl(var(--shadow-warm)/0.4)] hover:-translate-y-1 transition-all duration-500"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${item.bg}`}>
                    <Icon className={`w-5 h-5 ${item.accent}`} strokeWidth={1.5} />
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                    {item.kicker}
                  </p>
                  <h3 className="font-display text-2xl md:text-3xl text-foreground leading-[1.1]">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {item.body}
                  </p>
                </motion.div>
              );
            })}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="relative px-6 md:px-10 py-24 md:py-32">
          <div className="max-w-3xl mx-auto relative">
            <div className="relative bg-gradient-to-br from-cream-warm via-cream to-sage-soft/40 rounded-[36px] p-12 md:p-20 text-center border border-border/40 shadow-[0_30px_80px_-30px_hsl(var(--shadow-warm)/0.35)] overflow-hidden">
              {/* Decorative icons */}
              <Citrus className="absolute top-8 left-8 w-8 h-8 text-citrus/50 -rotate-12" strokeWidth={1.25} />
              <Wine className="absolute bottom-10 right-10 w-8 h-8 text-berry/50 rotate-6" strokeWidth={1.25} />
              <Salad className="absolute top-12 right-12 w-7 h-7 text-primary/40 rotate-12" strokeWidth={1.25} />

              <div className="relative space-y-8">
                <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                  Pour the wine
                </p>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground leading-[1.05]">
                  Who&rsquo;s coming <span className="italic text-accent">over</span>?
                </h2>
                <p className="text-base text-muted-foreground max-w-md mx-auto">
                  Two minutes to plan. The whole evening to enjoy.
                </p>
                <button
                  onClick={() => navigate("/new")}
                  className="group inline-flex items-center gap-3 rounded-full bg-foreground text-background px-10 py-4 text-xs uppercase tracking-[0.22em] hover:bg-primary transition-all duration-300 shadow-[0_14px_36px_-12px_hsl(var(--shadow-warm)/0.5)] hover:-translate-y-0.5"
                >
                  Plan an evening
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative px-6 md:px-10 py-8 border-t border-border/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
          <span className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-citrus" strokeWidth={2} />Poko</span>
          <span>Made for people who love hosting</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
