import { useAuth } from "@/components/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { VerificationService } from "@/services/VerificationService";
import { CheckCircle, XCircle, Eye, FileText } from "lucide-react";
import { useState } from "react";

export const VerificationPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedVerification, setSelectedVerification] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [viewingDocuments, setViewingDocuments] = useState(false);

  const { data: pendingVerifications, isLoading } = useQuery({
    queryKey: ['pending-verifications'],
    queryFn: () => user?.id ? VerificationService.listPendingVerifications(user.id) : null,
    enabled: !!user?.id
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ verificationId, status, message }: { verificationId: string; status: 'approved' | 'rejected'; message?: string }) => {
      if (!user?.id) throw new Error('Must be logged in');
      return VerificationService.updateVerificationStatus(verificationId, status, user.id, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-verifications'] });
      setSelectedVerification(null);
      setRejectReason('');
      toast({
        title: "Status Updated",
        description: "The verification status has been updated successfully.",
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

  const handleApprove = (verification: any) => {
    updateStatusMutation.mutate({
      verificationId: verification.id,
      status: 'approved'
    });
  };

  const handleReject = (verification: any) => {
    if (!rejectReason) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      });
      return;
    }

    updateStatusMutation.mutate({
      verificationId: verification.id,
      status: 'rejected',
      message: rejectReason
    });
  };

  if (isLoading) return <div>Loading verifications...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Verifications</CardTitle>
        <CardDescription>Review and manage farmer verification requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingVerifications?.length === 0 ? (
            <p className="text-center text-muted-foreground">No pending verifications</p>
          ) : (
            pendingVerifications?.map((verification: any) => (
              <Card key={verification.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{verification.user.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{verification.user.email}</p>
                    <p className="text-sm">{verification.user.phone}</p>
                    
                    <div className="mt-2">
                      <Badge variant="outline">
                        {verification.additional_info.location.county}
                      </Badge>
                      <Badge variant="outline" className="ml-2">
                        {verification.additional_info.farmDetails.size} acres
                      </Badge>
                    </div>
                  </div>

                  <div className="space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedVerification(verification)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Verification Details</DialogTitle>
                        </DialogHeader>
                        {selectedVerification && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Personal Information</h4>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>Full Name:</div>
                                <div>{selectedVerification.additional_info.fullName}</div>
                                <div>Phone:</div>
                                <div>{selectedVerification.additional_info.phoneNumber}</div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Location</h4>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>County:</div>
                                <div>{selectedVerification.additional_info.location.county}</div>
                                <div>Sub County:</div>
                                <div>{selectedVerification.additional_info.location.subCounty}</div>
                                <div>Ward:</div>
                                <div>{selectedVerification.additional_info.location.ward}</div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Farm Details</h4>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>Farm Size:</div>
                                <div>{selectedVerification.additional_info.farmDetails.size} acres</div>
                                <div>Main Crops:</div>
                                <div>{selectedVerification.additional_info.farmDetails.mainCrops.join(', ')}</div>
                                <div>Years Active:</div>
                                <div>{selectedVerification.additional_info.farmDetails.yearsActive} years</div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Documents</h4>
                              <div className="space-y-2">
                                {selectedVerification.documents.map((doc: any, index: number) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={async () => {
                                      try {
                                        const url = await VerificationService.getDocumentUrl(doc.path);
                                        window.open(url, '_blank');
                                      } catch (error) {
                                        toast({
                                          title: "Error",
                                          description: "Failed to load document",
                                          variant: "destructive",
                                        });
                                      }
                                    }}
                                  >
                                    <FileText className="h-4 w-4 mr-2" />
                                    {doc.type.replace('_', ' ').toUpperCase()}
                                  </Button>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Textarea
                                placeholder="Reason for rejection (required if rejecting)"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                              />
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="destructive"
                                  onClick={() => handleReject(selectedVerification)}
                                  disabled={updateStatusMutation.isPending}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                                <Button
                                  variant="default"
                                  onClick={() => handleApprove(selectedVerification)}
                                  disabled={updateStatusMutation.isPending}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 