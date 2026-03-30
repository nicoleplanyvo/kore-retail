import { useEffect } from 'react';
import { GLOBAL_SHORTCUTS } from '../hooks/useKeyboardShortcuts';

interface KeyboardShortcutsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsDialog({ isOpen, onClose }: KeyboardShortcutsDialogProps) {
  useEffect(() => {
    if (!isOpen) return;
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isMac = navigator.platform.toUpperCase().includes('MAC');
  const metaKey = isMac ? '\u2318' : 'Ctrl';

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" onClick={onClose}>
      <div className="fixed inset-0 bg-black/40" />
      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Tastenkürzel"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Tastenkürzel</h2>
        </div>
        <div className="px-5 py-3 space-y-2">
          {GLOBAL_SHORTCUTS.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-1.5">
              <span className="text-sm text-gray-600">{s.description}</span>
              <kbd className="inline-flex items-center gap-1 px-2 py-1 text-xs font-mono text-gray-500 bg-gray-100 rounded border border-gray-200">
                {s.meta && <span>{metaKey}</span>}
                {s.shift && <span>{'\u21E7'}</span>}
                <span>{s.key.toUpperCase()}</span>
              </kbd>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">Drücke ESC zum Schließen</p>
        </div>
      </div>
    </div>
  );
}
