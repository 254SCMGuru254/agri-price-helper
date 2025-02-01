import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { MessageCircle, ThumbsUp } from "lucide-react";

export const CommunityForum = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['forum-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`
          *,
          author:profiles!forum_posts_author_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading forum posts...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Community Forum</h2>
      <div className="grid gap-4">
        {posts?.map((post) => (
          <Card key={post.id} className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{post.title}</h3>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{post.likes_count}</span>
                </div>
              </div>
              <p className="text-muted-foreground">{post.content}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                <span>Posted by {post.author?.full_name || "Anonymous"}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};