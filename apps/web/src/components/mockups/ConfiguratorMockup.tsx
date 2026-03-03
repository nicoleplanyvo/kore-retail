import { BarChart3, GraduationCap, Calendar, ClipboardCheck, MessageSquare, ShoppingBag, Plus } from 'lucide-react';

/**
 * CSS-basiertes Mockup eines modularen Dashboard-Konfigurators.
 * Zeigt: Sidebar mit Modul-Toggles, Hauptbereich mit aktiven Modul-Kacheln,
 * leere Slots — kommuniziert den Baukasten-Gedanken.
 */
export function ConfiguratorMockup() {
  const modules = [
    { name: 'KPI & Performance', icon: BarChart3, active: true },
    { name: 'Training & Onboarding', icon: GraduationCap, active: true },
    { name: 'Schichtplanung', icon: Calendar, active: false },
    { name: 'Store Audit', icon: ClipboardCheck, active: true },
    { name: 'Team-Kommunikation', icon: MessageSquare, active: false },
    { name: 'Mystery Shopping', icon: ShoppingBag, active: false },
  ];

  const activeModules = modules.filter((m) => m.active);

  return (
    <div className="bg-kore-white border border-kore-border rounded-md overflow-hidden shadow-lg">
      {/* Titlebar */}
      <div className="bg-kore-ink px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-kore-error/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-kore-warning/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-kore-success/80" />
        </div>
        <span className="font-body text-[0.55rem] text-kore-faint tracking-wider uppercase">
          KORE Suite — Dashboard konfigurieren
        </span>
        <div className="w-12" />
      </div>

      <div className="flex min-h-[320px]">
        {/* Sidebar: Modul-Auswahl */}
        <div className="w-56 shrink-0 border-r border-kore-border bg-kore-surface/50 p-4">
          <p className="font-body text-[0.5rem] uppercase tracking-widest text-kore-mid font-medium mb-4">
            Module auswählen
          </p>
          <div className="flex flex-col gap-2.5">
            {modules.map((mod) => {
              const Icon = mod.icon;
              return (
                <label
                  key={mod.name}
                  className={`flex items-center gap-2.5 p-2 rounded-sm cursor-pointer transition-all duration-200 ${
                    mod.active
                      ? 'bg-kore-brass/8 border border-kore-brass/20'
                      : 'bg-transparent border border-transparent hover:bg-kore-surface'
                  }`}
                >
                  {/* Toggle */}
                  <div
                    className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 ${
                      mod.active
                        ? 'bg-kore-brass border-kore-brass'
                        : 'bg-kore-white border-kore-border'
                    }`}
                  >
                    {mod.active && (
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4L3.2 5.7L6.5 2.3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <Icon size={12} className={mod.active ? 'text-kore-brass' : 'text-kore-mid'} />
                  <span className={`font-body text-[0.55rem] leading-tight ${
                    mod.active ? 'text-kore-ink font-medium' : 'text-kore-mid font-light'
                  }`}>
                    {mod.name}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Custom Modul hinzufügen */}
          <div className="mt-4 pt-3 border-t border-kore-border">
            <div className="flex items-center gap-2 p-2 rounded-sm border border-dashed border-kore-brass/40 bg-kore-brass/5 cursor-pointer hover:bg-kore-brass/10 transition-colors">
              <Plus size={12} className="text-kore-brass" />
              <span className="font-body text-[0.55rem] text-kore-brass font-medium">Eigenes Modul anfragen</span>
            </div>
          </div>
        </div>

        {/* Main: Dashboard-Vorschau */}
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between mb-4">
            <p className="font-body text-[0.5rem] uppercase tracking-widest text-kore-mid font-medium">
              Ihr Dashboard — Vorschau
            </p>
            <span className="font-body text-[0.45rem] text-kore-brass bg-kore-brass/10 px-2 py-0.5 rounded-sm">
              {activeModules.length} Module aktiv
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Aktive Module als Kacheln */}
            {activeModules.map((mod) => {
              const Icon = mod.icon;
              return (
                <ActiveModuleTile key={mod.name} name={mod.name} icon={<Icon size={14} />} />
              );
            })}

            {/* Leerer Slot */}
            <div className="border border-dashed border-kore-border rounded-sm p-4 flex flex-col items-center justify-center gap-2 min-h-[100px] bg-kore-surface/30">
              <div className="w-8 h-8 rounded-full border border-dashed border-kore-brass/40 flex items-center justify-center">
                <Plus size={14} className="text-kore-brass/60" />
              </div>
              <span className="font-body text-[0.45rem] text-kore-mid text-center">
                Modul hinzufügen
              </span>
            </div>
          </div>

          {/* Hinweis */}
          <div className="mt-4 bg-kore-surface/50 rounded-sm p-2.5 flex items-start gap-2">
            <div className="w-3 h-3 rounded-full bg-kore-brass/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[0.4rem] text-kore-brass font-bold">i</span>
            </div>
            <p className="font-body text-[0.45rem] text-kore-mid leading-relaxed">
              Jedes Modul wird individuell auf Ihren Betrieb konfiguriert. Sie sehen nur die Daten und Funktionen, die für Sie relevant sind.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActiveModuleTile({ name, icon }: { name: string; icon: React.ReactNode }) {
  // Unterschiedlicher Mini-Content je nach Modul
  const content: Record<string, React.ReactNode> = {
    'KPI & Performance': (
      <div className="flex items-end gap-1 h-6 mt-2">
        {[40, 55, 45, 65, 70, 60, 80].map((h, i) => (
          <div key={i} className="flex-1 bg-kore-brass/60 rounded-t-sm" style={{ height: `${h}%` }} />
        ))}
      </div>
    ),
    'Training & Onboarding': (
      <div className="mt-2 space-y-1">
        <div className="flex items-center gap-1.5">
          <div className="flex-1 h-1.5 bg-kore-surface rounded-full overflow-hidden">
            <div className="h-full bg-kore-success/70 rounded-full" style={{ width: '78%' }} />
          </div>
          <span className="font-body text-[0.4rem] text-kore-mid">78%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex-1 h-1.5 bg-kore-surface rounded-full overflow-hidden">
            <div className="h-full bg-kore-brass/60 rounded-full" style={{ width: '45%' }} />
          </div>
          <span className="font-body text-[0.4rem] text-kore-mid">45%</span>
        </div>
      </div>
    ),
    'Store Audit': (
      <div className="mt-2 flex items-center gap-2">
        <div className="relative w-8 h-8">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="14" fill="none" stroke="#EDEAE4" strokeWidth="3" />
            <circle cx="18" cy="18" r="14" fill="none" stroke="#9E8460" strokeWidth="3"
              strokeDasharray="88" strokeDashoffset="29" strokeLinecap="round" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-display text-[0.4rem] text-kore-ink">67</span>
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-kore-success" />
            <span className="font-body text-[0.35rem] text-kore-mid">4 bestanden</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-kore-error" />
            <span className="font-body text-[0.35rem] text-kore-mid">2 offen</span>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <div className="border border-kore-border rounded-sm p-3 bg-kore-white hover:shadow-sm transition-all min-h-[100px]">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-kore-brass">{icon}</span>
        <span className="font-body text-[0.5rem] font-medium text-kore-ink uppercase tracking-wider">{name}</span>
      </div>
      {content[name] || (
        <div className="mt-2 h-6 bg-kore-surface/50 rounded-sm" />
      )}
    </div>
  );
}
