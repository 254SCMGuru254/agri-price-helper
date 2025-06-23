import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { VerificationService, type VerificationDocument } from "@/services/VerificationService";
import { Upload, CheckCircle, AlertCircle, Clock } from "lucide-react";

const DOCUMENT_TYPES = [
  { value: 'id_card', label: 'National ID Card' },
  { value: 'business_license', label: 'Business License' },
  { value: 'farm_registration', label: 'Farm Registration' },
  { value: 'other', label: 'Other Supporting Document' }
] as const;

const COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo Marakwet', 'Embu', 'Garissa',
  'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
  'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos',
  'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a',
  'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu',
  'Siaya', 'Taita Taveta', 'Tana River', 'Tharaka Nithi', 'Trans Nzoia', 'Turkana',
  'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
];

export const FarmerVerification = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    location: {
      county: '',
      subCounty: '',
      ward: ''
    },
    farmDetails: {
      size: 0,
      mainCrops: [] as string[],
      yearsActive: 0
    }
  });

  const { data: verificationStatus } = useQuery({
    queryKey: ['verification-status', user?.id],
    queryFn: () => user?.id ? VerificationService.getVerificationStatus(user.id) : null,
    enabled: !!user?.id
  });

  const verificationMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Must be logged in');
      return VerificationService.submitVerification(user.id, documents, formData);
    },
    onSuccess: () => {
      toast({
        title: "Verification Submitted",
        description: "Your verification request has been submitted and will be reviewed shortly.",
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: VerificationDocument['type']) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setDocuments(prev => [
      ...prev,
      {
        type,
        file,
        metadata: {
          documentNumber: '',
          expiryDate: '',
          issuingAuthority: ''
        }
      }
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (documents.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one verification document.",
        variant: "destructive",
      });
      return;
    }
    verificationMutation.mutate();
  };

  if (!user) return null;

  if (verificationStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Verification Status</CardTitle>
          <CardDescription>Your farmer verification status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {verificationStatus.status === 'approved' ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Verified</span>
                <Badge variant="default">Approved</Badge>
              </>
            ) : verificationStatus.status === 'pending' ? (
              <>
                <Clock className="h-5 w-5 text-yellow-500" />
                <span>Under Review</span>
                <Badge variant="secondary">Pending</Badge>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span>Verification Failed</span>
                <Badge variant="destructive">Rejected</Badge>
              </>
            )}
          </div>
          {verificationStatus.message && (
            <p className="mt-2 text-sm text-muted-foreground">{verificationStatus.message}</p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Farmer Verification</CardTitle>
        <CardDescription>
          Complete the verification process to become a verified farmer on our platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label>Phone Number</Label>
              <Input
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Select
                value={formData.location.county}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, county: value }
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select county" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTIES.map((county) => (
                    <SelectItem key={county} value={county}>{county}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Sub County"
                value={formData.location.subCounty}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, subCounty: e.target.value }
                }))}
                required
              />

              <Input
                placeholder="Ward"
                value={formData.location.ward}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, ward: e.target.value }
                }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Farm Details</Label>
              <Input
                type="number"
                placeholder="Farm size (acres)"
                value={formData.farmDetails.size || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  farmDetails: { ...prev.farmDetails, size: parseFloat(e.target.value) }
                }))}
                required
              />

              <Input
                placeholder="Main crops (comma separated)"
                value={formData.farmDetails.mainCrops.join(', ')}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  farmDetails: { ...prev.farmDetails, mainCrops: e.target.value.split(',').map(s => s.trim()) }
                }))}
                required
              />

              <Input
                type="number"
                placeholder="Years active in farming"
                value={formData.farmDetails.yearsActive || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  farmDetails: { ...prev.farmDetails, yearsActive: parseInt(e.target.value) }
                }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Verification Documents</Label>
              {DOCUMENT_TYPES.map((docType) => (
                <div key={docType.value} className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(e, docType.value)}
                    className="flex-1"
                  />
                  <Badge variant="outline">{docType.label}</Badge>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                Upload clear photos or scans of your documents. Supported formats: JPG, PNG, PDF
              </p>
            </div>
          </div>

          <Button type="submit" disabled={verificationMutation.isPending} className="w-full">
            {verificationMutation.isPending ? (
              <>Submitting...</>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Submit Verification
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}; 