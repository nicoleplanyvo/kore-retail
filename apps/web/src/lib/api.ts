const API_URL = import.meta.env.VITE_API_URL || '';

let accessToken: string | null = null;
let isRefreshing = false; // Verhindert Token-Refresh-Loop

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

async function refreshAccessToken(): Promise<string | null> {
  // Schutz vor Re-Entrancy / Endlosschleife
  if (isRefreshing) return null;
  isRefreshing = true;

  try {
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) {
      // Refresh fehlgeschlagen — Session abgelaufen
      handleSessionExpired();
      return null;
    }
    const data = await res.json();
    accessToken = data.accessToken;
    return data.accessToken;
  } catch {
    return null;
  } finally {
    isRefreshing = false;
  }
}

/**
 * Session abgelaufen — Token löschen, zum Login weiterleiten.
 * Wird nur aufgerufen wenn auch der Refresh-Token abgelaufen ist.
 * AuthInitializer in main.tsx wird beim nächsten Laden den State aufräumen.
 */
function handleSessionExpired() {
  accessToken = null;
  // Nur weiterleiten wenn wir nicht schon auf einer öffentlichen Seite sind
  const publicPaths = ['/login', '/invite', '/forgot-password', '/reset-password', '/', '/consulting', '/training', '/suite', '/about', '/contact', '/audit', '/legal', '/blog'];
  const isPublic = publicPaths.some(p => window.location.pathname === p || window.location.pathname.startsWith(p + '/'));
  if (!isPublic) {
    window.location.href = '/login';
  }
}

export async function api<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  let res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  // Automatischer Token-Refresh bei 401 (einmalig, kein Loop)
  if (res.status === 401 && accessToken) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Netzwerkfehler' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export { API_URL };

/** Upload-Request mit FormData (kein Content-Type Header — Browser setzt multipart) */
export async function apiUpload<T = unknown>(
  path: string,
  formData: FormData,
): Promise<T> {
  const url = `${API_URL}${path}`;
  const headers: Record<string, string> = {};
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

  let res = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
    credentials: 'include',
  });

  if (res.status === 401 && accessToken) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include',
      });
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Netzwerkfehler' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}
