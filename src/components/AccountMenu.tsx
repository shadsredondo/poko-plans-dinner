import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { clearChatState } from "@/lib/chatStorage";
import { useNavigate } from "react-router-dom";

const AccountMenu = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!user) return null;

  const initial = (user.email?.[0] || "?").toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    clearChatState();
    toast({ title: "You've been signed out" });
    navigate("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-7 h-7 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center hover:bg-primary/25 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          {initial}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem disabled className="text-xs text-muted-foreground cursor-default">
          <User className="w-3.5 h-3.5 mr-2" />
          {user.email}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
          <LogOut className="w-3.5 h-3.5 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountMenu;
