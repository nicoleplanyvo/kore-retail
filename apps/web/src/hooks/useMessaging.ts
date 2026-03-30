import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export interface ConversationPreview {
  id: string;
  isGroup: boolean;
  groupName: string | null;
  participants: Array<{ id: string; name: string; avatarUrl: string | null }>;
  lastMessage: { content: string; senderName: string; createdAt: string } | null;
  unreadCount: number;
}

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: { id: string; name: string; avatarUrl: string | null };
}

export interface Colleague {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: string;
}

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const data = await api<{ conversations: ConversationPreview[] }>('/api/messaging/conversations');
      return data.conversations;
    },
    refetchInterval: 10000,
  });
}

export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      const data = await api<{ messages: Message[] }>(
        `/api/messaging/conversations/${conversationId}/messages`,
      );
      return data.messages;
    },
    enabled: !!conversationId,
    refetchInterval: 5000,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: string; content: string }) =>
      api<Message>(`/api/messaging/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { participantIds: string[]; groupName?: string }) =>
      api<{ id: string; isGroup: boolean; groupName: string | null; created: boolean }>(
        '/api/messaging/conversations',
        { method: 'POST', body: JSON.stringify(data) },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['unread-count'],
    queryFn: async () => {
      const data = await api<{ count: number }>('/api/messaging/unread');
      return data.count;
    },
    refetchInterval: 30000,
  });
}

export function useColleagues() {
  return useQuery({
    queryKey: ['colleagues'],
    queryFn: () => api<Colleague[]>('/api/profile/colleagues'),
  });
}
