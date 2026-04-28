import { LucideIcon } from "lucide-react";

interface ResultCardProps {
  icon: LucideIcon;
  title: string;
  content: string;
  accent: "purple" | "green";
  delay?: number;
}

export const ResultCard = ({ icon: Icon, title, content, accent, delay = 0 }: ResultCardProps) => {
  const accentClass =
    accent === "purple"
      ? "text-primary bg-primary/10 ring-primary/30"
      : "text-secondary bg-secondary/10 ring-secondary/30";

  return (
    <article
      className="group relative rounded-2xl border-gradient bg-gradient-card p-5 sm:p-6 opacity-0 animate-fade-in-up transition-smooth hover:-translate-y-1"
      style={{
        animationDelay: `${delay}ms`,
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className={`h-10 w-10 rounded-xl ring-1 flex items-center justify-center ${accentClass} transition-smooth group-hover:scale-110`}>
          <Icon className="h-5 w-5" strokeWidth={2.2} />
        </div>
        <h3 className="font-display font-semibold text-base sm:text-lg pt-1.5 text-foreground">
          {title}
        </h3>
      </div>
      <p className="text-sm sm:text-[15px] leading-relaxed text-muted-foreground whitespace-pre-line">
        {content}
      </p>
    </article>
  );
};
