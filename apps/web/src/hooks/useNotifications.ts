import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { AppNotification } from '@kore/types';

// 30s polling for unread count badge
export function useUnreadNotificationCount() {
  return useQuery<{ count: number }>({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => api<{ count: number }>('/api/notifications/unread-count'),
    refetchInterval: 30_000,
  });
}

// Paginated notification list
export function useNotifications(page: number, unreadOnly: boolean) {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: '20',
    unreadOnly: unreadOnly ? 'true' : 'false',
  });
  return useQuery<{ data: AppNotification[]; total: number; page: number; pageSize: number }>({
    queryKey: ['notifications', 'list', page, unreadOnly],
    queryFn: () =>
      api<{ data: AppNotification[]; total: number; page: number; pageSize: number }>(
        `/api/notifications?${params}`,
      ),
  });
}

// Mark single notification as read
export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<void>(`/api/notifications/${id}/read`, { method: 'PUT' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// Mark all notifications as read
export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api<void>('/api/notifications/read-all', { method: 'PUT' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
