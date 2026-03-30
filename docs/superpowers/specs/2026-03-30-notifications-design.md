# In-App Notification System

## Goal
Add an in-app notification center to the KORE platform — a bell icon in the TopBar with unread badge, dropdown for recent notifications, and a full notifications page.

## Data Model

New Prisma model:
```prisma
model Notification {
  id        String   @id @default(cuid())
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      String   // e.g. "audit_completed", "checklist_overdue", "message_received", "invite_accepted"
  title     String
  body      String?
  link      String?  // relative URL, e.g. "/app/tools/sea/sessions/abc123"
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())

  @@index([userId, isRead, createdAt])
  @@index([tenantId])
}
```

Relations to add:
- `Tenant`: add `notifications Notification[]`
- `User`: add `notifications Notification[]`

## API Endpoints

All endpoints require authentication. Users can only access their own notifications.

### GET /api/notifications
Query params: `page` (default 1), `pageSize` (default 20), `unreadOnly` (default false)
Returns: `{ data: Notification[], total: number, page: number, pageSize: number }`
Sorted by `createdAt DESC`.

### GET /api/notifications/unread-count
Returns: `{ count: number }`

### PUT /api/notifications/:id/read
Mark single notification as read. Returns: `{ success: true }`
Validates the notification belongs to the requesting user.

### PUT /api/notifications/read-all
Mark all of the user's notifications as read. Returns: `{ success: true, updated: number }`

## Notification Helper

A server-side utility function for creating notifications from anywhere in the codebase:

```typescript
// apps/api/src/lib/notifications.ts
export async function createNotification(opts: {
  tenantId: string;
  userId: string;
  type: string;
  title: string;
  body?: string;
  link?: string;
}): Promise<void>
```

This function is called from route handlers when events occur. It does NOT send emails — purely in-app.

## Phase 1 Notification Triggers

Four triggers, implemented as calls to `createNotification()` in existing route handlers:

1. **Audit completed** (`audit_completed`)
   - When: AuditSession status changes to COMPLETED
   - Where: `routes/tools/store-excellence-audit/sessions.ts` PUT endpoint
   - Who: The store's assigned store_manager(s)
   - Title: "Audit abgeschlossen: {storeName}"
   - Link: `/app/tools/sea/sessions/{sessionId}`

2. **New message received** (`message_received`)
   - When: DirectMessage created
   - Where: `routes/messaging.ts` POST /conversations/:id/messages
   - Who: All other participants in the conversation
   - Title: "{senderName} hat eine Nachricht gesendet"
   - Link: `/app/messaging`

3. **Invitation accepted** (`invite_accepted`)
   - When: InvitationToken used (user activated)
   - Where: `routes/auth.ts` POST /accept-invite
   - Who: The user who created the invitation (the admin)
   - Title: "{userName} hat die Einladung angenommen"
   - Link: `/app/orgchart`

4. **Checklist overdue** (`checklist_overdue`)
   - Not triggered in real-time (would require a cron job)
   - Deferred to Phase 2 — not implemented in this spec

## Frontend Components

### NotificationBell (in AppTopBar)
- Bell icon with unread count badge (same styling as messaging badge)
- Click toggles a dropdown panel
- Dropdown shows max 10 most recent notifications
- Each item: icon by type, title, relative timestamp, unread dot indicator
- "Alle als gelesen markieren" button at top of dropdown
- "Alle Benachrichtigungen" link at bottom → navigates to /app/notifications
- Polling: 30s interval for unread count (same pattern as messaging)

### NotificationsPage (/app/notifications)
- Full-page list of all notifications with pagination
- Each notification: type icon, title, body (if present), relative timestamp
- Click on notification: mark as read + navigate to `link` (if present)
- "Alle als gelesen markieren" button
- Filter toggle: "Nur ungelesene"

### useNotifications Hook
- `useUnreadNotificationCount()` — 30s polling, returns count
- `useNotifications(page, unreadOnly)` — paginated list
- `useMarkRead()` — mutation for single notification
- `useMarkAllRead()` — mutation for all notifications

## Type Definitions

Add to `packages/types/src/index.ts`:
```typescript
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

## Not In Scope
- Email notifications (Phase 2)
- Push notifications (Phase 2)
- Checklist overdue trigger (needs cron, Phase 2)
- Notification preferences/settings per user
- WebSocket real-time delivery (polling is sufficient for now)

## Success Criteria
- Bell icon in TopBar shows unread count
- Dropdown shows recent notifications
- Clicking a notification navigates to the relevant page
- "Mark all read" clears the badge
- Notifications created when audits complete and messages are sent
- Tenant isolation: users only see their own notifications
