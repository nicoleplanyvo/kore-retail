import { Link } from 'react-router-dom';
import { Store, MapPin } from 'lucide-react';
import { Badge } from '@kore/ui';
import { useStores } from '../hooks/useStores';
import { useAuthStore } from '../stores/authStore';

export function StoresListPage() {
  const user = useAuthStore((s) => s.user);
  const { data: stores, isLoading } = useStores(user?.tenantId || undefined);

  // Filtere Stores nach User-Zuweisungen (für Manager/Learner)
  const visibleStores = stores?.filter((store) => {
    if (user?.role === 'kore_admin' || user?.role === 'tenant_admin') return true;
    return user?.storeAssignments?.includes(store.id);
  });

  return (
    <div>
      <div className="flex items-center gap-md mb-lg sm:mb-xl">
        <div className="w-10 h-10 rounded-lg bg-sand-50 flex items-center justify-center flex-shrink-0">
          <Store className="w-5 h-5 text-brass" />
        </div>
        <h1 className="font-display text-h2 sm:text-h1 text-kore-ink">Stores</h1>
      </div>

      {isLoading ? (
        <p className="text-kore-mid font-body">Lade Stores...</p>
      ) : visibleStores && visibleStores.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
          {visibleStores.map((store) => (
            <Link
              key={store.id}
              to={`/stores/${store.id}`}
              className="bg-kore-white border border-kore-border p-xl hover:border-kore-brass transition-colors group"
            >
              <div className="flex items-start justify-between mb-md">
                <h3 className="font-display text-h3 text-kore-ink group-hover:text-kore-brass transition-colors">
                  {store.name}
                </h3>
                <Badge variant={store.isActive ? 'success' : 'error'}>
                  {store.isActive ? 'Aktiv' : 'Inaktiv'}
                </Badge>
              </div>
              {store.city && (
                <div className="flex items-center gap-xs text-kore-mid">
                  <MapPin size={14} />
                  <span className="font-body text-small">{store.city}</span>
                </div>
              )}
              <div className="mt-md pt-md border-t border-kore-border flex items-center justify-between">
                <span className="font-body text-caption text-kore-mid uppercase tracking-[0.14em]">
                  {store._count.tools} Tools
                </span>
                <span className="font-body text-small text-kore-mid">
                  {store.tenant.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-kore-white border border-kore-border p-xl text-kore-mid font-body text-small">
          Keine Stores verfügbar.
        </div>
      )}
    </div>
  );
}
