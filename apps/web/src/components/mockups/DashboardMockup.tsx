/**
 * CSS-basiertes Mockup eines KPI-Dashboards (KORE Pulse).
 * Zeigt: KPI-Cards, Mini-Chart, Tabelle — alles im KORE CI.
 */
export function DashboardMockup() {
  return (
    <div className="bg-kore-white border border-kore-border rounded-md overflow-hidden shadow-lg">
      {/* Titlebar */}
      <div className="bg-kore-ink px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-kore-error/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-kore-warning/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-kore-success/80" />
        </div>
        <span className="font-body text-[0.55rem] text-kore-faint tracking-wider uppercase">KORE Pulse — Dashboard</span>
        <div className="w-12" />
      </div>

      <div className="p-4 space-y-4">
        {/* KPI Row */}
        <div className="grid grid-cols-4 gap-2">
          <KPICard label="Revenue" value="€47.820" change="+12%" positive />
          <KPICard label="Conversion" value="24,3%" change="+3,1%" positive />
          <KPICard label="ATV" value="€186" change="+8%" positive />
          <KPICard label="UPT" value="2,4" change="-0,2" positive={false} />
        </div>

        {/* Chart Area */}
        <div className="border border-kore-border rounded-sm p-3">
          <div className="flex items-center justify-between mb-3">
            <span className="font-body text-[0.55rem] font-medium uppercase tracking-wider text-kore-mid">Revenue vs. Target — KW 09</span>
            <div className="flex gap-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-kore-brass" />
                <span className="font-body text-[0.5rem] text-kore-mid">Actual</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-kore-border" />
                <span className="font-body text-[0.5rem] text-kore-mid">Target</span>
              </div>
            </div>
          </div>
          {/* Mini Bar Chart */}
          <div className="flex items-end gap-1.5 h-20">
            {[
              { actual: 65, target: 60 },
              { actual: 72, target: 70 },
              { actual: 58, target: 70 },
              { actual: 80, target: 75 },
              { actual: 85, target: 75 },
              { actual: 70, target: 70 },
              { actual: 90, target: 80 },
            ].map((day, i) => (
              <div key={i} className="flex-1 flex gap-0.5 items-end">
                <div
                  className="flex-1 bg-kore-brass/80 rounded-t-sm transition-all"
                  style={{ height: `${day.actual}%` }}
                />
                <div
                  className="flex-1 bg-kore-border rounded-t-sm"
                  style={{ height: `${day.target}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1.5">
            {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((d) => (
              <span key={d} className="flex-1 text-center font-body text-[0.45rem] text-kore-faint">{d}</span>
            ))}
          </div>
        </div>

        {/* Mini Table */}
        <div className="border border-kore-border rounded-sm overflow-hidden">
          <div className="grid grid-cols-5 bg-kore-surface px-3 py-1.5">
            {['Store', 'Revenue', 'Conv.', 'ATV', 'Trend'].map((h) => (
              <span key={h} className="font-body text-[0.5rem] font-medium uppercase tracking-wider text-kore-mid">{h}</span>
            ))}
          </div>
          {[
            { store: 'Düsseldorf', rev: '€18.400', conv: '26%', atv: '€192', up: true },
            { store: 'München', rev: '€15.200', conv: '23%', atv: '€178', up: true },
            { store: 'Wien', rev: '€14.220', conv: '22%', atv: '€184', up: false },
          ].map((row) => (
            <div key={row.store} className="grid grid-cols-5 px-3 py-1.5 border-t border-kore-border/50">
              <span className="font-body text-[0.55rem] text-kore-ink">{row.store}</span>
              <span className="font-body text-[0.55rem] text-kore-ink">{row.rev}</span>
              <span className="font-body text-[0.55rem] text-kore-ink">{row.conv}</span>
              <span className="font-body text-[0.55rem] text-kore-ink">{row.atv}</span>
              <span className={`font-body text-[0.55rem] ${row.up ? 'text-kore-success' : 'text-kore-error'}`}>
                {row.up ? '↑' : '↓'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KPICard({ label, value, change, positive }: { label: string; value: string; change: string; positive: boolean }) {
  return (
    <div className="border border-kore-border rounded-sm p-2.5">
      <p className="font-body text-[0.45rem] uppercase tracking-wider text-kore-mid mb-1">{label}</p>
      <p className="font-display text-[1rem] font-light text-kore-ink leading-tight">{value}</p>
      <p className={`font-body text-[0.5rem] mt-0.5 ${positive ? 'text-kore-success' : 'text-kore-error'}`}>
        {change}
      </p>
    </div>
  );
}
