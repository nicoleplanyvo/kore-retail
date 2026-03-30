import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from 'react';
import { MessageSquare, Send, ArrowLeft, Plus, Search, User } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { useToast } from '../components/Toast';
import { useAuthStore } from '../stores/authStore';
import {
  useConversations,
  useMessages,
  useSendMessage,
  useCreateConversation,
  useColleagues,
  type ConversationPreview,
} from '../hooks/useMessaging';

/* ---------- Relative time helper ---------- */

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Jetzt';
  if (mins < 60) return `vor ${mins} Min.`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `vor ${hours} Std.`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Gestern';
  if (days < 7) return `vor ${days} Tagen`;
  return new Date(dateStr).toLocaleDateString('de-DE');
}

/* ---------- Avatar helper ---------- */

function Avatar({ name, avatarUrl, size = 32 }: { name: string; avatarUrl?: string | null; size?: number }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      className="rounded-full bg-kore-brass/20 text-kore-brass flex items-center justify-center flex-shrink-0 font-medium"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}

/* ---------- Conversation display name ---------- */

function conversationName(conv: ConversationPreview, currentUserId: string | undefined): string {
  if (conv.isGroup && conv.groupName) return conv.groupName;
  const others = conv.participants.filter((p) => p.id !== currentUserId);
  if (others.length === 0) return 'Ich';
  return others.map((p) => p.name).join(', ');
}

function conversationAvatar(conv: ConversationPreview, currentUserId: string | undefined) {
  const others = conv.participants.filter((p) => p.id !== currentUserId);
  if (others.length === 1) return others[0];
  return null;
}

/* ---------- New conversation dialog ---------- */

