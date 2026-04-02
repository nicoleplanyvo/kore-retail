import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  managerId: string | null;
  managerName: string | null;
  absentFrom: string | null;
  absentUntil: string | null;
}

export function useProfile() {
  return useQuery<ProfileData>({
    queryKey: ['profile'],
    queryFn: () => api<ProfileData>('/api/profile'),
  });
}

interface UpdateProfileInput {
  name: string;
  absentFrom: string | null;
  absentUntil: string | null;
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileInput) =>
      api<ProfileData>('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
