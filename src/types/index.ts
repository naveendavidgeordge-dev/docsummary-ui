export type DocumentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface ExtractedMetadata {
  fileType: string;
  fileSizeKb: number;
  pageCount: number | null;
  mimeType: string;
  processedAt: string;
  processingDurationMs: number;
  summary: string;
  keywords: string[];
  confidence: number;
  extractedBy: string;
}

export interface User {
  id: string;
  email: string;
}

export interface Document {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  blobUrl: string;
  blobPath: string;
  status: DocumentStatus;
  extractedJson: ExtractedMetadata | null;
  errorMessage: string | null;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  timestamp: string;
}

export interface ApiError {
  success: false;
  statusCode: number;
  message: string | string[];
  error: string;
  path: string;
  timestamp: string;
}
