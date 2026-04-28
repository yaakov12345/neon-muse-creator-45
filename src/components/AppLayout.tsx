import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Flame, Sparkles, FolderKanban, CreditCard, Shield, LogOut, Home } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: Home, label: "Home", end: true },
  { to: "/generator", icon: Sparkles, label: "Generator" },
  { to: "/projects", icon: FolderKanban, label: "Projects" },
  { to: "/pricing", icon: CreditCard, label: "Pricing" },
];

export default function AppLayout() {
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();

  const items = [...navItems];
  if (isAdmin) items.push({ to: "/admin", icon: Shield, label: "Admin" });

  return (
    <div className="min-h-screen flex w-full">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-border bg-card/50 backdrop-blur sticky top-0 h-screen">
        <Link to="/" className="flex items-center gap-2 px-5 h-16 border-b border-border">
          <div className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center glow-purple">
            <Flame className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">Viralyx</span>
        </Link>

        <nav className="flex-1 p-3 space-y-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <it.icon className="h-4 w-4" />
              {it.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-border space-y-2">
          {user && (
            <div className="px-3 py-2 text-xs text-muted-foreground truncate">
              {user.email}
            </div>
          )}
          {user ? (
            <Button variant="ghost" size="sm" className="w-full justify-start" onClick={signOut}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          ) : (
            <Button asChild size="sm" className="w-full bg-gradient-primary text-primary-foreground">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden h-14 flex items-center justify-between px-4 border-b border-border bg-card/80 backdrop-blur sticky top-0 z-30">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Flame className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">Viralyx</span>
          </Link>
          {user ? (
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          ) : (
            <Button asChild size="sm" className="bg-gradient-primary text-primary-foreground">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
        </header>

        <main className="flex-1 pb-20 md:pb-0">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-border">
          <div className="grid grid-cols-5 h-16">
            {items.slice(0, 5).map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.end}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )
                }
              >
                <it.icon className="h-5 w-5" />
                {it.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
