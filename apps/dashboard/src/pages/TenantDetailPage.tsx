import { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tenantUpdateSchema, type TenantUpdateInput } from '@kore/validators';
import { Button, Input, Badge, Divider } from '@kore/ui';
import { ArrowLeft, Store, ExternalLink, Upload, Trash2, Palette } from 'lucide-react';
import { useTenant, useUpdateTenant, useDeleteTenant, useUpdateBranding, useUploadLogo } from '../hooks/useTenants';
import t from '../locales/de.json';

const statusVariant: Record<string, 'success' | 'warning' | 'error' | 'brass'> = {
  ACTIVE: 'success',
  PAST_DUE: 'warning',
  CANCELED: 'error',
  TRIALING: 'brass',
};

export function TenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: tenant, isLoading } = useTenant(id);
  const updateTenant = useUpdateTenant(id!);
  const deleteTenant = useDeleteTenant();
  const updateBranding = useUpdateBranding(id!);
  const uploadLogo = useUploadLogo(id!);
  const [serverError, setServerError] = useState('');
  const [brandingMsg, setBrandingMsg] = useState('');
  const [primaryColor, setPrimaryColor] = useState('');
  const [accentColor, setAccentColor] = useState('');
  const [brandingInitialized, setBrandingInitialized] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<TenantUpdateInput>({
    resolver: zodResolver(tenantUpdateSchema),
    values: tenant
      ? {
          name: tenant.name,
          slug: tenant.slug,
          contactName: tenant.contactName ?? '',
          contactEmail: tenant.contactEmail ?? '',
          contactPhone: tenant.contactPhone ?? '',
          maxUsers: tenant.maxUsers,
        }
      : undefined,
  });

  const onSubmit = async (data: TenantUpdateInput) => {
    setServerError('');
    try {
      await updateTenant.mutateAsync(data);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : t.common.error);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t.tenants.deleteConfirm)) return;
    try {
      await deleteTenant.mutateAsync(id!);
      navigate('/admin/tenants');
    } catch {
      // Error handled by React Query
    }
  };

  // Initialize branding fields when tenant data loads
  if (tenant && !brandingInitialized) {
    setPrimaryColor(((tenant as unknown) as { primaryColor?: string }).primaryColor ?? '');
    setAccentColor(((tenant as unknown) as { accentColor?: string }).accentColor ?? '');
    setBrandingInitialized(true);
  }

  const handleSaveBranding = async () => {
    setBrandingMsg('');
    try {
      await updateBranding.mutateAsync({
        primaryColor: primaryColor || undefined,
        accentColor: accentColor || undefined,
      });
      setBrandingMsg(t.tenants.brandingSaved);
      setTimeout(() => setBrandingMsg(''), 3000);
    } catch (err) {
      setBrandingMsg(err instanceof Error ? err.message : t.common.error);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadLogo.mutateAsync(file);
    } catch {
      // Error via React Query
    }
    // Reset input
    if (logoInputRef.current) logoInputRef.current.value = '';
  };

  if (isLoading) {
    return <p className="text-kore-mid font-body">{t.common.loading}</p>;
  }

  if (!tenant) {
    return <p className="text-kore-error font-body">Tenant nicht gefunden.</p>;
  }

  return (
    <div>
      <button
        onClick={() => navigate('/admin/tenants')}
        className="flex items-center gap-sm text-kore-mid hover:text-kore-ink font-body text-small mb-lg transition-colors"
      >
        <ArrowLeft size={16} />
        {t.common.back}
      </button>

      <div className="flex flex-wrap items-center gap-md sm:gap-lg mb-lg sm:mb-xl">
        <h1 className="font-display text-h2 sm:text-h1 text-kore-ink">{tenant.name}</h1>
        <Badge variant={statusVariant[tenant.status]}>
          {t.status[tenant.status as keyof typeof t.status]}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
        {/* Tenant Form */}
        <div className="lg:col-span-2 bg-kore-white border border-kore-border p-xl">
          <h2 className="font-display text-h3 text-kore-ink mb-lg">{t.tenants.editTitle}</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-lg">
            <Input label={t.tenants.name} {...register('name')} error={errors.name?.message} />
            <Input label={t.tenants.slug} {...register('slug')} error={errors.slug?.message} />
            <Input label={t.tenants.contactName} {...register('contactName')} error={errors.contactName?.message} />
            <Input label={t.tenants.contactEmail} type="email" {...register('contactEmail')} error={errors.contactEmail?.message} />
            <Input label={t.tenants.contactPhone} type="tel" {...register('contactPhone')} error={errors.contactPhone?.message} />
            <Input label={t.tenants.maxUsers} type="number" {...register('maxUsers', { valueAsNumber: true })} error={errors.maxUsers?.message} />

            {serverError && <p className="font-body text-small text-kore-error">{serverError}</p>}

            <div className="flex gap-md mt-md">
              <Button type="submit" disabled={isSubmitting || !isDirty}>
                {isSubmitting ? t.common.loading : t.tenants.save}
              </Button>
            </div>
          </form>

          <Divider style={{ margin: '32px 0' }} />

          <button onClick={handleDelete} className="font-body text-small text-kore-error hover:underline">
            {t.tenants.delete}
          </button>
        </div>

        {/* Branding */}
        <div className="lg:col-span-2 bg-kore-white border border-kore-border p-xl">
          <div className="flex items-center gap-md mb-md">
            <Palette size={20} className="text-kore-brass" />
            <h2 className="font-display text-h3 text-kore-ink">{t.tenants.branding}</h2>
          </div>
          <p className="font-body text-small text-kore-mid mb-lg">{t.tenants.brandingDesc}</p>

          <div className="flex flex-col gap-lg">
            {/* Logo */}
            <div>
              <label className="font-body text-small font-medium text-kore-ink mb-sm block">{t.tenants.logo}</label>
              <div className="flex items-center gap-lg">
                {tenant.logoUrl ? (
                  <div className="h-16 w-32 border border-kore-border rounded-sm flex items-center justify-center bg-kore-surface overflow-hidden">
                    <img
                      src={`${import.meta.env.VITE_API_URL || ''}/api/uploads/${tenant.logoUrl}`}
                      alt="Logo"
                      className="max-h-14 max-w-28 object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-16 w-32 border border-dashed border-kore-border rounded-sm flex items-center justify-center bg-kore-bg">
                    <span className="font-body text-caption text-kore-faint">Kein Logo</span>
                  </div>
                )}
                <div className="flex gap-sm">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadLogo.isPending}
                    className="flex items-center gap-sm px-md py-md-sm border border-kore-border rounded-sm font-body text-small text-kore-ink hover:border-kore-brass transition-colors disabled:opacity-50"
                  >
                    <Upload size={14} />
                    {uploadLogo.isPending ? t.common.loading : t.tenants.uploadLogo}
                  </button>
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
              <div>
                <label className="font-body text-small font-medium text-kore-ink mb-sm block">{t.tenants.primaryColor}</label>
                <div className="flex items-center gap-md">
                  <input
                    type="color"
                    value={primaryColor || '#9E8460'}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 border border-kore-border rounded-sm cursor-pointer"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="#9E8460"
                    className="flex-1 px-md py-md-sm border border-kore-border rounded-sm font-body text-small text-kore-ink bg-kore-white focus:border-kore-brass focus:outline-none transition-colors"
                  />
                </div>
                <p className="font-body text-[0.7rem] text-kore-faint mt-xs">{t.tenants.colorHint}</p>
              </div>
              <div>
                <label className="font-body text-small font-medium text-kore-ink mb-sm block">{t.tenants.accentColor}</label>
                <div className="flex items-center gap-md">
                  <input
                    type="color"
                    value={accentColor || '#C9B898'}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-10 h-10 border border-kore-border rounded-sm cursor-pointer"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    placeholder="#C9B898"
                    className="flex-1 px-md py-md-sm border border-kore-border rounded-sm font-body text-small text-kore-ink bg-kore-white focus:border-kore-brass focus:outline-none transition-colors"
                  />
                </div>
                <p className="font-body text-[0.7rem] text-kore-faint mt-xs">{t.tenants.colorHint}</p>
              </div>
            </div>

            {/* Preview */}
            {(primaryColor || accentColor) && (
              <div className="flex items-center gap-md p-md bg-kore-bg rounded-sm border border-kore-border">
                <span className="font-body text-small text-kore-mid">Vorschau:</span>
                <div className="flex gap-sm">
                  {primaryColor && (
                    <div className="flex items-center gap-xs">
                      <span className="w-6 h-6 rounded-full border border-kore-border" style={{ backgroundColor: primaryColor }} />
                      <span className="font-body text-[0.7rem] text-kore-mid">Primär</span>
                    </div>
                  )}
                  {accentColor && (
                    <div className="flex items-center gap-xs">
                      <span className="w-6 h-6 rounded-full border border-kore-border" style={{ backgroundColor: accentColor }} />
                      <span className="font-body text-[0.7rem] text-kore-mid">Akzent</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {brandingMsg && (
              <p className={`font-body text-small ${brandingMsg === t.tenants.brandingSaved ? 'text-kore-success' : 'text-kore-error'}`}>
                {brandingMsg}
              </p>
            )}

            <div>
              <Button
                type="button"
                onClick={handleSaveBranding}
                disabled={updateBranding.isPending}
              >
                {updateBranding.isPending ? t.common.loading : t.tenants.saveBranding}
              </Button>
            </div>
          </div>
        </div>

        {/* Stores */}
        <div className="bg-kore-white border border-kore-border p-xl h-fit">
          <div className="flex items-center justify-between mb-lg">
            <h2 className="font-display text-h3 text-kore-ink">Stores</h2>
            <span className="font-body text-caption text-kore-mid">
              {tenant.stores?.length ?? tenant._count?.stores ?? 0} Stores
            </span>
          </div>

          <div className="flex flex-col gap-md">
            {tenant.stores && tenant.stores.length > 0 ? (
              tenant.stores.map((store) => (
                <Link
                  key={store.id}
                  to={`/admin/stores/${store.id}`}
                  className="flex items-center justify-between p-md border border-kore-border hover:border-kore-brass transition-colors group"
                >
                  <div className="flex items-center gap-md min-w-0">
                    <Store size={16} className="text-kore-mid flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-body text-body text-kore-ink font-normal truncate">{store.name}</p>
                      <p className="font-body text-small text-kore-mid">{store.city || '—'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-sm flex-shrink-0">
                    <Badge variant="brass">{store._count?.tools ?? 0} Tools</Badge>
                    <ExternalLink size={14} className="text-kore-faint group-hover:text-kore-brass transition-colors" />
                  </div>
                </Link>
              ))
            ) : (
              <p className="font-body text-small text-kore-mid">Noch keine Stores vorhanden.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
