import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";
import { AlertTriangle, CheckCircle, Flag, MessageSquare, ShieldAlert, ThumbsDown, ThumbsUp, User } from "lucide-react";

interface ReportedItem {
  id: string;
  type: 'price' | 'comment' | 'forum_post' | 'business';
  content: string;
  reported_by: string;
  reason: string;
  created_at: string;
  status: 'pending' | 'resolved' | 'dismissed';
  reporter: {
    full_name: string;
    email: string;
  };
  item_owner: {
    full_name: string;
    email: string;
  };
}

export const CommunityModeration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { translate } = useLanguage();
  const queryClient = useQueryClient();
  const [selectedReport, setSelectedReport] = useState<ReportedItem | null>(null);
  const [moderationNote, setModerationNote] = useState('');

  const { data: reportedItems, isLoading } = useQuery({
    queryKey: ['reported-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reported_items')
        .select(`
          *,
          reporter:reported_by(full_name, email),
          item_owner:owner_id(full_name, email)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ReportedItem[];
    },
    enabled: !!user?.id
  });

  const moderationMutation = useMutation({
    mutationFn: async ({ reportId, action, note }: { reportId: string; action: 'resolve' | 'dismiss'; note: string }) => {
      const { error } = await supabase
        .from('reported_items')
        .update({
          status: action === 'resolve' ? 'resolved' : 'dismissed',
          moderation_note: note,
          moderated_by: user?.id,
          moderated_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) throw error;

      // If resolving, also update the reported item's status
      if (action === 'resolve' && selectedReport) {
        const { error: itemError } = await supabase
          .from(getTableName(selectedReport.type))
          .update({ is_hidden: true })
          .eq('id', selectedReport.id);

        if (itemError) throw itemError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reported-items'] });
      setSelectedReport(null);
      setModerationNote('');
      toast({
        title: translate('moderation.actionSuccess'),
        description: translate('moderation.actionSuccessMessage'),
      });
    },
    onError: (error: any) => {
      toast({
        title: translate('moderation.actionError'),
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const getTableName = (type: ReportedItem['type']) => {
    switch (type) {
      case 'price': return 'market_prices';
      case 'comment': return 'comments';
      case 'forum_post': return 'forum_posts';
      case 'business': return 'business_listings';
    }
  };

  const handleModeration = (action: 'resolve' | 'dismiss') => {
    if (!selectedReport) return;
    if (action === 'resolve' && !moderationNote) {
      toast({
        title: translate('moderation.noteRequired'),
        description: translate('moderation.noteRequiredMessage'),
        variant: 'destructive',
      });
      return;
    }

    moderationMutation.mutate({
      reportId: selectedReport.id,
      action,
      note: moderationNote
    });
  };

  if (isLoading) return <div>Loading reported items...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5" />
          {translate('moderation.title')}
        </CardTitle>
        <CardDescription>{translate('moderation.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">{translate('moderation.allReports')}</TabsTrigger>
            <TabsTrigger value="prices">{translate('moderation.priceReports')}</TabsTrigger>
            <TabsTrigger value="community">{translate('moderation.communityReports')}</TabsTrigger>
            <TabsTrigger value="business">{translate('moderation.businessReports')}</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {reportedItems?.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                {translate('moderation.noReports')}
              </p>
            ) : (
              reportedItems?.map((report) => (
                <Card key={report.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {report.type === 'price' && <Flag className="h-4 w-4" />}
                          {report.type === 'comment' && <MessageSquare className="h-4 w-4" />}
                          {report.type === 'forum_post' && <MessageSquare className="h-4 w-4" />}
                          {report.type === 'business' && <User className="h-4 w-4" />}
                          {translate(`moderation.type.${report.type}`)}
                        </Badge>
                        <Badge variant="secondary">
                          {new Date(report.created_at).toLocaleDateString()}
                        </Badge>
                      </div>

                      <p className="text-sm font-medium">{report.content}</p>
                      <p className="text-sm text-muted-foreground">
                        {translate('moderation.reportedBy')}: {report.reporter.full_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {translate('moderation.reason')}: {report.reason}
                      </p>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedReport(report)}
                        >
                          {translate('moderation.review')}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{translate('moderation.reviewReport')}</DialogTitle>
                        </DialogHeader>
                        {selectedReport && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <h4 className="font-medium">{translate('moderation.reportDetails')}</h4>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>{translate('moderation.type.label')}:</div>
                                <div>{translate(`moderation.type.${selectedReport.type}`)}</div>
                                <div>{translate('moderation.reportedBy')}:</div>
                                <div>{selectedReport.reporter.full_name}</div>
                                <div>{translate('moderation.itemOwner')}:</div>
                                <div>{selectedReport.item_owner.full_name}</div>
                                <div>{translate('moderation.reportedAt')}:</div>
                                <div>{new Date(selectedReport.created_at).toLocaleString()}</div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h4 className="font-medium">{translate('moderation.reportedContent')}</h4>
                              <p className="text-sm p-3 bg-muted rounded-md">{selectedReport.content}</p>
                            </div>

                            <div className="space-y-2">
                              <h4 className="font-medium">{translate('moderation.reportReason')}</h4>
                              <p className="text-sm p-3 bg-muted rounded-md">{selectedReport.reason}</p>
                            </div>

                            <div className="space-y-2">
                              <h4 className="font-medium">{translate('moderation.moderationNote')}</h4>
                              <Textarea
                                placeholder={translate('moderation.noteHint')}
                                value={moderationNote}
                                onChange={(e) => setModerationNote(e.target.value)}
                              />
                            </div>

                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => handleModeration('dismiss')}
                                disabled={moderationMutation.isPending}
                              >
                                <ThumbsDown className="h-4 w-4 mr-1" />
                                {translate('moderation.dismiss')}
                              </Button>
                              <Button
                                variant="default"
                                onClick={() => handleModeration('resolve')}
                                disabled={moderationMutation.isPending}
                              >
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                {translate('moderation.resolve')}
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="prices">
            {reportedItems?.filter(r => r.type === 'price').length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                {translate('moderation.noPriceReports')}
              </p>
            ) : (
              reportedItems?.filter(r => r.type === 'price').map((report) => (
                // Same card component as above
                <Card key={report.id}>...</Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="community">
            {reportedItems?.filter(r => r.type === 'comment' || r.type === 'forum_post').length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                {translate('moderation.noCommunityReports')}
              </p>
            ) : (
              reportedItems?.filter(r => r.type === 'comment' || r.type === 'forum_post').map((report) => (
                // Same card component as above
                <Card key={report.id}>...</Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="business">
            {reportedItems?.filter(r => r.type === 'business').length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                {translate('moderation.noBusinessReports')}
              </p>
            ) : (
              reportedItems?.filter(r => r.type === 'business').map((report) => (
                // Same card component as above
                <Card key={report.id}>...</Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}; 