import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";
import { Flag } from "lucide-react";

interface ReportButtonProps {
  type: 'price' | 'comment' | 'forum_post' | 'business';
  content: string;
  ownerId: string;
  itemId: string;
}

export const ReportButton = ({ type, content, ownerId, itemId }: ReportButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { translate } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');

  const reportMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Must be logged in');
      
      const finalReason = selectedReason === 'other' ? reason : selectedReason;
      
      const { error } = await supabase
        .from('reported_items')
        .insert({
          type,
          content,
          reported_by: user.id,
          owner_id: ownerId,
          reason: finalReason,
          item_id: itemId
        });

      if (error) throw error;
    },
    onSuccess: () => {
      setIsOpen(false);
      setReason('');
      setSelectedReason('');
      toast({
        title: translate('report.success'),
        description: translate('report.successMessage'),
      });
    },
    onError: (error: any) => {
      toast({
        title: translate('report.error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) {
      toast({
        title: translate('report.reasonRequired'),
        description: translate('report.reasonRequiredMessage'),
        variant: 'destructive',
      });
      return;
    }

    if (selectedReason === 'other' && !reason.trim()) {
      toast({
        title: translate('report.reasonRequired'),
        description: translate('report.customReasonRequired'),
        variant: 'destructive',
      });
      return;
    }

    reportMutation.mutate();
  };

  if (!user) return null;

  // Don't show report button for own content
  if (user.id === ownerId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Flag className="h-4 w-4" />
          <span className="sr-only">{translate('report.button')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{translate('report.title')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <Label>{translate('report.reasonLabel')}</Label>
            <RadioGroup
              value={selectedReason}
              onValueChange={setSelectedReason}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inappropriate" id="inappropriate" />
                <Label htmlFor="inappropriate">
                  {translate('report.reasons.inappropriate')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="spam" id="spam" />
                <Label htmlFor="spam">{translate('report.reasons.spam')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="misleading" id="misleading" />
                <Label htmlFor="misleading">
                  {translate('report.reasons.misleading')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="offensive" id="offensive" />
                <Label htmlFor="offensive">
                  {translate('report.reasons.offensive')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">{translate('report.reasons.other')}</Label>
              </div>
            </RadioGroup>

            {selectedReason === 'other' && (
              <div className="space-y-2">
                <Label>{translate('report.customReasonLabel')}</Label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={translate('report.customReasonPlaceholder')}
                  className="min-h-[100px]"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={reportMutation.isPending}
            >
              {reportMutation.isPending ? (
                translate('report.submitting')
              ) : (
                translate('report.submit')
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 