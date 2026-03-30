import { useState, useRef, useEffect } from 'react';
import { Palette, Upload, Save, RotateCcw, Home, MessageSquare, Users, User } from 'lucide-react';
import { api, apiUpload, getAccessToken } from '../lib/api';
import { Breadcrumb } from '../components/Breadcrumb';
import { useToast } from '../components/Toast';
import { useAuthStore } from '../stores/authStore';

interface BrandingData {
  id: string;
  name: string;
  logoUrl: string | null;
  primaryColor: string | null;
  accentColor: string | null;
}

/** AuthStore-Branding nach erfolgreichem Speichern aktualisieren (Live-Feedback in Sidebar) */
function updateStoreBranding(patch: Partial<{ primaryColor: string | null; accentColor: string | null; logoUrl: string | null }>) {
  const { user, setAuth } = useAuthStore.getState();
  if (!user) return;
  const current = user.tenantBranding ?? { tenantName: '', logoUrl: null, primaryColor: null, accentColor: null };
  setAuth(
    { ...user, tenantBranding: { ...current, ...patch } },
    getAccessToken() ?? '',
  );
}

export function BrandingPage() {
  const toast = useToast();
  const { user } = useAuthStore();
  const tenantId = user?.tenantId;

  const [loading, setLoading] = useState(true);
  const [branding, setBranding] = useState<BrandingData | null>(null);
  const [primaryColor, setPrimaryColor] = useState('');
  const [accentColor, setAccentColor] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Load current branding
  useEffect(() => {
    if (!tenantId) return;
    api<BrandingData>(`/api/admin/tenants/${tenantId}/branding`)
      .then((data) => {
        setBranding(data);
        setPrimaryColor(data.primaryColor ?? '');
        setAccentColor(data.accentColor ?? '');
      })
      .catch(() => {
        toast.error('Branding konnte nicht geladen werden.');
      })
      .finally(() => setLoading(false));
  }, [tenantId]);

  async function handleSaveColors() {
    if (!tenantId) return;
    setSaving(true);
    try {
      const result = await api<BrandingData>(`/api/admin/tenants/${tenantId}/branding`, {
        method: 'PUT',
        body: JSON.stringify({
          primaryColor: primaryColor || null,
          accentColor: accentColor || null,
        }),
      });
      setBranding(result);
      // Sidebar sofort aktualisieren
      updateStoreBranding({ primaryColor: result.primaryColor, accentColor: result.accentColor });
      toast.success('Branding gespeichert — Sidebar aktualisiert');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Fehler beim Speichern.');
    } finally {
      setSaving(false);
    }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !tenantId) return;
    setUploading(true);
    try {
      const result = await apiUpload<BrandingData>(`/api/admin/tenants/${tenantId}/logo`, (() => {
        const fd = new FormData();
        fd.append('logo', file);
        return fd;
      })());
      setBranding(result);
      updateStoreBranding({ logoUrl: result.logoUrl });
      toast.success('Logo hochgeladen — Sidebar aktualisiert');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Logo-Upload fehlgeschlagen.');
    } finally {
      setUploading(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  }

  if (!tenantId) {
    return (
      <div className="p-xl max-w-2xl mx-auto">
        <Breadcrumb items={[{ label: 'Home', href: '/app' }, { label: 'Branding' }]} />
        <p className="font-body text-body text-kore-mid">Kein Mandant zugeordnet.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-xl max-w-2xl mx-auto">
        <Breadcrumb items={[{ label: 'Home', href: '/app' }, { label: 'Branding' }]} />
        <div className="animate-pulse space-y-lg">
          <div className="h-6 w-48 bg-kore-surface rounded" />
          <div className="h-64 bg-kore-surface rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-xl max-w-2xl mx-auto">
      <Breadcrumb items={[{ label: 'Home', href: '/app' }, { label: 'Branding' }]} />

      <h1 className="font-display text-h1 text-kore-ink mb-sm flex items-center gap-md">
        <Palette size={24} className="text-kore-brass" />
        Branding
      </h1>
      <p className="font-body text-body text-kore-mid mb-xl">
        Passen Sie Logo und Farben Ihrer Plattform-Oberfläche an.
      </p>

      {/* Logo Section */}
      <div className="bg-kore-white border border-kore-border rounded-lg p-xl mb-xl">
        <h2 className="font-display text-h3 text-kore-ink mb-lg">Logo</h2>

        <div className="flex items-center gap-lg">
          {branding?.logoUrl ? (
            <div className="h-20 w-40 border border-kore-border rounded-sm flex items-center justify-center bg-kore-surface overflow-hidden">
              <img
                src={`/api/uploads/${branding.logoUrl}`}
                alt="Logo"
                className="max-h-16 max-w-36 object-contain"
              />
            </div>
          ) : (
            <div className="h-20 w-40 border border-dashed border-kore-border rounded-sm flex items-center justify-center bg-kore-bg">
              <span className="font-body text-small text-kore-faint">Kein Logo</span>
            </div>
          )}

          <div>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              className="hidden"
              onChange={handleLogoUpload}
            />
            <button
              onClick={() => logoInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-[6px] px-3 py-1.5 rounded border border-kore-border font-body text-small text-kore-ink hover:bg-kore-surface transition-colors disabled:opacity-50"
            >
              <Upload size={14} />
              {uploading ? 'Lade hoch...' : 'Logo hochladen'}
            </button>
            <p className="font-body text-[0.7rem] text-kore-faint mt-xs">
              JPEG, PNG, WebP oder SVG. Max. 2 MB.
            </p>
          </div>
        </div>
      </div>

      {/* Colors Section */}
      <div className="bg-kore-white border border-kore-border rounded-lg p-xl">
        <h2 className="font-display text-h3 text-kore-ink mb-lg">Farben</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-xl mb-xl">
          {/* Primary Color */}
          <div>
            <label className="block font-body text-small text-kore-mid mb-sm">Primärfarbe</label>
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
                className="flex-1 px-3 py-2 rounded border border-kore-border font-body text-body text-kore-ink bg-kore-white focus:outline-none focus:ring-2 focus:ring-kore-brass/30 focus:border-kore-brass transition-colors"
              />
            </div>
            <p className="font-body text-[0.7rem] text-kore-faint mt-xs">
              Wird in der Sidebar für aktive Menüpunkte verwendet.
            </p>
          </div>

          {/* Accent Color */}
          <div>
            <label className="block font-body text-small text-kore-mid mb-sm">Akzentfarbe</label>
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
                className="flex-1 px-3 py-2 rounded border border-kore-border font-body text-body text-kore-ink bg-kore-white focus:outline-none focus:ring-2 focus:ring-kore-brass/30 focus:border-kore-brass transition-colors"
              />
            </div>
            <p className="font-body text-[0.7rem] text-kore-faint mt-xs">
              Sekundäre Farbe für Badges und Hervorhebungen.
            </p>
          </div>
        </div>

        {/* Live Sidebar-Vorschau */}
        <div className="mb-xl">
          <h3 className="font-body text-small text-kore-mid mb-md">Sidebar-Vorschau</h3>
          <div className="bg-kore-ink rounded-lg p-md w-[220px]">
            {/* Mini-Logo */}
            <div className="px-sm pb-md mb-md border-b border-white/10">
              {branding?.logoUrl ? (
                <img
                  src={`/api/uploads/${branding.logoUrl}`}
                  alt="Logo"
                  className="h-6 w-auto max-w-[100px] object-contain"
                />
              ) : (
                <span className="font-display text-[14px] text-white tracking-wider">KORE</span>
              )}
            </div>
            {/* Mock Nav Items */}
            {[
              { icon: Home, label: 'Home', active: true },
              { icon: MessageSquare, label: 'Nachrichten', active: false },
              { icon: Users, label: 'Organigramm', active: false },
              { icon: User, label: 'Mein Profil', active: false },
            ].map((item) => {
              const Icon = item.icon;
              const activeColor = primaryColor || '#9E8460';
              return (
                <div
                  key={item.label}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded text-[12px] mb-0.5 ${
                    item.active ? 'bg-white/10' : 'text-gray-400'
                  }`}
                  style={item.active ? { color: activeColor } : undefined}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                  {item.label === 'Nachrichten' && (
                    <span
                      className="ml-auto text-white text-[8px] font-bold w-[14px] h-[14px] rounded-full flex items-center justify-center"
                      style={{ backgroundColor: accentColor || primaryColor || '#9E8460' }}
                    >
                      3
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setPrimaryColor('');
              setAccentColor('');
            }}
            className="flex items-center gap-[6px] px-3 py-2 rounded border border-kore-border font-body text-small text-kore-mid hover:bg-kore-surface transition-colors"
          >
            <RotateCcw size={14} />
            Auf Standard zurücksetzen
          </button>
          <button
            onClick={handleSaveColors}
            disabled={saving}
            className="flex items-center gap-[6px] px-4 py-2 rounded bg-kore-brass text-kore-white font-body text-small font-medium hover:bg-kore-brass-dk transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save size={14} />
            {saving ? 'Speichere...' : 'Farben speichern'}
          </button>
        </div>
      </div>
    </div>
  );
}
