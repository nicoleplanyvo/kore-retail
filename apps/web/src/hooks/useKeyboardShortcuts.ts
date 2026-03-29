import { useEffect } from 'react';

type ShortcutHandler = () => void;

interface Shortcut {
  key: string;
  meta?: boolean;  // Cmd on Mac, Ctrl on Windows
  shift?: boolean;
  handler: ShortcutHandler;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger in input/textarea/select
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      for (const s of shortcuts) {
        const metaMatch = s.meta ? (e.metaKey || e.ctrlKey) : true;
        const shiftMatch = s.shift ? e.shiftKey : !e.shiftKey;
        if (e.key.toLowerCase() === s.key.toLowerCase() && metaMatch && shiftMatch) {
          e.preventDefault();
          s.handler();
          return;
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// Exportable shortcut descriptions for help dialog
export const GLOBAL_SHORTCUTS = [
  { key: 'k', meta: true, description: 'Suche öffnen' },
  { key: '/', meta: false, description: 'Suche öffnen' },
  { key: 'h', meta: false, description: 'Zur Startseite' },
  { key: '?', meta: false, shift: true, description: 'Tastenkürzel anzeigen' },
];
