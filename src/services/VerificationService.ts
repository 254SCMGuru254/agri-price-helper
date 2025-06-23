import { supabase } from "@/integrations/supabase/client";

export interface VerificationDocument {
  type: 'id_card' | 'business_license' | 'farm_registration' | 'other';
  file: File;
  metadata?: {
    documentNumber?: string;
    expiryDate?: string;
    issuingAuthority?: string;
    [key: string]: any;
  };
}

export interface VerificationStatus {
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
  verifiedAt?: Date;
  verifiedBy?: string;
}

export class VerificationService {
  static async submitVerification(
    userId: string,
    documents: VerificationDocument[],
    additionalInfo: {
      fullName: string;
      phoneNumber: string;
      location: {
        county: string;
        subCounty: string;
        ward: string;
      };
      farmDetails: {
        size: number;
        mainCrops: string[];
        yearsActive: number;
      };
    }
  ) {
    try {
      // Upload documents to storage
      const uploadPromises = documents.map(async (doc) => {
        const fileName = `${userId}/${doc.type}_${Date.now()}.${doc.file.name.split('.').pop()}`;
        const { error: uploadError } = await supabase.storage
          .from('verification_documents')
          .upload(fileName, doc.file);

        if (uploadError) throw uploadError;

        return {
          type: doc.type,
          path: fileName,
          metadata: doc.metadata
        };
      });

      const uploadedDocs = await Promise.all(uploadPromises);

      // Create verification request
      const { error: verificationError } = await supabase
        .from('farmer_verifications')
        .insert({
          user_id: userId,
          documents: uploadedDocs,
          additional_info: additionalInfo,
          status: 'pending',
          submitted_at: new Date().toISOString()
        });

      if (verificationError) throw verificationError;

      return { success: true };
    } catch (error) {
      console.error('Verification submission error:', error);
      throw error;
    }
  }

  static async getVerificationStatus(userId: string): Promise<VerificationStatus | null> {
    try {
      const { data, error } = await supabase
        .from('farmer_verifications')
        .select('status, message, verified_at, verified_by')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      if (!data) return null;

      return {
        status: data.status,
        message: data.message,
        verifiedAt: data.verified_at ? new Date(data.verified_at) : undefined,
        verifiedBy: data.verified_by
      };
    } catch (error) {
      console.error('Error fetching verification status:', error);
      throw error;
    }
  }

  static async updateVerificationStatus(
    verificationId: string,
    status: 'approved' | 'rejected',
    adminId: string,
    message?: string
  ) {
    try {
      const { error } = await supabase
        .from('farmer_verifications')
        .update({
          status,
          message,
          verified_at: new Date().toISOString(),
          verified_by: adminId
        })
        .eq('id', verificationId);

      if (error) throw error;

      // If approved, update user's verified status
      if (status === 'approved') {
        const { data: verification } = await supabase
          .from('farmer_verifications')
          .select('user_id')
          .eq('id', verificationId)
          .single();

        if (verification) {
          await supabase
            .from('profiles')
            .update({
              is_verified: true,
              verified_at: new Date().toISOString()
            })
            .eq('id', verification.user_id);
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating verification status:', error);
      throw error;
    }
  }

  static async listPendingVerifications(adminId: string) {
    try {
      const { data, error } = await supabase
        .from('farmer_verifications')
        .select(`
          *,
          user:profiles(full_name, email, phone)
        `)
        .eq('status', 'pending')
        .order('submitted_at', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error listing pending verifications:', error);
      throw error;
    }
  }

  static async getDocumentUrl(path: string): Promise<string> {
    try {
      const { data, error } = await supabase.storage
        .from('verification_documents')
        .createSignedUrl(path, 3600); // 1 hour expiry

      if (error) throw error;
      return data.signedUrl;
    } catch (error) {
      console.error('Error getting document URL:', error);
      throw error;
    }
  }
} 