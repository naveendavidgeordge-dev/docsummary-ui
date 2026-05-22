import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  RefreshCw,
  FileText,
  Trash2,
  ExternalLink,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useDocuments, useDeleteDocument } from '@/hooks/useDocuments';
import { useAuthStore } from '@/store/auth.store';
import { StatusBadge } from '@/components/StatusBadge';
import { formatBytes, formatDate } from '@/utils/format';

export const DashboardPage = () => {
  const [search, setSearch] = useState('');
  const { data: documents, isLoading, isRefetching } = useDocuments();
  const deleteMutation = useDeleteDocument();
  const { user, logout } = useAuthStore();

  const filteredDocs = documents?.filter((doc) =>
    doc.originalName.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-10 glass-card rounded-none border-t-0 border-x-0">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">DocProcess</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-sm">
              <span className="text-gray-400">Logged in as: </span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <button
              onClick={logout}
              className="p-2 hover:bg-red-500/10 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
              <span>{documents?.length || 0} Documents</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                Auto-refreshing every 5s
                <RefreshCw className={`w-3 h-3 ${isRefetching ? 'animate-spin text-blue-500' : ''}`} />
              </span>
            </div>
          </div>

          <Link
            to="/upload"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-5 h-5" />
            New Upload
          </Link>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents by name..."
              className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30"
            />
          </div>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800/50 border-b border-gray-800 text-sm font-medium text-gray-400">
                  <th className="px-6 py-4">Document Name</th>
                  <th className="px-6 py-4">Size</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Uploaded</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-gray-800 rounded w-48" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-800 rounded w-16" /></td>
                      <td className="px-6 py-4"><div className="h-6 bg-gray-800 rounded-full w-24" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-800 rounded w-32" /></td>
                      <td className="px-6 py-4"><div className="h-8 bg-gray-800 rounded-lg w-8 ml-auto" /></td>
                    </tr>
                  ))
                ) : filteredDocs?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center">
                        <FileText className="w-12 h-12 text-gray-800 mb-4" />
                        <p className="text-lg font-medium text-gray-400">No documents found</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {search ? 'Try a different search term' : 'Start by uploading your first document'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDocs?.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <Link
                          to={`/documents/${doc.id}`}
                          className="flex items-center gap-3 font-medium text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <FileText className="w-5 h-5" />
                          {doc.originalName}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {formatBytes(doc.fileSize)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={doc.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {formatDate(doc.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <a
                            href={doc.blobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-gray-300 transition-colors"
                            title="View in Storage"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <Link
                            to={`/documents/${doc.id}`}
                            className="p-2 hover:bg-gray-800 rounded-lg text-gray-300 transition-colors"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {documents?.some((d) => d.status === 'FAILED') && (
          <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
            <Trash2 className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium text-red-400">
              One or more documents failed to process. Review details for more information.
            </span>
          </div>
        )}
      </main>
    </div>
  );
};
