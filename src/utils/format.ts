import { format } from 'date-fns';

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const formatDate = (date: string | null) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'MMM d, yyyy HH:mm');
};

export const formatDuration = (ms: number) => {
  return (ms / 1000).toFixed(2) + 's';
};

export const getMimeTypeLabel = (mimeType: string) => {
  const types: Record<string, string> = {
    'application/pdf': 'PDF',
    'image/jpeg': 'JPEG',
    'image/png': 'PNG',
    'image/webp': 'WebP',
    'application/msword': 'Word',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
  };
  return types[mimeType] || 'Unknown';
};
