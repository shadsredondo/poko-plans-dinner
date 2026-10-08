import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { signInWithGoogle } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

// Google Identity Services popup. Unlike the Supabase redirect, Google's
// consent screen shows this site's domain instead of the Supabase project URL,
// and the user never leaves the page.

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
const GSI_SRC = "https://accounts.google.com/gsi/client";

type GoogleId = {
  initialize: (config: Record<string, unknown>) => void;
  renderButton: (el: HTMLElement, options: Record<string, unknown>) => void;
};
declare global {
  interface Window {
    google?: { accounts: { id: GoogleId } };
  }
}

let gsiPromise: Promise<void> | null = null;
const loadGsi = () => {
  gsiPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = GSI_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      gsiPromise = null;
      reject(new Error("Google sign-in failed to load"));
    };
    document.head.appendChild(script);
  });
  return gsiPromise;
};

// Google gets the SHA-256 of the nonce; Supabase gets the raw value to compare.
const makeNonce = async () => {
  const raw = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  const hashed = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return { raw, hashed };
};

interface GoogleSignInButtonProps {
  // Used only by the redirect fallback.
  redirectPath?: string;
  onBeforeRedirect?: () => void;
}

const GoogleSignInButton = ({ redirectPath = "/", onBeforeRedirect }: GoogleSignInButtonProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(!GOOGLE_CLIENT_ID);
  const { toast } = useToast();

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    let cancelled = false;

    (async () => {
      try {
        await loadGsi();
        const { raw, hashed } = await makeNonce();
        const el = containerRef.current;
        if (cancelled || !el || !window.google) return;

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          nonce: hashed,
          use_fedcm_for_button: true,
          callback: async ({ credential }: { credential: string }) => {
            const { error } = await supabase.auth.signInWithIdToken({
              provider: "google",
              token: credential,
              nonce: raw,
            });
            if (error) {
              toast({ title: "Something went wrong", description: error.message, variant: "destructive" });
            }
          },
        });
        window.google.accounts.id.renderButton(el, {
          type: "standard",
          theme: "outline",
          size: "large",
          shape: "pill",
          text: "continue_with",
          logo_alignment: "center",
          width: Math.min(el.offsetWidth || 320, 400),
        });
      } catch {
        if (!cancelled) setFallback(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [toast]);

  if (fallback) {
    return (
      <button
        type="button"
        onClick={async () => {
          onBeforeRedirect?.();
          const { error } = await signInWithGoogle(redirectPath);
          if (error) {
            toast({ title: "Something went wrong", description: error.message, variant: "destructive" });
          }
        }}
        className="w-full rounded-xl h-11 border border-input bg-background text-sm font-semibold hover:bg-accent transition-colors"
      >
        Continue with Google
      </button>
    );
  }

  return <div ref={containerRef} className="w-full flex justify-center min-h-[44px]" />;
};

export default GoogleSignInButton;
