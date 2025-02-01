import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { MessageSquare, User } from "lucide-react";

export const ExpertQA = () => {
  const { data: qaItems, isLoading } = useQuery({
    queryKey: ['expert-qa'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expert_qa')
        .select(`
          *,
          asker:profiles!expert_qa_asked_by_fkey(full_name),
          expert:profiles!expert_qa_answered_by_fkey(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading Q&A...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Expert Q&A</h2>
      <div className="grid gap-4">
        {qaItems?.map((qa) => (
          <Card key={qa.id} className="p-4">
            <div className="flex items-start gap-4">
              <MessageSquare className="h-5 w-5 mt-1 text-primary" />
              <div className="flex-1">
                <div className="font-medium">{qa.question}</div>
                {qa.answer && (
                  <div className="mt-2 text-muted-foreground">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {qa.expert?.full_name || "Expert"}
                      </span>
                    </div>
                    {qa.answer}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};