# Notifications Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an in-app notification center with bell icon, unread badge, dropdown, full page, and notification triggers for audits, messages, and invitations.

**Architecture:** New Notification model in Prisma, REST API endpoints, server-side helper function called from existing route handlers, React frontend with polling-based unread count.

**Tech Stack:** Prisma/SQLite, Express, React, TanStack Query, Tailwind CSS

---

### Task 1: Prisma Schema + Types

**Files:**
- Modify: `apps/api/prisma/schema.prisma`
- Modify: `packages/types/src/index.ts`

- [ ] **Step 1: Add Notification model to schema**

Add to `apps/api/prisma/schema.prisma`:
```prisma
model Notification {
  id        String   @id @default(cuid())
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      String
  title     String
  body      String?
  link      String?
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())

  @@index([userId, isRead, createdAt])
  @@index([tenantId])
}
```

- [ ] **Step 2: Add relations to User and Tenant models**

On the User model, add:
```prisma
notifications Notification[]
```

On the Tenant model, add:
```prisma
notifications Notification[]
```

- [ ] **Step 3: Add AppNotification type**

Add to `packages/types/src/index.ts`:
```typescript
// === Notifications ===

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}
```

- [ ] **Step 4: Verify build**

```bash
cd /Users/nicolemunozbonilla/Desktop/KORE && npx turbo build --filter=@kore/types --force
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add apps/api/prisma/schema.prisma packages/types/src/index.ts
git commit -m "feat: add Notification model and AppNotification type"
```

---

### Task 2: Notification Helper + API Routes

**Files:**
- Create: `apps/api/src/lib/notifications.ts`
- Create: `apps/api/src/routes/notifications.ts`
- Modify: `apps/api/src/app.ts`

- [ ] **Step 1: Create notification helper**

Create `apps/api/src/lib/notifications.ts`:
```typescript
import prisma from './prisma.js';

export async function createNotification(opts: {
  tenantId: string;
  userId: string;
  type: string;
  title: string;
  body?: string;
  link?: string;
}): Promise<void> {
  await prisma.notification.create({
    data: {
      tenantId: opts.tenantId,
      userId: opts.userId,
      type: opts.type,
      title: opts.title,
      body: opts.body ?? null,
      link: opts.link ?? null,
    },
  });
}
```

- [ ] **Step 2: Create notification routes**

Create `apps/api/src/routes/notifications.ts`:
```typescript
import { Router, type Router as RouterType } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

export const notificationsRouter: RouterType = Router();
notificationsRouter.use(authenticate);

// GET /api/notifications — paginated list
notificationsRouter.get('/', async (req, res) => {
  try {
    const userId = req.user!.sub;
    const page = Math.max(1, parseInt(req.query['page'] as string) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(req.query['pageSize'] as string) || 20));
    const unreadOnly = req.query['unreadOnly'] === 'true';

    const where: Record<string, unknown> = { userId };
    if (unreadOnly) where['isRead'] = false;

    const [data, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true, type: true, title: true, body: true,
          link: true, isRead: true, createdAt: true,
        },
      }),
      prisma.notification.count({ where }),
    ]);

    res.json({ data, total, page, pageSize });
  } catch (err) {
    console.error('Notifications list error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// GET /api/notifications/unread-count
notificationsRouter.get('/unread-count', async (req, res) => {
  try {
    const count = await prisma.notification.count({
      where: { userId: req.user!.sub, isRead: false },
    });
    res.json({ count });
  } catch (err) {
    console.error('Unread count error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// PUT /api/notifications/read-all
notificationsRouter.put('/read-all', async (req, res) => {
  try {
    const result = await prisma.notification.updateMany({
      where: { userId: req.user!.sub, isRead: false },
      data: { isRead: true },
    });
    res.json({ success: true, updated: result.count });
  } catch (err) {
    console.error('Mark all read error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// PUT /api/notifications/:id/read
notificationsRouter.put('/:id/read', async (req, res) => {
  try {
    const notification = await prisma.notification.findUnique({
      where: { id: req.params['id'] },
    });

    if (!notification || notification.userId !== req.user!.sub) {
      res.status(404).json({ error: 'Benachrichtigung nicht gefunden.' });
      return;
    }

    await prisma.notification.update({
      where: { id: notification.id },
      data: { isRead: true },
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Mark read error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});
```

- [ ] **Step 3: Register route in app.ts**

Add import and route registration in `apps/api/src/app.ts`:
```typescript
import { notificationsRouter } from './routes/notifications.js';
// ... in createApp():
app.use('/api/notifications', notificationsRouter);
```

Place it near the other platform feature routes (profile, orgchart, messaging).

- [ ] **Step 4: Verify build**