function NewConversationDialog({
  onSelect,
  onClose,
}: {
  onSelect: (colleagueId: string) => void;
  onClose: () => void;
}) {
  const { data: colleagues, isLoading } = useColleagues();
  const [search, setSearch] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const filtered = (colleagues ?? []).filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      ref={dialogRef}
      className="absolute top-full left-0 right-0 mt-1 bg-kore-white border border-kore-border rounded-lg shadow-lg z-50 max-h-80 flex flex-col"
    >
      <div className="p-2 border-b border-kore-border">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-kore-mid" />
          <input
            type="text"
            placeholder="Kollegen suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-kore-bg border border-kore-border rounded-md focus:outline-none focus:ring-1 focus:ring-kore-brass/40 text-kore-ink placeholder:text-kore-mid"
            autoFocus
          />
        </div>
      </div>
      <div className="overflow-y-auto flex-1">
        {isLoading && (
          <div className="p-4 text-center text-sm text-kore-mid">Laden...</div>
        )}
        {!isLoading && filtered.length === 0 && (
          <div className="p-4 text-center text-sm text-kore-mid">Keine Kollegen gefunden</div>
        )}
        {filtered.map((colleague) => (
          <button
            key={colleague.id}
            onClick={() => onSelect(colleague.id)}
            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-kore-surface transition-colors text-left"
          >
            <Avatar name={colleague.name} avatarUrl={colleague.avatarUrl} size={28} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-kore-ink truncate">{colleague.name}</p>
              <p className="text-xs text-kore-mid truncate">{colleague.email}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Conversation list item ---------- */

function ConversationItem({
  conv,
  isActive,
  currentUserId,
  onClick,
}: {
  conv: ConversationPreview;
  isActive: boolean;
  currentUserId: string | undefined;
  onClick: () => void;
}) {
  const name = conversationName(conv, currentUserId);
  const avatar = conversationAvatar(conv, currentUserId);

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-start gap-3 px-4 py-3 transition-colors text-left ${
        isActive ? 'bg-kore-surface' : 'hover:bg-kore-bg'
      }`}
    >
      {avatar ? (
        <Avatar name={avatar.name} avatarUrl={avatar.avatarUrl} size={40} />
      ) : (
        <div className="w-10 h-10 rounded-full bg-kore-brass/20 text-kore-brass flex items-center justify-center flex-shrink-0">
          <User size={18} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-kore-ink truncate">{name}</p>
          {conv.lastMessage && (
            <span className="text-[11px] text-kore-mid flex-shrink-0">
              {relativeTime(conv.lastMessage.createdAt)}
            </span>
          )}
        </div>
        {conv.lastMessage && (
          <p className="text-xs text-kore-mid truncate mt-0.5">
            {conv.lastMessage.senderName}: {conv.lastMessage.content}
          </p>
        )}
      </div>
      {conv.unreadCount > 0 && (
        <span className="mt-1 flex-shrink-0 bg-kore-brass text-kore-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {conv.unreadCount}
        </span>
      )}
    </button>
  );
}

/* ---------- Message input ---------- */

function MessageInput({
  onSend,
  isPending,
}: {
  onSend: (content: string) => void;
  isPending: boolean;
}) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || isPending) return;
    onSend(trimmed);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [text, isPending, onSend]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    }
  };

  return (
    <div className="border-t border-kore-border p-3 bg-kore-white">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleInput();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Nachricht schreiben..."
          rows={1}
          className="flex-1 resize-none bg-kore-bg border border-kore-border rounded-lg px-3 py-2 text-sm text-kore-ink placeholder:text-kore-mid focus:outline-none focus:ring-1 focus:ring-kore-brass/40 max-h-[120px]"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || isPending}
          className="flex-shrink-0 p-2 rounded-lg bg-kore-brass text-kore-white hover:bg-kore-brass/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Senden"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

/* ---------- Main page ---------- */

export default function MessagingPage() {
  const user = useAuthStore((s) => s.user);
  const toast = useToast();

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const [showNewDialog, setShowNewDialog] = useState(false);

  const { data: conversations, isLoading: convsLoading } = useConversations();
  const { data: messages } = useMessages(activeConversationId);
  const sendMutation = useSendMessage();
  const createMutation = useCreateConversation();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const activeConversation = conversations?.find((c) => c.id === activeConversationId) ?? null;

  const selectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    setMobileView('chat');
  }, []);

  const handleBack = useCallback(() => {
    setMobileView('list');
  }, []);

  const handleNewConversation = useCallback(
    async (colleagueId: string) => {
      setShowNewDialog(false);
      try {
        const result = await createMutation.mutateAsync({ participantIds: [colleagueId] });
        setActiveConversationId(result.id);
        setMobileView('chat');
      } catch {
        toast.error('Unterhaltung konnte nicht erstellt werden.');
      }
    },
    [createMutation, toast],
  );

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!activeConversationId) return;
      sendMutation.mutate(
        { conversationId: activeConversationId, content },
        {
          onError: () => toast.error('Nachricht konnte nicht gesendet werden.'),
        },
      );
    },
    [activeConversationId, sendMutation, toast],
  );

  /* ---------- Render: Conversation list panel ---------- */

  const conversationList = (
    <div className="flex flex-col h-full bg-kore-white border-r border-kore-border">
      {/* Header */}
      <div className="p-4 border-b border-kore-border relative">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-semibold text-kore-ink">Nachrichten</h2>
          <button
            onClick={() => setShowNewDialog((v) => !v)}
            className="p-1.5 rounded-md hover:bg-kore-surface transition-colors text-kore-ink"
            aria-label="Neue Unterhaltung"
          >
            <Plus size={18} />
          </button>
        </div>
        {showNewDialog && (
          <NewConversationDialog
            onSelect={handleNewConversation}
            onClose={() => setShowNewDialog(false)}
          />
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {convsLoading && (
          <div className="p-6 text-center text-sm text-kore-mid">Laden...</div>
        )}
        {!convsLoading && (!conversations || conversations.length === 0) && (
          <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
            <MessageSquare size={40} className="text-kore-mid/40 mb-3" />
            <p className="text-sm text-kore-mid">
              Noch keine Unterhaltungen.
            </p>
            <p className="text-xs text-kore-mid mt-1">
              Klicken Sie auf <strong>+</strong>, um eine neue zu starten.
            </p>
          </div>
        )}
        {conversations?.map((conv) => (
          <ConversationItem
            key={conv.id}
            conv={conv}
            isActive={conv.id === activeConversationId}
            currentUserId={user?.id}
            onClick={() => selectConversation(conv.id)}
          />
        ))}
      </div>
    </div>
  );

  /* ---------- Render: Messages panel ---------- */

  const chatHeaderName = activeConversation
    ? conversationName(activeConversation, user?.id)
    : '';

  const chatHeaderAvatar = activeConversation
    ? conversationAvatar(activeConversation, user?.id)
    : null;

  const messagesPanel = (
    <div className="flex flex-col h-full bg-kore-bg">
      {activeConversation ? (
        <>
          {/* Chat header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-kore-white border-b border-kore-border">
            <button
              onClick={handleBack}
              className="md:hidden p-1 -ml-1 rounded-md hover:bg-kore-surface transition-colors text-kore-ink"
              aria-label="Zurueck"
            >
              <ArrowLeft size={20} />
            </button>
            {chatHeaderAvatar ? (
              <Avatar
                name={chatHeaderAvatar.name}
                avatarUrl={chatHeaderAvatar.avatarUrl}
                size={32}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-kore-brass/20 text-kore-brass flex items-center justify-center flex-shrink-0">
                <User size={16} />
              </div>
            )}
            <h3 className="text-sm font-semibold text-kore-ink truncate">{chatHeaderName}</h3>
          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
          >
            {(!messages || messages.length === 0) && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-sm text-kore-mid">
                  Noch keine Nachrichten. Schreiben Sie die erste!
                </p>
              </div>
            )}
            {messages?.map((msg) => {
              const isOwn = msg.sender.id === user?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[75%] ${isOwn ? 'flex-row-reverse' : ''}`}>
                    <Avatar
                      name={msg.sender.name}
                      avatarUrl={msg.sender.avatarUrl}
                      size={24}
                    />
                    <div>
                      {!isOwn && (
                        <p className="text-[11px] text-kore-mid mb-0.5 px-1">
                          {msg.sender.name}
                        </p>
                      )}
                      <div
                        className={`rounded-xl px-3 py-2 text-sm leading-relaxed ${
                          isOwn
                            ? 'bg-kore-brass/15 text-kore-ink'
                            : 'bg-kore-white border border-kore-border text-kore-ink'
                        }`}
                      >
                        {msg.content.split('\n').map((line, i) => (
                          <span key={i}>
                            {line}
                            {i < msg.content.split('\n').length - 1 && <br />}
                          </span>
                        ))}
                      </div>
                      <p
                        className={`text-[10px] text-kore-mid mt-0.5 px-1 ${
                          isOwn ? 'text-right' : ''
                        }`}
                      >
                        {relativeTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <MessageInput onSend={handleSendMessage} isPending={sendMutation.isPending} />
        </>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center h-full text-center px-6">
          <MessageSquare size={48} className="text-kore-mid/30 mb-4" />
          <p className="text-base font-medium text-kore-ink mb-1">Nachrichten</p>
          <p className="text-sm text-kore-mid max-w-xs">
            Starten Sie eine Unterhaltung mit einem Kollegen
          </p>
        </div>
      )}
    </div>
  );

  /* ---------- Render: Full page ---------- */

  return (
    <div className="min-h-screen flex flex-col">
      {/* Breadcrumb - only visible on desktop */}
      <div className="px-4 pt-4 hidden md:block">
        <Breadcrumb items={[{ label: 'Nachrichten' }]} />
      </div>

      {/* Split-pane layout */}
      <div className="flex-1 flex overflow-hidden" style={{ height: 'calc(100vh - 80px)' }}>
        {/* Desktop: both panels visible. Mobile: toggle based on mobileView */}

        {/* Conversation list */}
        <div
          className={`w-full md:w-80 md:flex-shrink-0 md:block ${
            mobileView === 'list' ? 'block' : 'hidden'
          }`}
        >
          {conversationList}
        </div>

        {/* Messages */}
        <div
          className={`flex-1 w-full md:block ${
            mobileView === 'chat' ? 'block' : 'hidden'
          }`}
        >
          {messagesPanel}
        </div>
      </div>
    </div>
  );
}
