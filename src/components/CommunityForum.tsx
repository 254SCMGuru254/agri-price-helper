
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MessageCircle, ThumbsUp, Plus } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";

export const CommunityForum = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' });

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
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: typeof newPost) => {
      if (!user) throw new Error('Must be logged in');
      
      const { data, error } = await supabase
        .from('forum_posts')
        .insert({
          ...postData,
          author_id: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      setNewPost({ title: '', content: '', category: 'general' });
      setShowForm(false);
      toast({
        title: "Success!",
        description: "Your discussion post has been created. You earned 5 points!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    createPostMutation.mutate(newPost);
  };

  if (isLoading) return <div>Loading community discussions...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Community Forum</h2>
        {user && (
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-1" />
            {showForm ? 'Cancel' : 'New Discussion'}
          </Button>
        )}
      </div>

      {showForm && user && (
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Discussion title..."
              value={newPost.title}
              onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
              required
            />
            <Textarea
              placeholder="Share your thoughts, ask questions, or start a discussion..."
              value={newPost.content}
              onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              rows={4}
              required
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={createPostMutation.isPending}>
                {createPostMutation.isPending ? 'Posting...' : 'Post Discussion (+5 points)'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

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
                <span>•</span>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {!user && (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground mb-2">Join the community to participate in discussions!</p>
          <Button>Sign In to Join Discussion</Button>
        </Card>
      )}
    </div>
  );
};
