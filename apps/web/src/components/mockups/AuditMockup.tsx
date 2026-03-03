/**
 * CSS-basiertes Mockup eines Audit-Reports / Analyse-Dashboards.
 * Zeigt: Score-Cards, Bewertungsskala, Findings — Consulting-Kontext.
 */
export function AuditMockup() {
  return (
    <div className="bg-kore-white border border-kore-border rounded-md overflow-hidden shadow-lg">
      {/* Titlebar */}
      <div className="bg-kore-ink px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-kore-error/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-kore-warning/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-kore-success/80" />
        </div>
        <span className="font-body text-[0.55rem] text-kore-faint tracking-wider uppercase">KORE — Store Audit Report</span>
        <div className="w-12" />
      </div>

      <div className="p-4 space-y-3">
        {/* Overall Score */}
        <div className="flex items-center gap-4 border border-kore-border rounded-sm p-3">
          <div className="relative w-16 h-16 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#D8D4CC" strokeWidth="2" />
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#9E8460" strokeWidth="2"
                strokeDasharray="97.4" strokeDashoffset="33.1" strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-display text-[0.85rem] text-kore-brass">66</span>
          </div>
          <div>
            <p className="font-body text-[0.5rem] uppercase tracking-wider text-kore-mid">Gesamt-Score</p>
            <p className="font-display text-[0.8rem] text-kore-ink">Solide Basis, klares Potenzial</p>
            <p className="font-body text-[0.4rem] text-kore-mid mt-0.5">12 Kategorien analysiert · 47 Datenpunkte</p>
          </div>
        </div>

        {/* Category Scores */}
        <div>
          <p className="font-body text-[0.5rem] uppercase tracking-wider text-kore-mid mb-2">Kategorien</p>
          <div className="space-y-1.5">
            <ScoreBar label="Kundenansprache" score={82} />
            <ScoreBar label="Verkaufsprozess" score={71} />
            <ScoreBar label="Visual Merchandising" score={58} />
            <ScoreBar label="Team-Performance" score={74} />
            <ScoreBar label="Operative Abläufe" score={45} />
            <ScoreBar label="KPI-Tracking" score={32} />
          </div>
        </div>

        {/* Top Findings */}
        <div className="border border-kore-border rounded-sm p-3">
          <p className="font-body text-[0.5rem] uppercase tracking-wider text-kore-mid mb-2">Top Findings</p>
          <div className="space-y-2">
            <Finding
              type="critical"
              text="Kein systematisches KPI-Tracking vorhanden"
            />
            <Finding
              type="warning"
              text="Visual Merchandising Standards nicht einheitlich"
            />
            <Finding
              type="success"
              text="Starke Kundenansprache — Team-Stärke"
            />
          </div>
        </div>

        {/* Recommendation */}
        <div className="border-l-[3px] border-l-kore-brass bg-kore-brass/5 rounded-r-sm p-2.5">
          <p className="font-body text-[0.5rem] font-medium text-kore-ink">Empfehlung</p>
          <p className="font-body text-[0.4rem] text-kore-mid mt-0.5">
            Custom KPI-Dashboard + Monitoring-System implementieren. Geschätztes Potenzial: +15-20% Conversion in 12 Wochen.
          </p>
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = score >= 70 ? 'bg-kore-success' : score >= 50 ? 'bg-kore-warning' : 'bg-kore-error';
  return (
    <div className="flex items-center gap-2">
      <span className="font-body text-[0.45rem] text-kore-mid w-24 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-1.5 bg-kore-surface rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${score}%` }} />
      </div>
      <span className={`font-body text-[0.45rem] w-6 text-right ${
        score >= 70 ? 'text-kore-success' : score >= 50 ? 'text-kore-warning' : 'text-kore-error'
      }`}>{score}</span>
    </div>
  );
}

function Finding({ type, text }: { type: 'critical' | 'warning' | 'success'; text: string }) {
  const styles = {
    critical: { dot: 'bg-kore-error', border: 'border-kore-error/20', bg: 'bg-kore-error/5' },
    warning: { dot: 'bg-kore-warning', border: 'border-kore-warning/20', bg: 'bg-kore-warning/5' },
    success: { dot: 'bg-kore-success', border: 'border-kore-success/20', bg: 'bg-kore-success/5' },
  };
  const s = styles[type];
  return (
    <div className={`flex items-start gap-2 border ${s.border} ${s.bg} rounded-sm p-1.5`}>
      <div className={`w-1.5 h-1.5 rounded-full ${s.dot} mt-0.5 shrink-0`} />
      <span className="font-body text-[0.45rem] text-kore-ink">{text}</span>
    </div>
  );
}
