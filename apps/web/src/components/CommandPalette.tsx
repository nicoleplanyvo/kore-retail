import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, BarChart3, Shield, Users, ClipboardCheck, BookOpen, MessageSquare, Briefcase, Eye, Package, User, Paintbrush } from 'lucide-react';

// All navigable items
const TOOL_ITEMS = [
  { label: 'Store Excellence Audit', path: '/app/tools/sea', category: 'Standards & Compliance', icon: Shield },
  { label: 'Checklisten', path: '/app/tools/checklisten', category: 'Standards & Compliance', icon: ClipboardCheck },
  { label: 'SOP Bibliothek', path: '/app/tools/sop', category: 'Standards & Compliance', icon: BookOpen },
  { label: 'VM Compliance', path: '/app/tools/vm-compliance', category: 'Standards & Compliance', icon: Eye },
  { label: 'Personalkosten-Planer', path: '/app/tools/store-standards', category: 'Standards & Compliance', icon: Shield },
  { label: 'KPI Dashboard', path: '/app/tools/kpi', category: 'Performance', icon: BarChart3 },
  { label: 'Budget Tracker', path: '/app/tools/budget', category: 'Performance', icon: BarChart3 },
  { label: 'Forecast', path: '/app/tools/forecast', category: 'Performance', icon: BarChart3 },
  { label: 'Loss Prevention', path: '/app/tools/loss-prevention', category: 'Performance', icon: Shield },
  { label: 'Inventur', path: '/app/tools/inventory', category: 'Performance', icon: Package },
  { label: 'Live Floor', path: '/app/tools/live-floor', category: 'Floor', icon: Eye },
  { label: 'FR Tracking', path: '/app/tools/fr-tracking', category: 'Floor', icon: Eye },
  { label: 'VM Guidelines', path: '/app/tools/vm-guidelines', category: 'Floor', icon: BookOpen },
  { label: 'Wartung', path: '/app/tools/maintenance', category: 'Floor', icon: Briefcase },
  { label: 'Training Hub', path: '/app/tools/training-hub', category: 'Training', icon: BookOpen },
  { label: 'Trainingstunden', path: '/app/tools/training-hours', category: 'Training', icon: BookOpen },
  { label: 'Challenges', path: '/app/tools/challenges', category: 'Training', icon: Briefcase },
  { label: 'Onboarding', path: '/app/tools/onboarding', category: 'Training', icon: Users },
  { label: 'Coaching', path: '/app/tools/coaching', category: 'People', icon: Users },
  { label: 'PDP/PIP', path: '/app/tools/pdp-pip', category: 'People', icon: Users },
  { label: 'Beurteilungen', path: '/app/tools/appraisals', category: 'People', icon: ClipboardCheck },
  { label: 'Schichtplanung', path: '/app/tools/shift-planning', category: 'People', icon: Briefcase },
  { label: 'Pulse Survey', path: '/app/tools/pulse-survey', category: 'People', icon: MessageSquare },
  { label: 'Wellbeing', path: '/app/tools/wellbeing', category: 'People', icon: Users },
  { label: 'Briefings', path: '/app/tools/briefings', category: 'Kommunikation', icon: MessageSquare },
  { label: 'Handover', path: '/app/tools/handover', category: 'Kommunikation', icon: MessageSquare },
  { label: 'Team Push', path: '/app/tools/team-push', category: 'Kommunikation', icon: MessageSquare },
  { label: 'Newsletter', path: '/app/tools/newsletter', category: 'Kommunikation', icon: MessageSquare },
  { label: 'FR Conversion', path: '/app/tools/fr-conversion', category: 'Customer', icon: BarChart3 },
  { label: 'Clienteling', path: '/app/tools/clienteling', category: 'Customer', icon: Users },
  { label: 'Stock Callouts', path: '/app/tools/stock-callouts', category: 'Customer', icon: Package },
  { label: 'Track & Trace', path: '/app/tools/track-trace', category: 'Customer', icon: Package },
  { label: 'Multi-Store', path: '/app/tools/multi-store', category: 'Regional', icon: BarChart3 },
  { label: 'RM Dashboard', path: '/app/tools/rm-dashboard', category: 'Regional', icon: BarChart3 },
];

const PAGE_ITEMS: Array<{ label: string; path: string; category: string; icon: typeof ArrowRight; external?: boolean }> = [
  { label: 'Startseite', path: '/app', category: 'Navigation', icon: ArrowRight },
  { label: 'Nachrichten', path: '/app/messaging', category: 'Platform', icon: MessageSquare },
  { label: 'Organigramm', path: '/app/orgchart', category: 'Platform', icon: Users },
  { label: 'Mein Profil', path: '/app/profile', category: 'Platform', icon: User },
  { label: 'Branding', path: '/app/branding', category: 'Platform', icon: Paintbrush },
  { label: 'Dashboard', path: 'https://dashboard.kore-retail.de', category: 'Navigation', icon: ArrowRight, external: true },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const allItems = [...PAGE_ITEMS, ...TOOL_ITEMS];

  const filtered = useMemo(() => {
    if (!query.trim()) return allItems;
    const q = query.toLowerCase();
    return allItems.filter(
      item => item.label.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.children[selectedIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  function handleSelect(item: typeof allItems[0]) {
    onClose();
    if ('external' in item && (item as Record<string, unknown>).external) {
      window.open(item.path, '_blank');
    } else {
      navigate(item.path);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      handleSelect(filtered[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="fixed inset-0 bg-black/50" />
      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden border border-gray-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <Search size={18} className="text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tool suchen oder navigieren..."
            className="flex-1 text-sm text-gray-900 placeholder-gray-400 outline-none bg-transparent"
          />
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-gray-400 bg-gray-100 rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Keine Ergebnisse für &ldquo;{query}&rdquo;</p>
          ) : (
            filtered.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleSelect(item)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    i === selectedIndex ? 'bg-amber-50 text-amber-900' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} className={i === selectedIndex ? 'text-amber-600' : 'text-gray-400'} />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium truncate block">{item.label}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider flex-shrink-0">{item.category}</span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-4 py-2 flex items-center gap-4 text-[10px] text-gray-400">
          <span><kbd className="px-1 py-0.5 bg-gray-100 rounded font-mono">&uarr;&darr;</kbd> navigieren</span>
          <span><kbd className="px-1 py-0.5 bg-gray-100 rounded font-mono">&crarr;</kbd> &ouml;ffnen</span>
          <span><kbd className="px-1 py-0.5 bg-gray-100 rounded font-mono">esc</kbd> schlie&szlig;en</span>
        </div>
      </div>
    </div>
  );
}
