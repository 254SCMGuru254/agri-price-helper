
import { ValidationService } from './security/ValidationService';
import { RateLimitService } from './security/RateLimitService';
import { BehaviorAnalysisService } from './security/BehaviorAnalysisService';

export type { SecurityCheck } from './security/ValidationService';
export type { RateLimitResult } from './security/RateLimitService';

export class SecurityService {
  // Re-export validation methods
  static validatePriceSubmission = ValidationService.validatePriceSubmission;
  static validateFileUpload = ValidationService.validateFileUpload;
  static sanitizeInput = ValidationService.sanitizeInput;

  // Re-export rate limiting methods
  static checkRateLimit = RateLimitService.checkRateLimit;

  // Re-export behavior analysis methods
  static checkUserBehavior = BehaviorAnalysisService.checkUserBehavior;
  static checkForumSpam = BehaviorAnalysisService.checkForumSpam;
}
