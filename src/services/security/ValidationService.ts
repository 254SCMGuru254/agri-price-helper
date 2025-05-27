
export interface SecurityCheck {
  isValid: boolean;
  reason?: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export class ValidationService {
  // Security validation for market price submissions
  static validatePriceSubmission(data: any): SecurityCheck {
    const errors = [];

    // Price validation
    if (typeof data.price !== 'number' || data.price <= 0 || data.price > 1000000) {
      errors.push('Invalid price range');
    }

    // Commodity validation
    if (!data.commodity || typeof data.commodity !== 'string' || data.commodity.length > 100) {
      errors.push('Invalid commodity name');
    }

    // Location validation
    if (!data.location || typeof data.location !== 'string' || data.location.length > 200) {
      errors.push('Invalid location');
    }

    // Unit validation
    const validUnits = ['kg', 'g', 'ton', 'piece', 'litre', 'bag', 'crate'];
    if (!validUnits.includes(data.unit)) {
      errors.push('Invalid unit');
    }

    // Check for suspicious patterns
    const riskLevel = this.assessRiskLevel(data);

    return {
      isValid: errors.length === 0,
      reason: errors.join(', '),
      riskLevel
    };
  }

  private static assessRiskLevel(data: any): 'low' | 'medium' | 'high' {
    let riskScore = 0;

    // Extremely high or low prices
    if (data.price > 100000 || data.price < 1) riskScore += 2;

    // Suspicious text patterns
    const suspiciousPatterns = ['test', 'fake', 'demo', 'xxx', '123'];
    const text = `${data.commodity} ${data.location}`.toLowerCase();
    if (suspiciousPatterns.some(pattern => text.includes(pattern))) {
      riskScore += 3;
    }

    // Location inconsistencies
    if (!this.isValidKenyanLocation(data.location)) {
      riskScore += 1;
    }

    if (riskScore >= 4) return 'high';
    if (riskScore >= 2) return 'medium';
    return 'low';
  }

  private static isValidKenyanLocation(location: string): boolean {
    const kenyanLocations = [
      'nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret', 'thika', 'malindi',
      'kitale', 'garissa', 'kakamega', 'meru', 'nyeri', 'machakos', 'kericho',
      'embu', 'migori', 'homa bay', 'kilifi', 'voi', 'bungoma', 'webuye',
      'kiambu', 'isiolo', 'marsabit', 'wajir', 'mandera', 'moyale', 'lodwar'
    ];
    
    const locationLower = location.toLowerCase();
    return kenyanLocations.some(validLocation => 
      locationLower.includes(validLocation) || validLocation.includes(locationLower)
    );
  }

  // Validate file uploads (for future image uploads)
  static validateFileUpload(file: File): SecurityCheck {
    const errors = [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      errors.push('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
    }

    if (file.size > maxSize) {
      errors.push('File too large. Maximum size is 5MB.');
    }

    return {
      isValid: errors.length === 0,
      reason: errors.join(' '),
      riskLevel: errors.length > 0 ? 'high' : 'low'
    };
  }

  // Content sanitization
  static sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
      .substring(0, 1000); // Limit length
  }
}
