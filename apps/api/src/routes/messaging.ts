import { Router, type Router as RouterType } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { createNotification } from '../lib/notifications.js';

export const messagingRouter: RouterType = Router();
messagingRouter.use(authenticate);

// ── GET /conversations ─────────────────────────────
// List user's conversations with last message preview, participants, unread count
messagingRouter.get('/conversations', async (req, res) => {
  try {
    const userId = req.user!.sub;

    // Find all conversations where the current user is a participant
    const participantEntries = await prisma.conversationParticipant.findMany({
      where: { userId },
      select: { conversationId: true, lastReadAt: true },
    });

    if (participantEntries.length === 0) {
      res.json({ conversations: [] });
      return;
    }

    const conversationIds = participantEntries.map((p: { conversationId: string }) => p.conversationId);
    const lastReadMap = new Map(
      participantEntries.map((p: { conversationId: string; lastReadAt: Date | null }) => [p.conversationId, p.lastReadAt]),
    );

    // Fetch conversations with participants and latest message
    const conversations = await prisma.conversation.findMany({
      where: { id: { in: conversationIds } },
      include: {
        participants: {
          include: {
            user: { select: { id: true, name: true, avatarPath: true } },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: { select: { name: true } },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Build response with unread counts
    const result = await Promise.all(
      conversations.map(async (conv: any) => {
        const lastReadAt = lastReadMap.get(conv.id);

        // Count unread messages: sent after lastReadAt, not by current user
        const unreadWhere: Record<string, unknown> = {
          conversationId: conv.id,
          senderId: { not: userId },
        };
        if (lastReadAt) {
          unreadWhere['createdAt'] = { gt: lastReadAt };
        }
        const unreadCount = await prisma.directMessage.count({ where: unreadWhere });

        const lastMsg = conv.messages[0] ?? null;

        return {
          id: conv.id,
          isGroup: conv.isGroup,
          groupName: conv.groupName,
          participants: conv.participants
            .filter((p: any) => p.userId !== userId)
            .map((p: any) => ({
              id: p.user.id,
              name: p.user.name,
              avatarUrl: p.user.avatarPath,
            })),
          lastMessage: lastMsg
            ? {
                content: lastMsg.content,
                senderName: lastMsg.sender.name,
                createdAt: lastMsg.createdAt.toISOString(),
              }
            : null,
          unreadCount,
        };
      }),
    );

    // Sort by latest message (conversations with messages first, then by message time desc)
    result.sort((a: any, b: any) => {
      if (!a.lastMessage && !b.lastMessage) return 0;
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime();
    });

    res.json({ conversations: result });
  } catch (err) {
    console.error('Messaging conversations error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ── POST /conversations ────────────────────────────
// Create a new conversation (or return existing 1:1)
messagingRouter.post('/conversations', async (req, res) => {
  try {
    const userId = req.user!.sub;
    const tenantId = req.user!.tenantId;
    const { participantIds, groupName } = req.body as {
      participantIds?: string[];
      groupName?: string;
    };

    if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      res.status(400).json({ error: 'Mindestens ein Teilnehmer erforderlich.' });
      return;
    }

    // Remove duplicates and ensure current user is not in the list
    const otherIds = [...new Set(participantIds)].filter((id) => id !== userId);
    if (otherIds.length === 0) {
      res.status(400).json({ error: 'Mindestens ein anderer Teilnehmer erforderlich.' });
      return;
    }

    // Verify all participants belong to the same tenant
    const participants = await prisma.user.findMany({
      where: { id: { in: otherIds }, tenantId },
      select: { id: true },
    });

    if (participants.length !== otherIds.length) {
      res.status(400).json({ error: 'Alle Teilnehmer müssen zum selben Mandanten gehören.' });
      return;
    }

    const allParticipantIds = [userId, ...otherIds];
    const isGroup = allParticipantIds.length > 2;

    // For 1:1 conversations, check if one already exists
    if (!isGroup) {
      const targetUserId = otherIds[0]!;

      // Find conversations where isGroup=false, and both users are participants
      const existingConversations = await prisma.conversation.findMany({
        where: {
          isGroup: false,
          participants: {
            every: {
              userId: { in: [userId, targetUserId] },
            },
          },
        },
        include: {
          participants: true,
        },
      });

      // Filter to conversations with exactly 2 participants (both current user and target)
      const existing = existingConversations.find(
        (c: any) =>
          c.participants.length === 2 &&
          c.participants.some((p: any) => p.userId === userId) &&
          c.participants.some((p: any) => p.userId === targetUserId),
      );

      if (existing) {
        res.json({ id: existing.id, isGroup: false, groupName: null, created: false });
        return;
      }
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        tenantId: tenantId!,
        isGroup,
        groupName: isGroup ? (groupName ?? null) : null,
        participants: {
          create: allParticipantIds.map((id) => ({
            userId: id,
            lastReadAt: new Date(),
          })),
        },
      },
    });

    res.status(201).json({ id: conversation.id, isGroup, groupName: conversation.groupName, created: true });
  } catch (err) {
    console.error('Create conversation error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ── GET /conversations/:id/messages ────────────────
// Get paginated messages for a conversation (newest-first)
messagingRouter.get('/conversations/:id/messages', async (req, res) => {
  try {
    const userId = req.user!.sub;
    const conversationId = req.params['id']!;
    const before = req.query['before'] as string | undefined;
    const limit = Math.min(100, Math.max(1, Number(req.query['limit']) || 50));

    // Verify user is a participant
    const participant = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });

    if (!participant) {
      res.status(403).json({ error: 'Kein Zugriff auf diese Unterhaltung.' });
      return;
    }

    // Build cursor-based pagination
    const where: Record<string, unknown> = { conversationId };
    if (before) {
      // Get the createdAt of the cursor message for comparison
      const cursorMsg = await prisma.directMessage.findUnique({
        where: { id: before },
        select: { createdAt: true },
      });
      if (cursorMsg) {
        where['createdAt'] = { lt: cursorMsg.createdAt };
      }
    }

    const messages = await prisma.directMessage.findMany({
      where,
      include: {
        sender: { select: { id: true, name: true, avatarPath: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Fetch all other participants' lastReadAt to determine read receipts
    const otherParticipants = await prisma.conversationParticipant.findMany({
      where: { conversationId, userId: { not: userId } },
      select: { userId: true, lastReadAt: true },
    });

    // Update lastReadAt for this user
    await prisma.conversationParticipant.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: { lastReadAt: new Date() },
    });

    res.json({
      messages: messages.map((m: any) => {
        const isOwn = m.senderId === userId;
        // For own messages: check which other participants have read it
        const readByOthers = isOwn
          ? otherParticipants.filter(
              (p: { lastReadAt: Date | null }) =>
                p.lastReadAt && p.lastReadAt >= m.createdAt,
            )
          : [];
        const totalOthers = otherParticipants.length;

        return {
          id: m.id,
          content: m.content,
          createdAt: m.createdAt.toISOString(),
          sender: {
            id: m.sender.id,
            name: m.sender.name,
            avatarUrl: m.sender.avatarPath,
          },
          // Read receipt info (only meaningful for own messages)
          readByCount: readByOthers.length,
          totalRecipients: totalOthers,
          allRead: isOwn && totalOthers > 0 && readByOthers.length >= totalOthers,
          // For 1:1: include the exact readAt timestamp of the other person
          readAt:
            isOwn && readByOthers.length > 0 && totalOthers === 1
              ? (readByOthers[0] as { lastReadAt: Date }).lastReadAt.toISOString()
              : null,
        };
      }),
    });
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ── POST /conversations/:id/messages ───────────────
// Send a message to a conversation
messagingRouter.post('/conversations/:id/messages', async (req, res) => {
  try {
    const userId = req.user!.sub;
    const conversationId = req.params['id']!;
    const { content } = req.body as { content?: string };

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      res.status(400).json({ error: 'Nachricht darf nicht leer sein.' });
      return;
    }

    // Verify user is a participant
    const participant = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });

    if (!participant) {
      res.status(403).json({ error: 'Kein Zugriff auf diese Unterhaltung.' });
      return;
    }

    // Create message and update conversation's updatedAt
    const [message] = await Promise.all([
      prisma.directMessage.create({
        data: {
          conversationId,
          senderId: userId,
          content: content.trim(),
        },
        include: {
          sender: { select: { id: true, name: true, avatarPath: true } },
        },
      }),
      prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      }),
    ]);

    res.status(201).json({
      id: message.id,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
      sender: {
        id: message.sender.id,
        name: message.sender.name,
        avatarUrl: message.sender.avatarPath,
      },
    });

    // ── Notification trigger: notify other participants ──
    try {
      const tenantId = req.user!.tenantId;
      if (tenantId) {
        const participants = await prisma.conversationParticipant.findMany({
          where: { conversationId, userId: { not: userId } },
          select: { userId: true },
        });

        const senderName = message.sender.name;

        for (const p of participants) {
          await createNotification({
            tenantId,
            userId: p.userId,
            type: 'message_received',
            title: `${senderName} hat eine Nachricht gesendet`,
            link: '/app/messaging',
          });
        }
      }
    } catch (notifErr) {
      console.error('Notification error (message_received):', notifErr);
    }
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ── POST /conversations/:id/mark-read ─────────────
// Explicitly mark a conversation as read (e.g. when opened)
messagingRouter.post('/conversations/:id/mark-read', async (req, res) => {
  try {
    const userId = req.user!.sub;
    const conversationId = req.params['id']!;

    const participant = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });

    if (!participant) {
      res.status(403).json({ error: 'Kein Zugriff auf diese Unterhaltung.' });
      return;
    }

    await prisma.conversationParticipant.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: { lastReadAt: new Date() },
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Mark-read error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// ── GET /unread ────────────────────────────────────
// Get total unread message count across all conversations (for badge)
messagingRouter.get('/unread', async (req, res) => {
  try {
    const userId = req.user!.sub;

    // Get all conversations the user participates in with their lastReadAt
    const participantEntries = await prisma.conversationParticipant.findMany({
      where: { userId },
      select: { conversationId: true, lastReadAt: true },
    });

    if (participantEntries.length === 0) {
      res.json({ count: 0 });
      return;
    }

    // Count unread messages across all conversations
    let totalUnread = 0;
    for (const entry of participantEntries) {
      const where: Record<string, unknown> = {
        conversationId: entry.conversationId,
        senderId: { not: userId },
      };
      if (entry.lastReadAt) {
        where['createdAt'] = { gt: entry.lastReadAt };
      }
      const count = await prisma.directMessage.count({ where });
      totalUnread += count;
    }

    res.json({ count: totalUnread });
  } catch (err) {
    console.error('Unread count error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});
