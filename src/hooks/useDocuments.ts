import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { documentsApi } from '@/api/documents.api';

export const useDocuments = () => {
  return useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const res = await documentsApi.list();
      return res.data;
    },
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
  });
};

export const useDocument = (id: string | undefined) => {
  return useQuery({
    queryKey: ['document', id],
    queryFn: async () => {
      if (!id) throw new Error('ID is required');
      const res = await documentsApi.getById(id);
      return res.data;
    },
    enabled: !!id,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'COMPLETED' || status === 'FAILED' ? false : 5000;
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: documentsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document deleted');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete');
    },
  });
};
