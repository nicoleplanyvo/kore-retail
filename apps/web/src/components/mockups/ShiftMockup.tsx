/**
 * CSS-basiertes Mockup eines Dienstplan-Tools (KORE Shift).
 * Zeigt: Wochenplan, Budget-Indikator, Team-Zuweisung.
 */
export function ShiftMockup() {
  return (
    <div className="bg-kore-white border border-kore-border rounded-md overflow-hidden shadow-lg">
      {/* Titlebar */}
      <div className="bg-kore-ink px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-kore-error/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-kore-warning/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-kore-success/80" />
        </div>
        <span className="font-body text-[0.55rem] text-kore-faint tracking-wider uppercase">KORE Shift — KW 10</span>
        <div className="w-12" />
      </div>

      <div className="p-4 space-y-3">
        {/* Budget Row */}
        <div className="flex gap-2">
          <div className="flex-1 border border-kore-border rounded-sm p-2.5">
            <p className="font-body text-[0.45rem] uppercase tracking-wider text-kore-mid">Budget Stunden</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-display text-[0.9rem] text-kore-ink">284h</span>
              <span className="font-body text-[0.45rem] text-kore-mid">/ 310h geplant</span>
            </div>
            <div className="w-full h-1.5 bg-kore-surface rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-kore-success rounded-full" style={{ width: '91%' }} />
            </div>
          </div>
          <div className="flex-1 border border-kore-border rounded-sm p-2.5">
            <p className="font-body text-[0.45rem] uppercase tracking-wider text-kore-mid">Personalkosten</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-display text-[0.9rem] text-kore-ink">€8.420</span>
              <span className="font-body text-[0.45rem] text-kore-success">-4% vs. Budget</span>
            </div>
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="border border-kore-border rounded-sm overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-8 bg-kore-surface">
            <div className="px-2 py-1.5">
              <span className="font-body text-[0.45rem] text-kore-mid">Team</span>
            </div>
            {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((d) => (
              <div key={d} className="px-1 py-1.5 text-center">
                <span className="font-body text-[0.45rem] font-medium text-kore-mid">{d}</span>
              </div>
            ))}
          </div>

          {/* Team Rows */}
          {[
            { name: 'Sarah M.', shifts: ['9-17', '9-17', '—', '11-19', '11-19', '10-18', '—'] },
            { name: 'Tom K.', shifts: ['—', '10-18', '10-18', '10-18', '—', '9-17', '11-17'] },
            { name: 'Lisa R.', shifts: ['11-19', '—', '9-17', '9-17', '11-19', '—', '10-18'] },
            { name: 'Max B.', shifts: ['10-18', '11-19', '11-19', '—', '9-17', '11-17', '—'] },
          ].map((member) => (
            <div key={member.name} className="grid grid-cols-8 border-t border-kore-border/50">
              <div className="px-2 py-1.5 flex items-center">
                <span className="font-body text-[0.5rem] text-kore-ink truncate">{member.name}</span>
              </div>
              {member.shifts.map((shift, i) => (
                <div key={i} className="px-0.5 py-1 text-center">
                  {shift === '—' ? (
                    <span className="font-body text-[0.4rem] text-kore-faint">—</span>
                  ) : (
                    <div className="bg-kore-brass/10 border border-kore-brass/20 rounded-sm py-0.5 px-0.5">
                      <span className="font-body text-[0.4rem] text-kore-brass">{shift}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Forecast Note */}
        <div className="flex items-center gap-2 bg-kore-surface rounded-sm p-2.5">
          <div className="w-1 h-6 bg-kore-brass rounded-full shrink-0" />
          <div>
            <p className="font-body text-[0.5rem] font-medium text-kore-ink">Forecast-Hinweis</p>
            <p className="font-body text-[0.4rem] text-kore-mid">Samstag: +22% erwarteter Footfall → Verstärkung empfohlen</p>
          </div>
        </div>
      </div>
    </div>
  );
}