```bash
cd /Users/nicolemunozbonilla/Desktop/KORE && npx turbo build --filter=@kore/api --force
```

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/lib/notifications.ts apps/api/src/routes/notifications.ts apps/api/src/app.ts
git commit -m "feat: add notification API routes and helper"
```

---

### Task 3: Notification Triggers in Existing Routes

**Files:**
- Modify: `apps/api/src/routes/messaging.ts`
- Modify: `apps/api/src/routes/auth.ts`

- [ ] **Step 1: Add message_received trigger**

In `apps/api/src/routes/messaging.ts`, in the POST `/conversations/:id/messages` handler, after the message is created successfully, add:

```typescript
import { createNotification } from '../lib/notifications.js';

// After message creation, notify other participants
const participants = await prisma.conversationParticipant.findMany({
  where: { conversationId: conversation.id, userId: { not: req.user!.sub } },
  select: { userId: true },
});

const sender = await prisma.user.findUnique({
  where: { id: req.user!.sub },
  select: { name: true, tenantId: true },
});

if (sender?.tenantId) {
  for (const p of participants) {
    await createNotification({
      tenantId: sender.tenantId,
      userId: p.userId,
      type: 'message_received',
      title: `${sender.name} hat eine Nachricht gesendet`,
      link: '/app/messaging',
    });
  }
}
```

- [ ] **Step 2: Add invite_accepted trigger**

In `apps/api/src/routes/auth.ts`, in the POST `/accept-invite` handler, after the user is activated and token marked as used, add:

```typescript
import { createNotification } from '../lib/notifications.js';

// After invite acceptance, notify the admin who created the invite
// Find who created the user (the admin who has the same tenantId)
if (user.tenantId) {
  // Find tenant admins to notify
  const admins = await prisma.user.findMany({
    where: {
      tenantId: user.tenantId,
      role: { in: ['tenant_admin', 'kore_admin'] },
      isActive: true,
      id: { not: user.id },
    },
    select: { id: true },
  });

  for (const admin of admins) {
    await createNotification({
      tenantId: user.tenantId,
      userId: admin.id,
      type: 'invite_accepted',
      title: `${user.name} hat die Einladung angenommen`,
      link: '/app/orgchart',
    });
  }
}
```

- [ ] **Step 3: Verify build**

```bash
cd /Users/nicolemunozbonilla/Desktop/KORE && npx turbo build --filter=@kore/api --force
```

- [ ] **Step 4: Commit**

```bash
git add apps/api/src/routes/messaging.ts apps/api/src/routes/auth.ts
git commit -m "feat: add notification triggers for messages and invitations"
```

---

### Task 4: Frontend Hook + NotificationBell Component

**Files:**
- Create: `apps/web/src/hooks/useNotifications.ts`
- Create: `apps/web/src/components/NotificationBell.tsx`
- Modify: `apps/web/src/components/AppTopBar.tsx`

- [ ] **Step 1: Create useNotifications hook**

Create `apps/web/src/hooks/useNotifications.ts`:
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { AppNotification, PaginatedResponse } from '@kore/types';

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => api<{ count: number }>('/api/notifications/unread-count'),
    select: (data) => data.count,
    refetchInterval: 30_000,
  });
}

export function useNotifications(page = 1, unreadOnly = false) {
  return useQuery({
    queryKey: ['notifications', 'list', page, unreadOnly],
    queryFn: () =>
      api<PaginatedResponse<AppNotification>>(
        `/api/notifications?page=${page}&pageSize=20${unreadOnly ? '&unreadOnly=true' : ''}`
      ),
  });
}

export function useRecentNotifications() {
  return useQuery({
    queryKey: ['notifications', 'recent'],
    queryFn: () =>
      api<PaginatedResponse<AppNotification>>('/api/notifications?page=1&pageSize=10'),
    select: (data) => data.data,
  });
}

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api(`/api/notifications/${id}/read`, { method: 'PUT' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      api('/api/notifications/read-all', { method: 'PUT' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
```

- [ ] **Step 2: Create NotificationBell component**

Create `apps/web/src/components/NotificationBell.tsx`:

A bell icon button that:
- Shows unread count badge (same style as messaging badge)
- On click, toggles a dropdown panel
- Dropdown has header "Benachrichtigungen" with "Alle gelesen" button
- Shows up to 10 recent notifications
- Each notification item: type icon, title, relative time, blue dot if unread
- Click on item: mark as read + navigate to link
- Footer: "Alle Benachrichtigungen" link to /app/notifications
- Close dropdown on click outside

Use these type-to-icon mappings:
- `message_received` → MessageSquare
- `audit_completed` → ClipboardCheck
- `invite_accepted` → UserPlus
- default → Bell

Relative time format in German: "vor X Min", "vor X Std", "vor X Tagen" (same pattern as MessagingPage).

