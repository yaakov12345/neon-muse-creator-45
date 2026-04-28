import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Trash2, FolderKanban } from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: string;
  title: string;
  niche: string | null;
  video_length: string | null;
  goal: string | null;
  viral_score: number | null;
  created_at: string;
}

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("id, title, niche, video_length, goal, viral_score, created_at")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setProjects(data || []);
    setLoading(false);
  }

  async function del(id: string) {
    if (!confirm("Delete this strategy?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setProjects((p) => p.filter((x) => x.id !== id));
    toast.success("Deleted");
  }

  return (
    <div className="px-4 sm:px-6 py-8 md:py-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">My Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">Every viral strategy you've generated.</p>
        </div>
        <Button asChild className="bg-gradient-primary text-primary-foreground">
          <Link to="/generator"><Sparkles className="h-4 w-4" /> New</Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : projects.length === 0 ? (
        <Card className="border-gradient p-12 text-center">
          <FolderKanban className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-display text-lg font-semibold mb-1">No projects yet</h3>
          <p className="text-sm text-muted-foreground mb-6">Generate your first viral strategy to see it here.</p>
          <Button asChild className="bg-gradient-primary text-primary-foreground">
            <Link to="/generator">Start generating</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <Card key={p.id} className="border-gradient p-5 group flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                  {p.viral_score ?? "—"}
                </div>
                <button onClick={() => del(p.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <Link to={`/projects/${p.id}`} className="block flex-1">
                <h3 className="font-semibold line-clamp-2 mb-2 hover:text-primary transition-colors">{p.title}</h3>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {p.video_length && <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{p.video_length}</span>}
                  {p.goal && <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{p.goal}</span>}
                  {p.niche && <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{p.niche}</span>}
                </div>
                <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</p>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
