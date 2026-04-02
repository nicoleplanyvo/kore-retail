import { useState, useEffect } from 'react';
import { User, Calendar, Save, Loader2 } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { useProfile, useUpdateProfile } from '../hooks/useProfile';

const ROLE_LABELS: Record<string, string> = {
  kore_admin: 'Super Admin',
  tenant_admin: 'Admin',
  regional_manager: 'Regional Manager',
  multisite_manager: 'Multisite Manager',
  store_manager: 'Store Manager',
  learner: 'Mitarbeiter',
};

function toDateInputValue(iso: string | null): string {
  if (!iso) return '';
  return iso.slice(0, 10);
}

export function ProfilePage() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const [name, setName] = useState('');
  const [isAbsent, setIsAbsent] = useState(false);
  const [absentFrom, setAbsentFrom] = useState('');
  const [absentUntil, setAbsentUntil] = useState('');
  const [saved, setSaved] = useState(false);

  // Sync local state when profile data loads
  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    const hasAbsence = !!profile.absentFrom || !!profile.absentUntil;
    setIsAbsent(hasAbsence);
    setAbsentFrom(toDateInputValue(profile.absentFrom));
    setAbsentUntil(toDateInputValue(profile.absentUntil));
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;
    setSaved(false);

    await updateProfile.mutateAsync({
      name: name.trim() || profile.name,
      absentFrom: isAbsent && absentFrom ? new Date(absentFrom).toISOString() : null,
      absentUntil: isAbsent && absentUntil ? new Date(absentUntil).toISOString() : null,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-sm text-kore-mid font-body">
        <Loader2 size={16} className="animate-spin" />
        Laden...
      </div>
    );
  }

  if (!profile) {
    return <p className="font-body text-kore-error">Profil nicht gefunden.</p>;
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'Profil' }]} />

      {/* Header */}
      <div className="flex items-center gap-md mb-xl">
        <div className="w-10 h-10 bg-kore-surface flex items-center justify-center rounded-full flex-shrink-0">
          <User size={20} className="text-kore-mid" />
        </div>
        <div>
          <h1 className="font-display text-h2 sm:text-h1 text-kore-ink">Mein Profil</h1>
          <p className="font-body text-small text-kore-mid">
            {ROLE_LABELS[profile.role] || profile.role} &middot; {profile.email}
          </p>
        </div>
      </div>

      <div className="max-w-2xl flex flex-col gap-lg">
        {/* Name Section */}
        <div className="bg-kore-white border border-kore-border p-lg sm:p-xl">
          <h2 className="font-display text-h3 text-kore-ink mb-lg">Persoenliche Daten</h2>
          <div>
            <label className="block font-body text-small text-kore-mid mb-xs">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-md py-sm border border-kore-border font-body text-small text-kore-ink focus:outline-none focus:border-kore-brass"
            />
          </div>
        </div>

        {/* Absence Section */}
        <div className="bg-kore-white border border-kore-border p-lg sm:p-xl">
          <div className="flex items-center gap-md mb-lg">
            <Calendar size={18} className="text-kore-brass" />
            <h2 className="font-display text-h3 text-kore-ink">Abwesenheit</h2>
          </div>

          {/* Toggle */}
          <label className="flex items-center gap-md cursor-pointer mb-lg">
            <input
              type="checkbox"
              checked={isAbsent}
              onChange={(e) => {
                setIsAbsent(e.target.checked);
                if (!e.target.checked) {
                  setAbsentFrom('');
                  setAbsentUntil('');
                }
              }}
              className="w-4 h-4 accent-kore-brass"
            />
            <span className="font-body text-small text-kore-ink">Ich bin abwesend</span>
          </label>

          {/* Date pickers — only visible when toggled on */}
          {isAbsent && (
            <div className="flex flex-col sm:flex-row gap-lg">
              <div className="flex-1">
                <label className="block font-body text-small text-kore-mid mb-xs">Von</label>
                <input
                  type="date"
                  value={absentFrom}
                  onChange={(e) => setAbsentFrom(e.target.value)}
                  className="w-full px-md py-sm border border-kore-border font-body text-small text-kore-ink focus:outline-none focus:border-kore-brass"
                />
              </div>
              <div className="flex-1">
                <label className="block font-body text-small text-kore-mid mb-xs">Bis</label>
                <input
                  type="date"
                  value={absentUntil}
                  onChange={(e) => setAbsentUntil(e.target.value)}
                  className="w-full px-md py-sm border border-kore-border font-body text-small text-kore-ink focus:outline-none focus:border-kore-brass"
                />
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-md">
          <button
            onClick={handleSave}
            disabled={updateProfile.isPending}
            className="flex items-center gap-xs px-lg py-sm bg-kore-ink text-kore-white font-body text-small hover:bg-kore-ink/90 transition-colors disabled:opacity-50"
          >
            {updateProfile.isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {updateProfile.isPending ? 'Speichere...' : 'Speichern'}
          </button>
          {saved && (
            <span className="font-body text-small text-green-600">Gespeichert!</span>
          )}
          {updateProfile.isError && (
            <span className="font-body text-small text-kore-error">
              Fehler beim Speichern.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
