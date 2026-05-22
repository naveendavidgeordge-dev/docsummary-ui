import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/auth.store';

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (res) => {
      setAuth(res.data.user, res.data.token);
      toast.success('Welcome back!');
      navigate('/dashboard');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to login');
    },
  });
};

export const useRegister = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (res) => {
      setAuth(res.data.user, res.data.token);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to register');
    },
  });
};
