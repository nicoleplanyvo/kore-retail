import { Link } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, CheckCircle, Clock, Eye,
  Shield, AlertTriangle, Users,
} from 'lucide-react';
import {
  useSopDocuments,
  useSopCategories,
  useSopAcknowledgmentStatus,
  useSopCompliance,
  useSopOverdue,
} from '../../../hooks/useSop';
import { AcknowledgmentProgress } from '../components/AcknowledgmentProgress';

export function DashboardPage() {
  const { data: allDocs } = useSopDocuments({ page: 1 });
  const { data: publishedDocs } = useSopDocuments({ page: 1, status: 'PUBLISHED' });
  const { data: draftDocs } = useSopDocuments({ page: 1, status: 'DRAFT' });
  const { data: mandatoryDocs } = useSopDocuments({ page: 1, mandatory: true });
  const { data: categories } = useSopCategories();
  const { data: ackStatus, isLoading } = useSopAcknowledgmentStatus();
  const { data: compliance } = useSopCompliance();
  const { data: overdueSops } = useSopOverdue();

  const totalSops = allDocs?.total ?? 0;
  const publishedCount = publishedDocs?.total ?? 0;
  const draftCount = draftDocs?.total ?? 0;
  const mandatoryCount = mandatoryDocs?.total ?? 0;
  const overdueCount = overdueSops?.length ?? 0;

  const avgReadRate = ackStatus && ackStatus.length > 0
    ? Math.round(ackStatus.reduce((s, a) => s + a.acknowledgedPercent, 0) / ackStatus.length * 10) / 10
    : 0;

  return (
    <div className="p-xl max-w-5xl">
      <div className="flex items-center gap-md mb-2xl">
        <Link to="/app/tools/sop" className="text-kore-mid hover:text-kore-ink transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-h1 text-kore-ink">SOP Dashboard</h1>
          <p className="text-body text-kore-mid mt-xs">Statistiken, Pflicht-SOPs und Lesebestätigung im Überblick</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-lg mb-2xl">
        <KpiCard icon={BookOpen} label="Gesamt" value={totalSops} color="text-kore-mid" />
        <KpiCard icon={CheckCircle} label="Freigegeben" value={publishedCount} color="text-emerald-600" />
        <KpiCard icon={Clock} label="Entwürfe" value={draftCount} color="text-amber-600" />
        <KpiCard icon={Shield} label="Pflicht" value={mandatoryCount} color="text-blue-600" />
        <KpiCard icon={AlertTriangle} label="Überfällig" value={overdueCount} color="text-red-600" />
        <KpiCard icon={Eye} label="Ø Leserate" value={`${avgReadRate}%`} color="text-kore-mid" />
      </div>

      {/* Overdue SOPs */}
      {overdueSops && overdueSops.length > 0 && (
        <div className="bg-red-50 border border-red-200 p-xl mb-xl">
          <h2 className="font-display text-h3 text-red-700 mb-lg flex items-center gap-sm">
            <AlertTriangle size={18} /> Überfällige Pflicht-SOPs ({overdueSops.length})
          </h2>
          <div className="space-y-sm">
            {overdueSops.map((item) => (
              <div key={item.sopId} className="flex items-center justify-between bg-kore-white border border-red-200 p-md">
                <div className="flex items-center gap-md min-w-0">
                  <Link
                    to={`/app/tools/sop/sops/${item.sopId}`}
                    className="text-body font-medium text-kore-ink hover:text-kore-brass transition-colors truncate"
                  >
                    {item.title}
                  </Link>
                  {item.category && (
                    <span className="text-caption text-kore-faint flex-shrink-0">{item.category.name}</span>
                  )}
                </div>
                <div className="flex items-center gap-lg flex-shrink-0">
                  <span className="text-small text-red-600 font-medium">
                    Frist: {new Date(item.deadline).toLocaleDateString('de-DE')}
                  </span>
                  <span className="text-small text-kore-mid">
                    {item.acknowledgedCount} / {item.totalUsers} ({item.acknowledgedPercent}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mandatory SOP Compliance per User */}
      {compliance && compliance.totalMandatory > 0 && (
        <div className="bg-kore-white border border-kore-border p-xl mb-xl">
          <h2 className="font-display text-h3 text-kore-ink mb-sm flex items-center gap-sm">
            <Users size={18} /> Pflicht-SOP Compliance pro Mitarbeiter
          </h2>
          <p className="text-small text-kore-mid mb-lg">
            {compliance.totalMandatory} Pflicht-SOPs insgesamt — nur Mitarbeiter in Ihrer Berichtskette sichtbar
          </p>
          {compliance.users.length === 0 ? (
            <p className="text-body text-kore-mid">Keine Mitarbeiter in Ihrer Berichtskette.</p>
          ) : (
            <div className="space-y-sm">
              {compliance.users.map((user) => (
                <div key={user.userId} className="flex items-center gap-lg">
                  <span className="text-small text-kore-ink w-40 flex-shrink-0 truncate">
                    {user.name}
                  </span>
                  <div className="flex-1">
                    <AcknowledgmentProgress
                      acknowledged={user.readCount}
                      total={user.totalMandatory}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Categories */}
      {categories && categories.length > 0 && (
        <div className="bg-kore-white border border-kore-border p-xl mb-xl">
          <h2 className="font-display text-h3 text-kore-ink mb-lg">SOPs nach Kategorie</h2>
          <div className="space-y-sm">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between py-sm border-b border-kore-border last:border-0">
                <span className="text-body text-kore-ink">{cat.name}</span>
                <span className="text-small font-medium text-kore-mid">{cat._count?.documents ?? 0} SOPs</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Acknowledgment Status per SOP */}
      {isLoading ? (
        <div className="text-body text-kore-mid">Lade Lesebestätigung...</div>
      ) : ackStatus && ackStatus.length > 0 ? (
        <div className="bg-kore-white border border-kore-border p-xl">
          <h2 className="font-display text-h3 text-kore-ink mb-lg">Lesebestätigung pro SOP</h2>
          <div className="space-y-md">
            {ackStatus.map((item) => (
              <div key={item.sopId} className="space-y-xs">
                <div className="flex items-center justify-between text-small">
                  <div className="flex items-center gap-md">
                    <Link to={`/app/tools/sop/sops/${item.sopId}`} className="text-kore-ink hover:text-kore-brass transition-colors font-medium">
                      {item.title}
                    </Link>
                    {item.isMandatory && (
                      <span className="text-caption px-sm py-px border border-blue-200 bg-blue-50 text-blue-700 uppercase">
                        Pflicht
                      </span>
                    )}
                    {item.isOverdue && (
                      <span className="text-caption px-sm py-px border border-red-200 bg-red-50 text-red-700 uppercase">
                        Überfällig
                      </span>
                    )}
                  </div>
                  <span className="text-kore-mid">
                    {item.acknowledgedCount} / {item.totalUsers} ({item.acknowledgedPercent}%)
                  </span>
                </div>
                <div className="w-full bg-kore-bg h-2">
                  <div
                    className={`h-full transition-all ${item.isOverdue ? 'bg-red-500' : 'bg-kore-ink'}`}
                    style={{ width: `${Math.min(100, item.acknowledgedPercent)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-kore-white border border-kore-border p-xl text-center text-body text-kore-mid">
          Noch keine veröffentlichten SOPs für die Lesebestätigung vorhanden.
        </div>
      )}
    </div>
  );
}

// ── KPI Card Component ──────────────────────────────

interface KpiCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: string;
}

function KpiCard({ icon: Icon, label, value, color }: KpiCardProps) {
  return (
    <div className="bg-kore-white border border-kore-border p-lg">
      <div className={`flex items-center gap-xs text-small ${color} mb-xs`}>
        <Icon size={14} /> {label}
      </div>
      <div className={`text-h2 font-display ${color}`}>{value}</div>
    </div>
  );
}
