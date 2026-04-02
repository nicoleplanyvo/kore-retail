import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Loader2, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { useAuthStore } from '../stores/authStore';
import {
  useConversations,
  useMessages,
  useSendMessage,
  isCurrentlyAbsent,
  type ConversationPreview,
  type ConversationParticipant,
} from '../hooks/useMessaging';

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
}

function formatAbsentUntil(iso: string): string {
  return new Date(iso).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function getConversationName(conv: ConversationPreview): string {
  if (conv.isGroup && conv.groupName) return conv.groupName;
  return conv.participants.map((p) => p.name).join(', ') || 'Unbekannt';
}

/** Absence banner for a single participant. */
function AbsenceBanner({ participant }: { participant: ConversationParticipant }) {
  if (!isCurrentlyAbsent(participant)) return null;

  return (
    <div className="flex items-center gap-sm px-md py-sm bg-amber-50 border border-amber-200 text-amber-800 font-body text-small rounded-sm">
      <AlertTriangle size={14} className="flex-shrink-0" />
      <span>
        {participant.name} ist abwesend bis {formatAbsentUntil(participant.absentUntil!)}
      </span>
    </div>
  );
}

/** Left column: Conversation list */
function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: {
  conversations: ConversationPreview[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-col divide-y divide-kore-border overflow-y-auto">
      {conversations.length === 0 && (
        <div className="p-xl text-center">
          <MessageSquare size={24} className="text-kore-mid/30 mx-auto mb-sm" />
          <p className="font-body text-small text-kore-mid">Keine Unterhaltungen.</p>
        </div>
      )}
      {conversations.map((conv) => {
        const isSelected = conv.id === selectedId;
        const absentParticipants = conv.participants.filter(isCurrentlyAbsent);

        return (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`w-full text-left px-md py-md transition-colors ${
              isSelected ? 'bg-kore-surface' : 'hover:bg-kore-surface/50'
            }`}
          >
            <div className="flex items-center justify-between gap-sm">
              <span className="font-body text-small text-kore-ink font-medium truncate">
                {getConversationName(conv)}
              </span>
              {conv.unreadCount > 0 && (
                <span className="flex-shrink-0 w-5 h-5 bg-kore-brass text-kore-white text-[0.6rem] font-bold rounded-full flex items-center justify-center">
                  {conv.unreadCount}
                </span>
              )}
            </div>
            {conv.lastMessage && (
              <p className="font-body text-caption text-kore-mid mt-xs truncate">
                {conv.lastMessage.senderName}: {conv.lastMessage.content}
              </p>
            )}
            {conv.lastMessage && (
              <p className="font-body text-[0.6rem] text-kore-mid/60 mt-xs">
                {formatTime(conv.lastMessage.createdAt)}
              </p>
            )}
            {absentParticipants.length > 0 && (
              <p className="font-body text-[0.6rem] text-amber-600 mt-xs truncate">
                Abwesend: {absentParticipants.map((p) => p.name).join(', ')}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Right column: Message thread */
function MessageThread({
  conversation,
  onBack,
}: {
  conversation: ConversationPreview;
  onBack: () => void;
}) {
  const { user } = useAuthStore();
  const { data: messagesData, isLoading } = useMessages(conversation.id);
  const sendMessage = useSendMessage(conversation.id);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = messagesData?.messages ?? [];

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    await sendMessage.mutateAsync(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const absentParticipants = conversation.participants.filter(isCurrentlyAbsent);

  return (
    <div className="flex flex-col h-full">
      {/* Conversation header */}
      <div className="px-md py-md border-b border-kore-border flex items-center gap-md flex-shrink-0">
        <button
          onClick={onBack}
          className="sm:hidden text-kore-mid hover:text-kore-ink transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h3 className="font-body text-small text-kore-ink font-medium truncate">
          {getConversationName(conversation)}
        </h3>
      </div>

      {/* Absence banners */}
      {absentParticipants.length > 0 && (
        <div className="px-md py-sm flex flex-col gap-xs flex-shrink-0">
          {absentParticipants.map((p) => (
            <AbsenceBanner key={p.id} participant={p} />
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-md py-md flex flex-col gap-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-xl">
            <Loader2 size={18} className="animate-spin text-kore-mid" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center font-body text-small text-kore-mid py-xl">
            Noch keine Nachrichten.
          </p>
        ) : (
          [...messages].reverse().map((msg) => {
            const isOwn = msg.sender.id === user?.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[75%] ${isOwn ? 'self-end items-end' : 'self-start items-start'}`}
              >
                {!isOwn && (
                  <span className="font-body text-[0.6rem] text-kore-mid mb-xs">
                    {msg.sender.name}
                  </span>
                )}
                <div
                  className={`px-md py-sm rounded-lg font-body text-small ${
                    isOwn
                      ? 'bg-kore-brass text-kore-white'
                      : 'bg-kore-surface text-kore-ink'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="font-body text-[0.55rem] text-kore-mid/60 mt-xs">
                  {formatTime(msg.createdAt)}
                </span>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-md py-md border-t border-kore-border flex items-center gap-sm flex-shrink-0">
        <input
          type="text"
          placeholder="Nachricht schreiben..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-md py-sm border border-kore-border font-body text-small text-kore-ink placeholder:text-kore-mid focus:outline-none focus:border-kore-brass rounded-sm"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sendMessage.isPending}
          className="flex items-center justify-center w-[36px] h-[36px] bg-kore-ink text-kore-white rounded-sm hover:bg-kore-ink/90 transition-colors disabled:opacity-30"
        >
          {sendMessage.isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
        </button>
      </div>
    </div>
  );
}

export function MessagingPage() {
  const { data, isLoading } = useConversations();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const conversations = data?.conversations ?? [];
  const selectedConv = conversations.find((c) => c.id === selectedId) ?? null;

  return (
    <div>
      <Breadcrumb items={[{ label: 'Nachrichten' }]} />

      <div className="flex items-center gap-md mb-lg">
        <div className="w-10 h-10 bg-kore-surface flex items-center justify-center rounded-lg flex-shrink-0">
          <MessageSquare size={20} className="text-kore-ink" />
        </div>
        <div>
          <h1 className="font-display text-h2 sm:text-h1 text-kore-ink">Nachrichten</h1>
          <p className="font-body text-small text-kore-mid">
            Direkte Unterhaltungen mit Kollegen
          </p>
        </div>
      </div>

      <div className="bg-kore-white border border-kore-border rounded-sm overflow-hidden" style={{ height: 'calc(100vh - 240px)', minHeight: '400px' }}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 size={18} className="animate-spin text-kore-mid" />
          </div>
        ) : (
          <div className="flex h-full">
            {/* Conversation list — hidden on mobile when a conversation is selected */}
            <div
              className={`w-full sm:w-[280px] sm:min-w-[280px] border-r border-kore-border flex-shrink-0 overflow-y-auto ${
                selectedConv ? 'hidden sm:block' : 'block'
              }`}
            >
              <ConversationList
                conversations={conversations}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>

            {/* Message thread */}
            <div className={`flex-1 min-w-0 ${selectedConv ? 'block' : 'hidden sm:block'}`}>
              {selectedConv ? (
                <MessageThread
                  conversation={selectedConv}
                  onBack={() => setSelectedId(null)}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="font-body text-small text-kore-mid">
                    Unterhaltung auswaehlen
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
