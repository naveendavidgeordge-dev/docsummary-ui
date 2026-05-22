import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { documentsApi } from '@/api/documents.api';

export const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    onDropRejected: (rejections) => {
      rejections.forEach((r) => {
        if (r.errors[0].code === 'file-too-large') {
          toast.error('File exceeds 10MB limit');
        } else {
          toast.error('Invalid file type');
        }
      });
    },
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      await documentsApi.upload(file, (p) => setProgress(p));
      toast.success('Document uploaded successfully!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Upload Document</h1>
        <p className="text-gray-400 mt-2">
          Select a document to begin automated processing and metadata extraction.
        </p>
      </div>

      <div className="glass-card p-8">
        {!file ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all ${
              isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-800 hover:border-gray-700'
            }`}
          >
            <input {...getInputProps()} />
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-lg font-medium">Click or drag file to upload</p>
            <p className="text-sm text-gray-500 mt-2">
              PDF, JPEG, PNG, WebP or Word up to 10MB
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-950 rounded-xl border border-gray-800">
              <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
              <button
                disabled={uploading}
                onClick={() => setFile(null)}
                className="p-2 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              disabled={uploading}
              onClick={handleUpload}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Start Processing
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
