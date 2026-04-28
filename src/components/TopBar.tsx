import { Sparkles } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type Mode = "views" | "money" | "both";

interface TopBarProps {
  mode: Mode;
  onModeChange: (m: Mode) => void;
  language: string;
  onLanguageChange: (l: string) => void;
}

const modes: { id: Mode; label: string }[] = [
  { id: "views", label: "Views" },
  { id: "money", label: "Money" },
  { id: "both", label: "Both" },
];

export const TopBar = ({ mode, onModeChange, language, onLanguageChange }: TopBarProps) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center glow-purple">
            <Sparkles className="h-4 w-4 text-background" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-lg tracking-tight hidden xs:inline">
            Viralyx
          </span>
        </div>

        {/* Mode toggle */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-muted/60 border border-border/50">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => onModeChange(m.id)}
              className={`relative px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all duration-300 ${
                mode === m.id
                  ? "bg-gradient-primary text-background shadow-[0_0_20px_hsl(270_95%_65%/0.5)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Language */}
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-[72px] sm:w-[96px] h-9 rounded-full bg-muted/60 border-border/50 text-xs sm:text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-border/50">
            <SelectItem value="AUTO">🌐 Auto</SelectItem>
            <SelectItem value="EN">🇬🇧 EN</SelectItem>
            <SelectItem value="HE">🇮🇱 HE</SelectItem>
            <SelectItem value="AR">🇸🇦 AR</SelectItem>
            <SelectItem value="ES">🇪🇸 ES</SelectItem>
            <SelectItem value="FR">🇫🇷 FR</SelectItem>
            <SelectItem value="DE">🇩🇪 DE</SelectItem>
            <SelectItem value="PT">🇵🇹 PT</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </header>
  );
};
