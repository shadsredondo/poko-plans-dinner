import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { hasStoredChatState } from "@/lib/chatStorage";
import Index from "./pages/Index.tsx";
import SavedMenus from "./pages/SavedMenus.tsx";
import NotFound from "./pages/NotFound.tsx";
import { useAuth } from "./hooks/useAuth.tsx";

const queryClient = new QueryClient();

const AuthAwareHome = () => {
  const { user, loading } = useAuth();
  const [hasDraft, setHasDraft] = useState(() => hasStoredChatState());

  useEffect(() => {
    const syncDraftState = () => setHasDraft(hasStoredChatState());

    syncDraftState();
    window.addEventListener("storage", syncDraftState);
    window.addEventListener("focus", syncDraftState);
    document.addEventListener("visibilitychange", syncDraftState);

    return () => {
      window.removeEventListener("storage", syncDraftState);
      window.removeEventListener("focus", syncDraftState);
      document.removeEventListener("visibilitychange", syncDraftState);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return user && !hasDraft ? <SavedMenus /> : <Index />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthAwareHome />} />
          <Route path="/new" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
