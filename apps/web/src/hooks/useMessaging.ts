import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export interface ConversationParticipant {
  id: string;
  name: string;
  avatarUrl: string | null;
  absentFrom: string | null;
  absentUntil: string | null;
}

export interface ConversationPreview {
  id: string;
  isGroup: boolean;
  groupName: string | null;
  participants: ConversationParticipant[];
  lastMessage: {
    content: string;
    senderName: string;
    createdAt: string;
  } | null;
  unreadCount: number;
}

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}

export function useConversations() {
  return useQuery<{ conversations: ConversationPreview[] }>({
    queryKey: ['messaging', 'conversations'],
    queryFn: () => api<{ conversations: ConversationPreview[] }>('/api/messaging/conversations'),
    refetchInterval: 15_000,
  });
}

export function useMessages(conversationId: string | null) {
  return useQuery<{ messages: Message[] }>({
    queryKey: ['messaging', 'messages', conversationId],
    queryFn: () =>
      api<{ messages: Message[] }>(`/api/messaging/conversations/${conversationId}/messages`),
    enabled: !!conversationId,
    refetchInterval: 10_000,
  });
}

export function useSendMessage(conversationId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) =>
      api<Message>(`/api/messaging/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['messaging'] });
    },
  });
}

export function useCreateConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (participantIds: string[]) =>
      api<{ id: string }>('/api/messaging/conversations', {
        method: 'POST',
        body: JSON.stringify({ participantIds }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['messaging', 'conversations'] });
    },
  });
}

export function useUnreadMessageCount() {
  return useQuery<{ count: number }>({
    queryKey: ['messaging', 'unread'],
    queryFn: () => api<{ count: number }>('/api/messaging/unread'),
    refetchInterval: 30_000,
  });
}

/**
 * Check if a participant is currently absent.
 */
export function isCurrentlyAbsent(participant: ConversationParticipant): boolean {
  if (!participant.absentUntil) return false;
  const now = new Date();
  const until = new Date(participant.absentUntil);
  const from = participant.absentFrom ? new Date(participant.absentFrom) : null;
  if (from && now < from) return false;
  return now <= until;
}
