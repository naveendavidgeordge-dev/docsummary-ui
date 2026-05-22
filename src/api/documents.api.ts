import client from './client';
import { ApiSuccess, Document } from '@/types';

export const documentsApi = {
  list: () => client.get<any, ApiSuccess<Document[]>>('/documents'),
  getById: (id: string) => client.get<any, ApiSuccess<Document>>(`/documents/${id}`),
  upload: (file: File, onProgress: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    return client.post<any, ApiSuccess<Document>>('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const progress = progressEvent.total
          ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
          : 0;
        onProgress(progress);
      },
    });
  },
  delete: (id: string) => client.delete<any, ApiSuccess<Document>>(`/documents/${id}`),
};
