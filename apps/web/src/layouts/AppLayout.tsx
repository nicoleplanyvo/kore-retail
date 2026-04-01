import { useState, useCallback, useMemo, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Eye, X as XIcon } from 'lucide-react';
import { AppSidebar } from '../components/AppSidebar';
import { AppTopBar } from '../components/AppTopBar';
import { KeyboardShortcutsDialog } from '../components/KeyboardShortcutsDialog';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useAuthStore } from '../stores/authStore';
import { api } from '../lib/api';

const SIDEBAR_COLLAPSED_KEY = 'kore-sidebar-collapsed';

function readCollapsedPreference(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true';
  } catch {
    return false;
  }
}

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(readCollapsedPreference);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(sidebarCollapsed));
    } catch {
      // localStorage unavailable
    }
  }, [sidebarCollapsed]);

  const toggleSidebarCollapse = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  // Tenant Branding — CSS Custom Properties für Sidebar & Akzente
  const brandingStyle = useMemo(() => {
    const style: Record<string, string> = {};
    const branding = user?.tenantBranding;
    if (branding?.primaryColor) {
      style['--tenant-primary'] = branding.primaryColor;
    }
    if (branding?.accentColor) {
      style['--tenant-accent'] = branding.accentColor;
    }
    return style;
  }, [user?.tenantBranding]);

  const shortcuts = useCallback(() => [
    {
      key: 'h',
      description: 'Zur Startseite',
      handler: () => navigate('/app'),
    },
    {
      key: '?',
      shift: true,
      description: 'Tastenkürzel anzeigen',
      handler: () => setShortcutsOpen(prev => !prev),
    },
  ], [navigate]);

  useKeyboardShortcuts(shortcuts());

  const isImpersonating = !!user?.impersonatedBy;

  async function handleStopImpersonation() {
    try {
      const data = await api<{ accessToken: string; user: typeof user }>('/api/auth/stop-impersonation', {
        method: 'POST',
      });
      const { setAuth } = useAuthStore.getState();
      setAuth(data.user!, data.accessToken);
      navigate('/app');
    } catch {
      // Fallback: Seite neu laden
      window.location.href = '/app';
    }
  }

  return (
    <div className="flex h-screen overflow-hidden" style={brandingStyle}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-gray-900 focus:rounded focus:shadow-lg focus:text-sm"
      >
        Zum Hauptinhalt springen
      </a>
      <AppSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Impersonation Banner */}
        {isImpersonating && (
          <div className="bg-amber-500 text-white px-md py-xs flex items-center justify-center gap-md text-sm font-body flex-shrink-0">
            <Eye size={14} />
            <span>Du bist als <strong>{user?.name}</strong> angemeldet (Impersonation)</span>
            <button
              onClick={handleStopImpersonation}
              className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 transition-colors text-xs font-medium"
            >
              <XIcon size={12} />
              Zurück zum Admin
            </button>
          </div>
        )}
        <AppTopBar onMenuToggle={() => setSidebarOpen(true)} />
        <main id="main-content" role="main" className="flex-1 overflow-y-auto p-md sm:p-lg lg:p-xl bg-kore-bg">
          <Outlet />
        </main>
      </div>
      <KeyboardShortcutsDialog isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
}
