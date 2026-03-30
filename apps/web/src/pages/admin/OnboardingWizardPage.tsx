import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Stepper } from '../../components/Stepper';
import { FormField } from '../../components/FormField';
import { LoadingButton } from '../../components/LoadingButton';
import { useAdminTools } from '../../hooks/useAdminTools';
import { useAuthStore } from '../../stores/authStore';
import { api } from '../../lib/api';

/* ─── Types ─── */

interface TenantData {
  name: string;
  slug: string;
  contactEmail: string;
  contactName: string;
  contactPhone: string;
  maxUsers: number;
}

interface AdminData {
  name: string;
  email: string;
  password: string;
}

interface StoreData {
  name: string;
  city: string;
  address: string;
}

interface BrandingData {
  primaryColor: string;
  accentColor: string;
}

interface CreationResult {
  tenantId: string;
  storeId: string;
  adminUserId: string;
}

/* ─── Slug helper ─── */

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe')
    .replace(/[üÜ]/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/* ─── Constants ─── */

const STEPS = ['Tenant', 'Admin', 'Store', 'Tools', 'Branding', 'Zusammenfassung'];

const CATEGORY_LABELS: Record<string, string> = {
  STANDARDS_COMPLIANCE: 'Standards & Compliance',
  PERFORMANCE: 'Performance & Sichtbarkeit',
  FLOOR: 'Floor in Echtzeit',
  TRAINING: 'Training & Entwicklung',
  COACHING_PEOPLE: 'Coaching & People',
  KOMMUNIKATION: 'Kommunikation & Signal',
  CUSTOMER_STOCK: 'Customer, Clienteling & Stock',
  REGIONAL_INSIGHTS: 'Regional Insights',
};

/* ─── Component ─── */

export function OnboardingWizardPage() {
  const { user } = useAuthStore();

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [tenantData, setTenantData] = useState<TenantData>({
    name: '',
    slug: '',
    contactEmail: '',
    contactName: '',
    contactPhone: '',
    maxUsers: 15,
  });

  const [adminData, setAdminData] = useState<AdminData>({
    name: '',
    email: '',
    password: '',
  });

  const [storeData, setStoreData] = useState<StoreData>({
    name: '',
    city: '',
    address: '',
  });

  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  const [brandingData, setBrandingData] = useState<BrandingData>({
    primaryColor: '#b08d57',
    accentColor: '#1a1a1a',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitProgress, setSubmitProgress] = useState('');
  const [result, setResult] = useState<CreationResult | null>(null);

  const { data: availableTools, isLoading: toolsLoading } = useAdminTools();

  // Group tools by category
  const toolsByCategory = useMemo(() => {
    if (!availableTools) return {};
    const grouped: Record<string, typeof availableTools> = {};
    for (const tool of availableTools) {
      const cat = tool.category || 'SONSTIGE';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat]!.push(tool);
    }
    return grouped;
  }, [availableTools]);

  // Guard: only kore_admin
  if (user?.role !== 'kore_admin') {
    return (
      <div className="p-xl max-w-2xl mx-auto text-center">
        <p className="text-kore-mid font-body">Nur KORE-Administratoren haben Zugriff auf diese Seite.</p>
      </div>
    );
  }

  /* ─── Validation ─── */

  function validateStep(s: number): boolean {
    const errs: Record<string, string> = {};

    if (s === 0) {
      if (!tenantData.name.trim()) errs.tenantName = 'Name ist erforderlich';
      if (!tenantData.slug.trim()) errs.tenantSlug = 'Slug ist erforderlich';
      else if (!/^[a-z0-9-]+$/.test(tenantData.slug)) errs.tenantSlug = 'Nur Kleinbuchstaben, Zahlen und Bindestriche';
      if (tenantData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tenantData.contactEmail)) {
        errs.tenantEmail = 'Ungültige E-Mail-Adresse';
      }
      if (tenantData.maxUsers < 1) errs.maxUsers = 'Mindestens 1 Benutzer';
    }

    if (s === 1) {
      if (!adminData.name.trim()) errs.adminName = 'Name ist erforderlich';
      if (!adminData.email.trim()) errs.adminEmail = 'E-Mail ist erforderlich';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminData.email)) errs.adminEmail = 'Ungültige E-Mail-Adresse';
      if (!adminData.password) errs.adminPassword = 'Passwort ist erforderlich';
      else if (adminData.password.length < 8) errs.adminPassword = 'Mindestens 8 Zeichen';
    }

    if (s === 2) {
      if (!storeData.name.trim()) errs.storeName = 'Store-Name ist erforderlich';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  /* ─── Navigation ─── */

  function nextStep() {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function prevStep() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  /* ─── Tool selection ─── */

  function toggleTool(toolId: string) {
    setSelectedTools((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );
  }

  function selectAllTools() {
    if (!availableTools) return;
    setSelectedTools(availableTools.map((t) => t.id));
  }

  function deselectAllTools() {
    setSelectedTools([]);
  }

  /* ─── Submit ─── */

  async function handleSubmit() {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 1. Create tenant
      setSubmitProgress('Tenant wird erstellt...');
      const tenant = await api<{ id: string }>('/api/admin/tenants', {
        method: 'POST',
        body: JSON.stringify({
          name: tenantData.name,
          slug: tenantData.slug,
          contactEmail: tenantData.contactEmail || undefined,
          contactName: tenantData.contactName || undefined,
          contactPhone: tenantData.contactPhone || undefined,
          maxUsers: tenantData.maxUsers,
        }),
      });

      // 2. Create store
      setSubmitProgress('Store wird erstellt...');
      const store = await api<{ id: string }>('/api/admin/stores', {
        method: 'POST',
        body: JSON.stringify({
          tenantId: tenant.id,
          name: storeData.name,
          city: storeData.city || undefined,
          address: storeData.address || undefined,
        }),
      });

      // 3. Create admin user
      setSubmitProgress('Admin-Benutzer wird erstellt...');
      const adminUser = await api<{ id: string }>('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({
          name: adminData.name,
          email: adminData.email,
          password: adminData.password,
          role: 'tenant_admin',
          tenantId: tenant.id,
          storeIds: [store.id],
        }),
      });

      // 4. Assign tools
      if (selectedTools.length > 0) {
        setSubmitProgress('Tools werden zugewiesen...');
        await api(`/api/admin/stores/${store.id}/tools/assign`, {
          method: 'POST',
          body: JSON.stringify({ toolIds: selectedTools }),
        });
      }

      // 5. Set branding
      setSubmitProgress('Branding wird gespeichert...');
      await api(`/api/admin/tenants/${tenant.id}/branding`, {
        method: 'PUT',
        body: JSON.stringify({
          primaryColor: brandingData.primaryColor,
          accentColor: brandingData.accentColor,
        }),
      });

      setSubmitProgress('');
      setResult({
        tenantId: tenant.id,
        storeId: store.id,
        adminUserId: adminUser.id,
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      setSubmitProgress('');
    } finally {
      setIsSubmitting(false);
    }
  }

  /* ─── Success view ─── */

  if (result) {
    return (
      <div className="p-xl max-w-2xl mx-auto">
        <div className="bg-white border border-kore-border rounded-md p-8 text-center">
          <CheckCircle2 size={48} className="text-green-500 mx-auto mb-lg" />
          <h2 className="font-display text-h3 text-kore-ink mb-md">Tenant erfolgreich erstellt</h2>
          <p className="font-body text-body text-kore-mid mb-lg">
            <strong>{tenantData.name}</strong> wurde eingerichtet mit Store <strong>{storeData.name}</strong> und
            Admin-Benutzer <strong>{adminData.name}</strong>.
          </p>

          <div className="bg-kore-bg rounded-md p-md mb-lg text-left space-y-xs">
            <p className="font-body text-small text-kore-mid">
              <span className="font-medium text-kore-ink">Tenant-ID:</span> {result.tenantId}
            </p>
            <p className="font-body text-small text-kore-mid">
              <span className="font-medium text-kore-ink">Store-ID:</span> {result.storeId}
            </p>
            <p className="font-body text-small text-kore-mid">
              <span className="font-medium text-kore-ink">Admin-Login:</span> {adminData.email}
            </p>
            <p className="font-body text-small text-kore-mid">
              <span className="font-medium text-kore-ink">Zugewiesene Tools:</span> {selectedTools.length}
            </p>
          </div>

          <div className="flex items-center justify-center gap-md">
            <Link
              to="/app"
              className="btn-secondary text-sm"
            >
              Zur Startseite
            </Link>
            <button
              onClick={() => {
                setStep(0);
                setResult(null);
                setTenantData({ name: '', slug: '', contactEmail: '', contactName: '', contactPhone: '', maxUsers: 15 });
                setAdminData({ name: '', email: '', password: '' });
                setStoreData({ name: '', city: '', address: '' });
                setSelectedTools([]);
                setBrandingData({ primaryColor: '#b08d57', accentColor: '#1a1a1a' });
              }}
              className="btn-primary text-sm"
            >
              Weiteren Tenant einrichten
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Step content ─── */

  return (
    <div className="p-xl max-w-2xl mx-auto">
      <h1 className="font-display text-h2 text-kore-ink mb-lg">Neuen Tenant einrichten</h1>

      <Stepper steps={STEPS} currentStep={step} />

      <div className="bg-white border border-kore-border rounded-md p-8 mb-lg">
        {/* Step 0: Tenant-Daten */}
        {step === 0 && (
          <div className="space-y-lg">
            <h2 className="font-display text-h3 text-kore-ink mb-md">Tenant-Daten</h2>

            <FormField label="Name" required error={errors.tenantName}>
              <input
                type="text"
                className="input-default"
                placeholder="z.B. Fashion Store GmbH"
                value={tenantData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setTenantData((prev) => ({
                    ...prev,
                    name,
                    slug: prev.slug === toSlug(prev.name) || !prev.slug ? toSlug(name) : prev.slug,
                  }));
                }}
              />
            </FormField>

            <FormField label="Slug" required error={errors.tenantSlug} hint="URL-freundlicher Bezeichner (Kleinbuchstaben, Bindestriche)">
              <input
                type="text"
                className="input-default"
                placeholder="z.B. fashion-store-gmbh"
                value={tenantData.slug}
                onChange={(e) => setTenantData((prev) => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
              />
            </FormField>

            <FormField label="Kontakt-E-Mail" error={errors.tenantEmail}>
              <input
                type="email"
                className="input-default"
                placeholder="kontakt@example.com"
                value={tenantData.contactEmail}
                onChange={(e) => setTenantData((prev) => ({ ...prev, contactEmail: e.target.value }))}
              />
            </FormField>

            <FormField label="Kontaktperson">
              <input
                type="text"
                className="input-default"
                placeholder="Max Mustermann"
                value={tenantData.contactName}
                onChange={(e) => setTenantData((prev) => ({ ...prev, contactName: e.target.value }))}
              />
            </FormField>

            <FormField label="Telefon">
              <input
                type="tel"
                className="input-default"
                placeholder="+49 123 456789"
                value={tenantData.contactPhone}
                onChange={(e) => setTenantData((prev) => ({ ...prev, contactPhone: e.target.value }))}
              />
            </FormField>

            <FormField label="Max. Benutzer" required error={errors.maxUsers}>
              <input
                type="number"
                className="input-default"
                min={1}
                value={tenantData.maxUsers}
                onChange={(e) => setTenantData((prev) => ({ ...prev, maxUsers: parseInt(e.target.value) || 1 }))}
              />
            </FormField>
          </div>
        )}

        {/* Step 1: Admin-Benutzer */}
        {step === 1 && (
          <div className="space-y-lg">
            <h2 className="font-display text-h3 text-kore-ink mb-md">Admin-Benutzer</h2>
            <p className="font-body text-small text-kore-mid mb-md">
              Dieser Benutzer wird als <span className="font-medium text-kore-ink">Tenant-Admin</span> angelegt und erhält vollen Zugriff.
            </p>

            <FormField label="Name" required error={errors.adminName}>
              <input
                type="text"
                className="input-default"
                placeholder="Vorname Nachname"
                value={adminData.name}
                onChange={(e) => setAdminData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </FormField>

            <FormField label="E-Mail" required error={errors.adminEmail}>
              <input
                type="email"
                className="input-default"
                placeholder="admin@example.com"
                value={adminData.email}
                onChange={(e) => setAdminData((prev) => ({ ...prev, email: e.target.value }))}
              />
            </FormField>

            <FormField label="Passwort" required error={errors.adminPassword} hint="Mindestens 8 Zeichen">
              <input
                type="password"
                className="input-default"
                placeholder="Sicheres Passwort"
                value={adminData.password}
                onChange={(e) => setAdminData((prev) => ({ ...prev, password: e.target.value }))}
              />
            </FormField>
          </div>
        )}

        {/* Step 2: Erster Store */}
        {step === 2 && (
          <div className="space-y-lg">
            <h2 className="font-display text-h3 text-kore-ink mb-md">Erster Store</h2>

            <FormField label="Store-Name" required error={errors.storeName}>
              <input
                type="text"
                className="input-default"
                placeholder="z.B. Flagship Berlin"
                value={storeData.name}
                onChange={(e) => setStoreData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </FormField>

            <FormField label="Stadt">
              <input
                type="text"
                className="input-default"
                placeholder="z.B. Berlin"
                value={storeData.city}
                onChange={(e) => setStoreData((prev) => ({ ...prev, city: e.target.value }))}
              />
            </FormField>

            <FormField label="Adresse">
              <input
                type="text"
                className="input-default"
                placeholder="z.B. Kurfürstendamm 42"
                value={storeData.address}
                onChange={(e) => setStoreData((prev) => ({ ...prev, address: e.target.value }))}
              />
            </FormField>
          </div>
        )}

        {/* Step 3: Tools auswählen */}
        {step === 3 && (
          <div className="space-y-lg">
            <div className="flex items-center justify-between mb-md">
              <h2 className="font-display text-h3 text-kore-ink">Tools auswählen</h2>
              <div className="flex items-center gap-sm">
                <button
                  type="button"
                  onClick={selectAllTools}
                  className="font-body text-xs text-kore-brass hover:text-kore-brass-dk transition-colors"
                >
                  Alle auswählen
                </button>
                <span className="text-kore-border">|</span>
                <button
                  type="button"
                  onClick={deselectAllTools}
                  className="font-body text-xs text-kore-mid hover:text-kore-ink transition-colors"
                >
                  Keine
                </button>
              </div>
            </div>

            <p className="font-body text-small text-kore-mid">
              {selectedTools.length} von {availableTools?.length || 0} Tools ausgewählt
            </p>

            {toolsLoading ? (
              <div className="flex items-center justify-center py-xl">
                <Loader2 size={24} className="animate-spin text-kore-brass" />
                <span className="ml-md font-body text-small text-kore-mid">Tools werden geladen...</span>
              </div>
            ) : (
              <div className="space-y-lg">
                {Object.entries(toolsByCategory).map(([category, tools]) => (
                  <div key={category}>
                    <p className="font-body text-xs text-kore-mid uppercase tracking-wider mb-sm">
                      {CATEGORY_LABELS[category] || category}
                    </p>
                    <div className="space-y-xs">
                      {tools.map((tool) => (
                        <label
                          key={tool.id}
                          className={`
                            flex items-center gap-md p-md rounded-sm border cursor-pointer transition-colors duration-200
                            ${selectedTools.includes(tool.id)
                              ? 'border-kore-brass bg-kore-brass/5'
                              : 'border-kore-border hover:border-kore-mid'}
                          `}
                        >
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded accent-kore-brass"
                            checked={selectedTools.includes(tool.id)}
                            onChange={() => toggleTool(tool.id)}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-body text-small font-medium text-kore-ink">{tool.name}</p>
                            {tool.description && (
                              <p className="font-body text-xs text-kore-mid truncate">{tool.description}</p>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Branding */}
        {step === 4 && (
          <div className="space-y-lg">
            <h2 className="font-display text-h3 text-kore-ink mb-md">Branding</h2>
            <p className="font-body text-small text-kore-mid mb-md">
              Optional: Farben für die Plattform des Tenants festlegen. Kann später geändert werden.
            </p>

            <FormField label="Primärfarbe">
              <div className="flex items-center gap-md">
                <input
                  type="color"
                  className="w-12 h-10 border border-kore-border rounded cursor-pointer"
                  value={brandingData.primaryColor}
                  onChange={(e) => setBrandingData((prev) => ({ ...prev, primaryColor: e.target.value }))}
                />
                <input
                  type="text"
                  className="input-default flex-1"
                  value={brandingData.primaryColor}
                  onChange={(e) => setBrandingData((prev) => ({ ...prev, primaryColor: e.target.value }))}
                  placeholder="#b08d57"
                />
              </div>
            </FormField>

            <FormField label="Akzentfarbe">
              <div className="flex items-center gap-md">
                <input
                  type="color"
                  className="w-12 h-10 border border-kore-border rounded cursor-pointer"
                  value={brandingData.accentColor}
                  onChange={(e) => setBrandingData((prev) => ({ ...prev, accentColor: e.target.value }))}
                />
                <input
                  type="text"
                  className="input-default flex-1"
                  value={brandingData.accentColor}
                  onChange={(e) => setBrandingData((prev) => ({ ...prev, accentColor: e.target.value }))}
                  placeholder="#1a1a1a"
                />
              </div>
            </FormField>

            {/* Preview */}
            <div className="mt-lg">
              <p className="font-body text-xs text-kore-mid uppercase tracking-wider mb-sm">Vorschau</p>
              <div className="flex items-center gap-md">
                <div
                  className="w-16 h-16 rounded-md border border-kore-border flex items-center justify-center"
                  style={{ backgroundColor: brandingData.primaryColor }}
                >
                  <span className="text-white text-xs font-medium">Primär</span>
                </div>
                <div
                  className="w-16 h-16 rounded-md border border-kore-border flex items-center justify-center"
                  style={{ backgroundColor: brandingData.accentColor }}
                >
                  <span className="text-white text-xs font-medium">Akzent</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setBrandingData({ primaryColor: '#b08d57', accentColor: '#1a1a1a' })}
              className="font-body text-xs text-kore-mid hover:text-kore-ink transition-colors underline"
            >
              Auf Standardwerte zurücksetzen
            </button>
          </div>
        )}

        {/* Step 5: Zusammenfassung */}
        {step === 5 && (
          <div className="space-y-lg">
            <h2 className="font-display text-h3 text-kore-ink mb-md">Zusammenfassung</h2>

            {/* Tenant */}
            <div className="border-b border-kore-border pb-md">
              <div className="flex items-center justify-between mb-sm">
                <p className="font-body text-xs text-kore-mid uppercase tracking-wider">Tenant</p>
                <button onClick={() => setStep(0)} className="font-body text-xs text-kore-brass hover:underline">
                  Bearbeiten
                </button>
              </div>
              <p className="font-body text-body font-medium text-kore-ink">{tenantData.name}</p>
              <p className="font-body text-small text-kore-mid">Slug: {tenantData.slug}</p>
              {tenantData.contactEmail && (
                <p className="font-body text-small text-kore-mid">E-Mail: {tenantData.contactEmail}</p>
              )}
              {tenantData.contactName && (
                <p className="font-body text-small text-kore-mid">Kontakt: {tenantData.contactName}</p>
              )}
              <p className="font-body text-small text-kore-mid">Max. Benutzer: {tenantData.maxUsers}</p>
            </div>

            {/* Admin */}
            <div className="border-b border-kore-border pb-md">
              <div className="flex items-center justify-between mb-sm">
                <p className="font-body text-xs text-kore-mid uppercase tracking-wider">Admin-Benutzer</p>
                <button onClick={() => setStep(1)} className="font-body text-xs text-kore-brass hover:underline">
                  Bearbeiten
                </button>
              </div>
              <p className="font-body text-body font-medium text-kore-ink">{adminData.name}</p>
              <p className="font-body text-small text-kore-mid">{adminData.email}</p>
              <p className="font-body text-small text-kore-mid">Rolle: Tenant-Admin</p>
            </div>

            {/* Store */}
            <div className="border-b border-kore-border pb-md">
              <div className="flex items-center justify-between mb-sm">
                <p className="font-body text-xs text-kore-mid uppercase tracking-wider">Store</p>
                <button onClick={() => setStep(2)} className="font-body text-xs text-kore-brass hover:underline">
                  Bearbeiten
                </button>
              </div>
              <p className="font-body text-body font-medium text-kore-ink">{storeData.name}</p>
              {storeData.city && <p className="font-body text-small text-kore-mid">{storeData.city}</p>}
              {storeData.address && <p className="font-body text-small text-kore-mid">{storeData.address}</p>}
            </div>

            {/* Tools */}
            <div className="border-b border-kore-border pb-md">
              <div className="flex items-center justify-between mb-sm">
                <p className="font-body text-xs text-kore-mid uppercase tracking-wider">Tools</p>
                <button onClick={() => setStep(3)} className="font-body text-xs text-kore-brass hover:underline">
                  Bearbeiten
                </button>
              </div>
              <p className="font-body text-small text-kore-mid">
                {selectedTools.length} Tool{selectedTools.length !== 1 ? 's' : ''} ausgewählt
              </p>
              {selectedTools.length > 0 && availableTools && (
                <div className="flex flex-wrap gap-xs mt-sm">
                  {availableTools
                    .filter((t) => selectedTools.includes(t.id))
                    .map((t) => (
                      <span key={t.id} className="tag-default text-[0.65rem]">
                        {t.name}
                      </span>
                    ))}
                </div>
              )}
            </div>

            {/* Branding */}
            <div>
              <div className="flex items-center justify-between mb-sm">
                <p className="font-body text-xs text-kore-mid uppercase tracking-wider">Branding</p>
                <button onClick={() => setStep(4)} className="font-body text-xs text-kore-brass hover:underline">
                  Bearbeiten
                </button>
              </div>
              <div className="flex items-center gap-md">
                <div className="flex items-center gap-sm">
                  <div className="w-5 h-5 rounded-sm border border-kore-border" style={{ backgroundColor: brandingData.primaryColor }} />
                  <span className="font-body text-small text-kore-mid">{brandingData.primaryColor}</span>
                </div>
                <div className="flex items-center gap-sm">
                  <div className="w-5 h-5 rounded-sm border border-kore-border" style={{ backgroundColor: brandingData.accentColor }} />
                  <span className="font-body text-small text-kore-mid">{brandingData.accentColor}</span>
                </div>
              </div>
            </div>

            {/* Submit error */}
            {submitError && (
              <div className="flex items-start gap-md p-md bg-red-50 border border-red-200 rounded-md">
                <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-body text-small font-medium text-red-700">Fehler bei der Erstellung</p>
                  <p className="font-body text-xs text-red-600">{submitError}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div>
          {step > 0 && (
            <button
              type="button"
              onClick={prevStep}
              disabled={isSubmitting}
              className="inline-flex items-center gap-sm font-body text-small text-kore-mid hover:text-kore-ink transition-colors disabled:opacity-50"
            >
              <ChevronLeft size={16} />
              Zurück
            </button>
          )}
        </div>

        <div className="flex items-center gap-md">
          {isSubmitting && submitProgress && (
            <span className="font-body text-xs text-kore-mid flex items-center gap-sm">
              <Loader2 size={14} className="animate-spin" />
              {submitProgress}
            </span>
          )}

          {step === 4 && (
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex items-center gap-sm font-body text-small text-kore-mid hover:text-kore-ink transition-colors"
            >
              Überspringen
              <ChevronRight size={16} />
            </button>
          )}

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className="btn-primary text-sm"
            >
              Weiter
              <ChevronRight size={16} />
            </button>
          ) : (
            <LoadingButton
              isLoading={isSubmitting}
              loadingText="Wird erstellt..."
              onClick={handleSubmit}
              variant="primary"
            >
              Tenant erstellen
            </LoadingButton>
          )}
        </div>
      </div>
    </div>
  );
}
