/**
 * CSS-basiertes Mockup einer Trainingsplattform (KORE Train).
 * Zeigt: Mobile-View mit Kurs-Cards, Fortschrittsanzeige, Lernpfad.
 */
export function TrainMockup() {
  return (
    <div className="bg-kore-white border border-kore-border rounded-md overflow-hidden shadow-lg max-w-[280px] mx-auto">
      {/* Phone-Style Header */}
      <div className="bg-kore-ink px-4 py-2.5 flex items-center justify-between">
        <span className="font-display text-[0.7rem] text-kore-white tracking-wide">KORE Train</span>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-3 border border-kore-faint/50 rounded-sm flex items-center justify-end pr-0.5">
            <div className="w-2 h-1.5 bg-kore-success rounded-sm" />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Greeting */}
        <div>
          <p className="font-body text-[0.55rem] text-kore-mid">Hallo, Sarah 👋</p>
          <p className="font-display text-[0.85rem] text-kore-ink font-light">Dein Lernfortschritt</p>
        </div>

        {/* Progress Ring */}
        <div className="flex items-center gap-4 bg-kore-surface rounded-sm p-3">
          <div className="relative w-14 h-14 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#D8D4CC" strokeWidth="2.5" />
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#9E8460" strokeWidth="2.5"
                strokeDasharray="97.4" strokeDashoffset="29.2" strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-display text-[0.7rem] text-kore-ink">70%</span>
          </div>
          <div>
            <p className="font-body text-[0.55rem] font-medium text-kore-ink">7 von 10 Module</p>
            <p className="font-body text-[0.45rem] text-kore-mid">Upselling Masterclass</p>
          </div>
        </div>

        {/* Course Cards */}
        <div>
          <p className="font-body text-[0.5rem] uppercase tracking-wider text-kore-mid mb-2">Aktive Kurse</p>
          <div className="space-y-2">
            <CourseCard
              title="Upselling Masterclass"
              modules="7/10 Module"
              progress={70}
              status="In Bearbeitung"
            />
            <CourseCard
              title="Service Excellence"
              modules="2/8 Module"
              progress={25}
              status="In Bearbeitung"
            />
            <CourseCard
              title="Visual Merchandising"
              modules="Noch nicht gestartet"
              progress={0}
              status="Zugewiesen"
            />
          </div>
        </div>

        {/* Achievement */}
        <div className="border border-kore-brass-lt/50 rounded-sm p-2.5 bg-kore-brass/5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-kore-brass/20 flex items-center justify-center">
              <span className="text-[0.55rem]">🏆</span>
            </div>
            <div>
              <p className="font-body text-[0.5rem] font-medium text-kore-ink">Zertifikat erhalten</p>
              <p className="font-body text-[0.4rem] text-kore-mid">Kundenansprache — Abgeschlossen am 24.02.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="border-t border-kore-border flex">
        {['Dashboard', 'Kurse', 'Zertifikate', 'Profil'].map((tab, i) => (
          <div key={tab} className={`flex-1 py-2 text-center ${i === 0 ? 'border-t-2 border-t-kore-brass' : ''}`}>
            <span className={`font-body text-[0.4rem] ${i === 0 ? 'text-kore-brass' : 'text-kore-faint'}`}>{tab}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CourseCard({ title, modules, progress, status }: { title: string; modules: string; progress: number; status: string }) {
  return (
    <div className="border border-kore-border rounded-sm p-2.5">
      <div className="flex items-start justify-between mb-1.5">
        <p className="font-body text-[0.6rem] font-medium text-kore-ink">{title}</p>
        <span className={`font-body text-[0.4rem] px-1.5 py-0.5 rounded-sm ${
          progress > 0 ? 'bg-kore-brass/10 text-kore-brass' : 'bg-kore-surface text-kore-mid'
        }`}>{status}</span>
      </div>
      <p className="font-body text-[0.45rem] text-kore-mid mb-1.5">{modules}</p>
      <div className="w-full h-1 bg-kore-surface rounded-full overflow-hidden">
        <div className="h-full bg-kore-brass rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
