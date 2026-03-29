import { useState, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppSidebar } from '../components/AppSidebar';
import { AppTopBar } from '../components/AppTopBar';
import { KeyboardShortcutsDialog } from '../components/KeyboardShortcutsDialog';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const navigate = useNavigate();

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

  return (
    <div className="flex h-screen overflow-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-gray-900 focus:rounded focus:shadow-lg focus:text-sm"
      >
        Zum Hauptinhalt springen
      </a>
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <AppTopBar onMenuToggle={() => setSidebarOpen(true)} />
        <main id="main-content" role="main" className="flex-1 overflow-y-auto p-md sm:p-lg lg:p-xl bg-kore-bg">
          <Outlet />
        </main>
      </div>
      <KeyboardShortcutsDialog isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
}
