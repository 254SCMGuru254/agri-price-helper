import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Award, ThumbsUp } from "lucide-react";

export const SuccessStories = () => {
  const { data: stories, isLoading } = useQuery({
    queryKey: ['success-stories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('success_stories')
        .select(`
          *,
          farmer:profiles!success_stories_farmer_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading success stories...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Success Stories</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {stories?.map((story) => (
          <Card key={story.id} className="p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{story.title}</h3>
              </div>
              <p className="text-muted-foreground">{story.content}</p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>By {story.farmer?.full_name || "Anonymous"}</span>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{story.likes_count}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};