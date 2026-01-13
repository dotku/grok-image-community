export interface ImageData {
  id: string;                    // UUID
  prompt: string;                // User's text prompt
  imageUrl: string;              // Vercel Blob URL
  isNSFW: boolean;               // NSFW flag
  createdAt: string;             // ISO timestamp
  locale: string;                // 'en'
  model: string;                 // AI model name
}

export interface NSFWPreference {
  showNSFW: boolean;             // Current toggle state
  ageVerified: boolean;          // Has confirmed 18+
  verifiedAt?: string;           // Verification timestamp
}

export interface GenerationRequest {
  prompt: string;
  locale: string;
}

export interface GenerationResponse {
  success: boolean;
  data?: ImageData;
  error?: string;
}
