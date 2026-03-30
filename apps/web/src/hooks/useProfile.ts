import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, apiUpload } from '../lib/api';

interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  managerId: string | null;
  managerName: string | null;
}

interface Colleague {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarPath: string | null;
  managerId: string | null;
  isActive: boolean;
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => api<Profile>('/api/profile'),
  });
}

export function useColleagues() {
  return useQuery({
    queryKey: ['colleagues'],
    queryFn: () => api<Colleague[]>('/api/profile/colleagues'),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string }) => api<Profile>('/api/profile', { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['profile'] }); },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData();
      fd.append('avatar', file);
      return apiUpload<{ avatarUrl: string }>('/api/profile/avatar', fd);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['profile'] }); },
  });
}

export function useDeleteAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api('/api/profile/avatar', { method: 'DELETE' }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['profile'] }); },
  });
}
