import { motion, useReducedMotion } from "framer-motion";
import { ChefHat, Sparkles } from "lucide-react";
import PokoAvatar from "@/components/PokoAvatar";

const CookingLoader = () => {
  const reduceMotion = useReducedMotion();
  const repeat = reduceMotion ? 0 : Infinity;

  return (
    <div
      className="w-full max-w-sm text-center"
      role="status"
      aria-live="polite"
      aria-label="Poko is cooking up your menu"
    >
      <div className="relative mx-auto h-[250px] w-full overflow-hidden rounded-[2rem] border border-border/60 bg-gradient-to-b from-cream via-cream-warm/60 to-sage-soft/35 shadow-[0_28px_70px_-36px_hsl(var(--shadow-warm)/0.55)]">
        <div aria-hidden className="absolute inset-0">
          <div className="absolute -left-10 top-4 h-28 w-28 rounded-full bg-citrus-soft/50 blur-2xl" />
          <div className="absolute -right-10 bottom-0 h-32 w-32 rounded-full bg-berry-soft/60 blur-2xl" />
          <Sparkles className="absolute right-7 top-7 h-5 w-5 text-citrus/70" strokeWidth={1.5} />
        </div>

        <motion.div
          className="absolute left-1/2 top-5 z-10 -translate-x-1/2"
          animate={reduceMotion ? undefined : { y: [0, -4, 0], rotate: [-1, 1, -1] }}
          transition={{ duration: 2.2, repeat, ease: "easeInOut" }}
        >
          <PokoAvatar size="xl" animate={false} />
          <motion.span
            aria-hidden
            className="absolute -right-3 -top-2 flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card text-primary shadow-md"
            animate={reduceMotion ? undefined : { rotate: [-8, 8, -8] }}
            transition={{ duration: 1.8, repeat, ease: "easeInOut" }}
          >
            <ChefHat className="h-5 w-5" strokeWidth={1.6} />
          </motion.span>
        </motion.div>

        <svg
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[165px] w-full"
          viewBox="0 0 320 165"
          fill="none"
        >
          <motion.g
            animate={reduceMotion ? undefined : { rotate: [-1.5, 1.5, -1.5], y: [0, 2, 0] }}
            transition={{ duration: 1.25, repeat, ease: "easeInOut" }}
            style={{ transformOrigin: "160px 132px" }}
          >
            <path d="M89 105C95 139 119 153 159 153C199 153 223 139 231 105H89Z" fill="hsl(var(--foreground))" />
            <path d="M96 108C108 126 129 135 160 135C191 135 211 126 224 108" stroke="hsl(var(--cream))" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
            <path d="M227 111L282 92" stroke="hsl(var(--foreground))" strokeWidth="12" strokeLinecap="round" />
            <path d="M279 92L293 87" stroke="hsl(var(--primary))" strokeWidth="8" strokeLinecap="round" />
          </motion.g>

          <motion.g
            animate={reduceMotion ? undefined : { x: [0, -17, 3, 0], y: [0, -54, -10, 0], rotate: [0, 190, 330, 360] }}
            transition={{ duration: 1.7, repeat, ease: "easeInOut", times: [0, 0.42, 0.82, 1] }}
            style={{ transformOrigin: "135px 102px" }}
          >
            <circle cx="135" cy="102" r="8" fill="hsl(var(--berry))" />
            <path d="M135 94L140 89" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
          </motion.g>

          <motion.g
            animate={reduceMotion ? undefined : { x: [0, 20, -4, 0], y: [0, -69, -14, 0], rotate: [0, -160, -310, -360] }}
            transition={{ duration: 1.9, delay: 0.12, repeat, ease: "easeInOut", times: [0, 0.44, 0.82, 1] }}
            style={{ transformOrigin: "176px 107px" }}
          >
            <rect x="169" y="100" width="14" height="14" rx="4" fill="hsl(var(--citrus))" />
          </motion.g>

          <motion.g
            animate={reduceMotion ? undefined : { x: [0, 7, -10, 0], y: [0, -47, -7, 0], rotate: [0, 120, 260, 360] }}
            transition={{ duration: 1.55, delay: 0.3, repeat, ease: "easeInOut", times: [0, 0.4, 0.8, 1] }}
            style={{ transformOrigin: "199px 109px" }}
          >
            <path d="M192 109C194 99 202 96 210 99C208 108 202 114 192 109Z" fill="hsl(var(--primary))" />
            <path d="M194 108L207 101" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" strokeLinecap="round" opacity="0.65" />
          </motion.g>

          <motion.circle
            cx="154"
            cy="108"
            r="5"
            fill="hsl(var(--primary))"
            animate={reduceMotion ? undefined : { x: [0, -5, 12, 0], y: [0, -39, -8, 0] }}
            transition={{ duration: 1.45, delay: 0.5, repeat, ease: "easeInOut", times: [0, 0.42, 0.82, 1] }}
          />

          {[0, 1, 2].map((index) => (
            <motion.path
              key={index}
              d={`M${139 + index * 20} ${92 - index * 3}C${130 + index * 20} ${79 - index * 3} ${150 + index * 20} ${67 - index * 3} ${141 + index * 20} ${54 - index * 3}`}
              stroke="hsl(var(--foreground))"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.25"
              animate={reduceMotion ? undefined : { opacity: [0, 0.35, 0], y: [8, 0, -8] }}
              transition={{ duration: 1.8, delay: index * 0.3, repeat, ease: "easeOut" }}
            />
          ))}
        </svg>
      </div>

      <div className="mt-7 space-y-2">
        <p className="text-[10px] uppercase tracking-[0.32em] text-primary">Poko is cooking</p>
        <p className="font-display text-2xl text-foreground">Your evening is taking shape.</p>
        <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground">
          Balancing flavors, using your pantry and timing every dish.
        </p>
        <div aria-hidden className="flex items-center justify-center gap-1.5 pt-2">
          {[0, 1, 2].map((index) => (
            <motion.span
              key={index}
              className="h-1.5 w-1.5 rounded-full bg-primary"
              animate={reduceMotion ? undefined : { opacity: [0.25, 1, 0.25], scale: [0.8, 1.15, 0.8] }}
              transition={{ duration: 1.2, delay: index * 0.18, repeat, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CookingLoader;
