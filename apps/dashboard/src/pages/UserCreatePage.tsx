import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userCreateSchema, type UserCreateInput } from '@kore/validators';
import { Button, Input } from '@kore/ui';
import { ArrowLeft } from 'lucide-react';
import { useCreateUser } from '../hooks/useUsers';
import { useAuthStore } from '../stores/authStore';
import { useTenants } from '../hooks/useTenants';
import { useStores } from '../hooks/useStores';
import { hasMinRole, type UserRole } from '@kore/types';

const ROLE_OPTIONS: { value: string; label: string; minCreatorRole: UserRole }[] = [
  { value: 'tenant_admin', label: 'Kunden-Admin', minCreatorRole: 'kore_admin' },
  { value: 'regional_manager', label: 'Regional Manager', minCreatorRole: 'tenant_admin' },
  { value: 'multisite_manager', label: 'Multisite Manager', minCreatorRole: 'tenant_admin' },
  { value: 'store_manager', label: 'Store Manager', minCreatorRole: 'tenant_admin' },
  { value: 'learner', label: 'Mitarbeiter', minCreatorRole: 'tenant_admin' },
];

export function UserCreatePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const createUser = useCreateUser();
  const [serverError, setServerError] = useState('');

  // kore_admin kann Tenant auswählen
  const { data: tenantsData } = useTenants({ pageSize: 100 });
  const isKoreAdmin = user?.role === 'kore_admin';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserCreateInput>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      role: 'store_manager',
      tenantId: isKoreAdmin ? '' : (user?.tenantId || ''),
      storeIds: [],
    },
  });

  const selectedTenantId = watch('tenantId');

  // Lade Stores des ausgewählten Tenants
  const { data: storesData } = useStores(selectedTenantId || user?.tenantId);

  // Filtere Rollen basierend auf eigener Rolle
  const availableRoles = ROLE_OPTIONS.filter((r) =>
    hasMinRole(user?.role || 'learner', r.minCreatorRole),
  );

  const onSubmit = async (data: UserCreateInput) => {
    setServerError('');
    try {
      await createUser.mutateAsync({
        ...data,
        tenantId: isKoreAdmin ? data.tenantId : (user?.tenantId || undefined),
      });
      navigate('/users');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Fehler beim Erstellen.');
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-sm text-kore-mid hover:text-kore-ink font-body text-small mb-lg transition-colors"
      >
        <ArrowLeft size={16} />
        Zurück
      </button>

      <h1 className="font-display text-h2 sm:text-h1 text-kore-ink mb-lg sm:mb-xl">
        Benutzer anlegen
      </h1>

      <div className="bg-kore-white border border-kore-border p-lg sm:p-xl max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-lg">
          <Input
            label="Name"
            {...register('name')}
            error={errors.name?.message}
          />

          <Input
            label="E-Mail"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />

          <Input
            label="Passwort"
            type="password"
            {...register('password')}
            error={errors.password?.message}
          />

          <div>
            <label className="block font-body text-small text-kore-mid mb-xs">Rolle</label>
            <select
              {...register('role')}
              className="w-full px-md py-sm border border-kore-border bg-kore-white font-body text-small text-kore-ink focus:outline-none focus:border-kore-brass"
            >
              {availableRoles.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            {errors.role && <p className="font-body text-caption text-kore-error mt-xs">{errors.role.message}</p>}
          </div>

          {/* Tenant-Auswahl nur für kore_admin */}
          {isKoreAdmin && (
            <div>
              <label className="block font-body text-small text-kore-mid mb-xs">Mandant</label>
              <select
                {...register('tenantId')}
                className="w-full px-md py-sm border border-kore-border bg-kore-white font-body text-small text-kore-ink focus:outline-none focus:border-kore-brass"
              >
                <option value="">Mandant auswählen...</option>
                {tenantsData?.data.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              {errors.tenantId && <p className="font-body text-caption text-kore-error mt-xs">{errors.tenantId.message}</p>}
            </div>
          )}

          {/* Store-Zuweisungen */}
          {storesData && storesData.length > 0 && (
            <div>
              <label className="block font-body text-small text-kore-mid mb-xs">Store-Zuweisungen</label>
              <div className="border border-kore-border divide-y divide-kore-border max-h-[200px] overflow-y-auto">
                {storesData.map((store) => (
                  <label key={store.id} className="flex items-center gap-md px-md py-sm hover:bg-kore-surface/50 cursor-pointer">
                    <input
                      type="checkbox"
                      value={store.id}
                      {...register('storeIds')}
                      className="w-4 h-4 accent-kore-brass"
                    />
                    <div>
                      <span className="font-body text-small text-kore-ink">{store.name}</span>
                      {store.city && (
                        <span className="font-body text-caption text-kore-mid ml-sm">{store.city}</span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {serverError && (
            <p className="font-body text-small text-kore-error">{serverError}</p>
          )}

          <Button type="submit" disabled={isSubmitting} style={{ marginTop: '8px' }}>
            {isSubmitting ? 'Erstelle...' : 'Benutzer anlegen'}
          </Button>
        </form>
      </div>
    </div>
  );
}