Style: White dropdown, rounded-lg, shadow-xl, border, max-h-[400px] overflow-y-auto, positioned absolute right-0 top-full.

- [ ] **Step 3: Add NotificationBell to AppTopBar**

In `apps/web/src/components/AppTopBar.tsx`:
- Import NotificationBell
- Place it next to the messaging shortcut button (before the role badge)
- Remove any duplicate bell icon if present

- [ ] **Step 4: Verify build**

```bash
cd /Users/nicolemunozbonilla/Desktop/KORE && npx turbo build --filter=@kore/web --force
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/hooks/useNotifications.ts apps/web/src/components/NotificationBell.tsx apps/web/src/components/AppTopBar.tsx
git commit -m "feat: add NotificationBell component with unread badge and dropdown"
```

---

### Task 5: Notifications Full Page

**Files:**
- Create: `apps/web/src/pages/NotificationsPage.tsx`
- Modify: `apps/web/src/App.tsx`
- Modify: `apps/web/src/components/AppSidebar.tsx`

- [ ] **Step 1: Create NotificationsPage**

Create `apps/web/src/pages/NotificationsPage.tsx`:

A full-page notification list with:
- Breadcrumb: Home > Benachrichtigungen
- Header "Benachrichtigungen" with Bell icon
- "Alle als gelesen markieren" button (top right)
- Toggle filter: "Nur ungelesene" checkbox/button
- Paginated list of notifications
- Each item: type icon, title, body (if present), relative timestamp, unread indicator
- Click on item: mark as read + navigate to link
- Pagination controls at bottom
- Empty state: "Keine Benachrichtigungen" with muted icon

Follow existing KORE design patterns (bg-kore-white cards, kore-border, font-display headings, font-body text).

- [ ] **Step 2: Add route in App.tsx**

In `apps/web/src/App.tsx`:
- Import `NotificationsPage`
- Add route inside the protected AppLayout section:
```tsx
<Route path="/app/notifications" element={<NotificationsPage />} />
```

- [ ] **Step 3: Add sidebar link**

In `apps/web/src/components/AppSidebar.tsx`:
- Add a "Benachrichtigungen" NavLink in the Platform section (after Nachrichten, before Organigramm)
- Use the Bell icon from lucide-react
- Show unread notification count badge (import useUnreadNotificationCount from useNotifications hook)

- [ ] **Step 4: Add to CommandPalette**

If `apps/web/src/components/CommandPalette.tsx` exists, add Benachrichtigungen to the PAGE_ITEMS array.

- [ ] **Step 5: Verify build**

```bash
cd /Users/nicolemunozbonilla/Desktop/KORE && npx turbo build --filter=@kore/web --force
```

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/pages/NotificationsPage.tsx apps/web/src/App.tsx apps/web/src/components/AppSidebar.tsx apps/web/src/components/CommandPalette.tsx
git commit -m "feat: add notifications page, route, and sidebar link"
```

---

### Task 6: Tests for Notification API

**Files:**
- Create: `apps/api/src/__tests__/notifications.test.ts`

- [ ] **Step 1: Write notification API tests**

Create `apps/api/src/__tests__/notifications.test.ts`:

Tests:
- GET /api/notifications — returns empty list for user with no notifications
- GET /api/notifications — returns user's notifications sorted by createdAt desc
- GET /api/notifications — does NOT return other user's notifications (tenant isolation)
- GET /api/notifications?unreadOnly=true — filters to unread only
- GET /api/notifications/unread-count — returns correct count
- PUT /api/notifications/:id/read — marks as read
- PUT /api/notifications/:id/read — returns 404 for other user's notification
- PUT /api/notifications/read-all — marks all as read, returns updated count

Use `prisma.notification.create()` directly in tests to seed notification data.
Use `seedTwoTenants()` for user fixtures.

- [ ] **Step 2: Run all API tests**

```bash
cd /Users/nicolemunozbonilla/Desktop/KORE/apps/api && npx vitest run
```

Expected: All tests pass (existing + new).

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/__tests__/notifications.test.ts
git commit -m "test: add notification API tests"
```

---

### Task 7: Verify Full Suite

- [ ] **Step 1: Run all API tests**

```bash
cd /Users/nicolemunozbonilla/Desktop/KORE/apps/api && npx vitest run
```

- [ ] **Step 2: Run all frontend tests**

```bash
cd /Users/nicolemunozbonilla/Desktop/KORE/apps/web && npx vitest run
```

- [ ] **Step 3: Build all apps**

```bash
cd /Users/nicolemunozbonilla/Desktop/KORE && npx turbo build --filter=@kore/api --filter=@kore/web --force
```

Expected: All tests pass, all builds succeed.
