import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Flame, Loader2 } from "lucide-react";

const schema = z.object({
  email: z.string().trim().email({ message: "Invalid email" }).max(255),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(100),
  displayName: z.string().trim().min(1).max(60).optional(),
});

export default function Auth() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/generator", { replace: true });
  }, [user, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password, displayName: mode === "signup" ? displayName : undefined });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/generator`,
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Account created — you're in!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
      }
    } catch (err: any) {
      toast.error(err?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <Link to="/" className="flex items-center justify-center gap-2 mb-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center glow-purple">
            <Flame className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl font-bold tracking-tight">Viralyx</span>
        </Link>

        <Card className="border-gradient p-6 sm:p-8">
          <div className="flex gap-2 p-1 bg-muted rounded-lg mb-6">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${mode === "signin" ? "bg-background text-foreground shadow" : "text-muted-foreground"}`}
            >
              Sign in
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${mode === "signup" ? "bg-background text-foreground shadow" : "text-muted-foreground"}`}
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" maxLength={60} />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={255} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} maxLength={100} />
            </div>
            <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 glow-purple text-primary-foreground" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          By continuing you agree to our terms and privacy policy.
        </p>
      </div>
    </div>
  );
}
