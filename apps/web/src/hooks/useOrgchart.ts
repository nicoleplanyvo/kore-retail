import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export interface OrgUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  managerId: string | null;
  storeNames: string[];
}

export function useOrgchart() {
  return useQuery<OrgUser[]>({
    queryKey: ['orgchart'],
    queryFn: async () => {
      const data = await api<{ users: OrgUser[] }>('/api/orgchart');
      return data.users;
    },
  });
}

export function useSetManager() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { userId: string; managerId: string | null }) =>
      api('/api/orgchart/manager', { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orgchart'] });
    },
  });
}
