import { supabase } from "@/integrations/supabase/client";

// Sign in with Google through Supabase directly (works on any host, e.g. Vercel).
// The Lovable OAuth broker only works on Lovable-hosted domains.
export const signInWithGoogle = (redirectPath = "/") =>
  supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}${redirectPath}` },
  });

// A menu the user asked to save before signing in; survives the OAuth redirect.
export const PENDING_MENU_KEY = "poko_pending_menu";
