import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  FileText,
  Clock,
  HardDrive,
  ExternalLink,
  Cpu,
  BarChart,
  Tag,
  Code,
  CheckCircle2,
  ChevronRight as ChevronRightIcon,
} from 'lucide-react';
import { useDocument } from '@/hooks/useDocuments';
import { StatusBadge } from '@/components/StatusBadge';
import { formatBytes, formatDate, formatDuration, getMimeTypeLabel } from '@/utils/format';

export const DocumentDetailPage = () => {
  const { id } = useParams();
  const { data: doc, isLoading } = useDocument(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Clock className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Document not found</h2>
        <Link to="/dashboard" className="text-blue-500 hover:underline mt-4 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const isTerminal = doc.status === 'COMPLETED' || doc.status === 'FAILED';
  const extractedData = doc.extractedJson;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-gray-100 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold truncate max-w-md">{doc.originalName}</h1>
            <div className="flex items-center gap-3 mt-1">
              <StatusBadge status={doc.status} />
              {!isTerminal && (
                <span className="text-xs text-gray-500 animate-pulse">
                  Auto-refreshing...
                </span>
              )}
            </div>
          </div>
        </div>

        <a
          href={doc.blobUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View in Storage
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Lifecycle & Info */}
        <div className="lg:col-span-1 space-y-8">
          {/* Lifecycle Timeline */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
              Lifecycle Status
            </h3>
            <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-800">
              <TimelineStep
                label="Document Uploaded"
                time={formatDate(doc.createdAt)}
                active={true}
                completed={true}
              />
              <TimelineStep
                label="AI Extraction"
                time={doc.status === 'PROCESSING' ? 'In Progress...' : doc.processedAt ? formatDate(doc.processedAt) : '--'}
                active={doc.status === 'PROCESSING' || doc.status === 'COMPLETED'}
                completed={doc.status === 'COMPLETED'}
                isCurrent={doc.status === 'PROCESSING'}
              />
              <TimelineStep
                label="Process Terminal"
                time={doc.processedAt ? formatDate(doc.processedAt) : '--'}
                active={isTerminal}
                completed={doc.status === 'COMPLETED'}
                failed={doc.status === 'FAILED'}
              />
            </div>
          </div>

          {/* File Information */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
              File Details
            </h3>
            <div className="grid grid-cols-2 gap-y-6">
              <InfoItem icon={HardDrive} label="Size" value={formatBytes(doc.fileSize)} />
              <InfoItem icon={FileText} label="Type" value={getMimeTypeLabel(doc.mimeType)} />
              <InfoItem icon={Calendar} label="Created" value={formatDate(doc.createdAt)} />
              <InfoItem icon={Clock} label="Processed" value={formatDate(doc.processedAt)} />
            </div>
          </div>
        </div>

        {/* Right Column: Extracted Metadata */}
        <div className="lg:col-span-2 space-y-8">
          {doc.status === 'FAILED' ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center">
              <Cpu className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-red-400">Processing Failed</h2>
              <p className="text-gray-400 mt-2">{doc.errorMessage || 'An internal error occurred during extraction.'}</p>
            </div>
          ) : doc.status === 'COMPLETED' && extractedData ? (
            <>
              <div className="glass-card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart className="w-6 h-6 text-blue-500" />
                  <h2 className="text-xl font-bold">Extracted Insights</h2>
                </div>
                
                <p className="text-gray-300 leading-relaxed text-lg italic">
                  "{extractedData.summary}"
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-10">
                  <Stat label="Content Type" value={extractedData.fileType} />
                  <Stat label="Confidence" value={`${(extractedData.confidence * 100).toFixed(1)}%`} />
                  <Stat label="Processing Time" value={formatDuration(extractedData.processingDurationMs)} />
                  <Stat label="Page Count" value={extractedData.pageCount || 'N/A'} />
                  <Stat label="Processor" value="Azure v1.0" />
                  <Stat label="MIME Type" value={extractedData.mimeType} />
                </div>
              </div>

              <div className="glass-card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Tag className="w-6 h-6 text-blue-500" />
                  <h2 className="text-xl font-bold">Keywords</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {extractedData.keywords.map((tag: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass-card p-8">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <div className="flex items-center gap-3">
                      <Code className="w-6 h-6 text-gray-500" />
                      <h2 className="text-xl font-bold">Raw Metadata</h2>
                    </div>
                    <ChevronRightIcon className="w-6 h-6 text-gray-500 transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="mt-6">
                    <pre className="bg-gray-950 p-6 rounded-xl border border-gray-800 text-xs text-blue-400 overflow-x-auto">
                      {JSON.stringify(extractedData, null, 2)}
                    </pre>
                  </div>
                </details>
              </div>
            </>
          ) : (
            <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-20 text-center">
              <Cpu className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-pulse" />
              <h2 className="text-xl font-bold">Awaiting AI Extraction</h2>
              <p className="text-gray-500 mt-2">
                Your document is currently in the {doc.status.toLowerCase()} phase. Results will appear automatically.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TimelineStep = ({ label, time, active, completed, isCurrent, failed }: any) => (
  <div className={`flex gap-4 ${active ? 'opacity-100' : 'opacity-40'}`}>
    <div
      className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
        completed
          ? 'bg-green-600 border-green-600'
          : failed
          ? 'bg-red-600 border-red-600'
          : isCurrent
          ? 'bg-blue-600 border-blue-600 animate-pulse'
          : 'bg-gray-900 border-gray-800'
      }`}
    >
      {completed ? <CheckCircle2 className="w-4 h-4 text-white" /> : <div className="w-1.5 h-1.5 rounded-full bg-white" />}
    </div>
    <div>
      <p className="font-semibold text-sm leading-6">{label}</p>
      <p className="text-xs text-gray-500">{time}</p>
    </div>
  </div>
);
const InfoItem = ({ icon: Icon, label, value }: any) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2 text-gray-500">
      <Icon className="w-4 h-4" />
      <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
    </div>
    <p className="font-medium text-sm text-gray-200">{value}</p>
  </div>
);

const Stat = ({ label, value }: any) => (
  <div className="space-y-1">
    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{label}</p>
    <p className="text-lg font-bold text-gray-100">{value}</p>
  </div>
);
