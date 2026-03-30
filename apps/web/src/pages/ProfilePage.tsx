import { useState, useRef, useEffect } from 'react';
import { User, Upload, Trash2, Save, Lock } from 'lucide-react';
import { api } from '../lib/api';
import { Breadcrumb } from '../components/Breadcrumb';
import { useToast } from '../components/Toast';
import { useProfile, useUpdateProfile, useUploadAvatar, useDeleteAvatar } from '../hooks/useProfile';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (parts[0]?.[0] ?? '').toUpperCase();
}

const ROLE_LABELS: Record<string, string> = {
  kore_admin: 'Admin',
  tenant_admin: 'Kunden-Admin',
  regional_manager: 'Regional Manager',
  multisite_manager: 'Multisite Manager',
  store_manager: 'Store Manager',
  learner: 'Mitarbeiter',
};

function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-lg">
      <div className="h-6 w-48 bg-kore-surface rounded" />
      <div className="bg-kore-white border border-kore-border rounded-lg p-xl">
        <div className="flex flex-col items-center gap-md mb-xl">
          <div className="w-[96px] h-[96px] rounded-full bg-kore-surface" />
          <div className="flex gap-sm">
            <div className="h-9 w-28 bg-kore-surface rounded" />
            <div className="h-9 w-28 bg-kore-surface rounded" />
          </div>
        </div>
        <div className="space-y-md">
          <div className="h-10 bg-kore-surface rounded" />
          <div className="h-10 bg-kore-surface rounded" />
          <div className="h-10 bg-kore-surface rounded" />
          <div className="h-10 bg-kore-surface rounded" />
        </div>
      </div>
    </div>
  );
}

export function ProfilePage() {
  const toast = useToast();
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const deleteAvatar = useDeleteAvatar();

  const [name, setName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSubmitting, setPwSubmitting] = useState(false);

  useEffect(() => {
    if (profile?.name) setName(profile.name);
  }, [profile?.name]);

  const nameChanged = profile ? name.trim() !== profile.name : false;

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadAvatar.mutate(file, {
      onSuccess: () => toast.success('Avatar hochgeladen'),
      onError: () => toast.error('Avatar-Upload fehlgeschlagen'),
    });
    e.target.value = '';
  }

  function handleRemoveAvatar() {
    deleteAvatar.mutate(undefined, {
      onSuccess: () => toast.success('Avatar entfernt'),
      onError: () => toast.error('Avatar konnte nicht entfernt werden'),
    });
  }

  function handleSave() {
    if (!nameChanged) return;
    updateProfile.mutate({ name: name.trim() }, {
      onSuccess: () => toast.success('Profil gespeichert'),
      onError: () => toast.error('Profil konnte nicht gespeichert werden'),
    });
  }

  if (isLoading) {
    return (
      <div className="p-xl max-w-2xl mx-auto">
        <Breadcrumb items={[{ label: 'Home', href: '/app' }, { label: 'Profil' }]} />
        <ProfileSkeleton />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-xl max-w-2xl mx-auto">
        <Breadcrumb items={[{ label: 'Home', href: '/app' }, { label: 'Profil' }]} />
        <p className="font-body text-body text-kore-mid">Profil konnte nicht geladen werden.</p>
      </div>
    );
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError('');

    if (!currentPassword) {
      setPwError('Bitte geben Sie Ihr aktuelles Passwort ein.');
      return;
    }
    if (newPassword.length < 8) {
      setPwError('Das neue Passwort muss mindestens 8 Zeichen lang sein.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPwError('Die neuen Passwörter stimmen nicht überein.');
      return;
    }

    setPwSubmitting(true);
    try {
      await api('/api/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      toast.success('Passwort erfolgreich geändert');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Passwort konnte nicht geändert werden.';
      setPwError(msg);
      toast.error(msg);
    } finally {
      setPwSubmitting(false);
    }
  }

  const roleLabel = ROLE_LABELS[profile.role] ?? profile.role;

  return (
    <div className="p-xl max-w-2xl mx-auto">
      <Breadcrumb items={[{ label: 'Home', href: '/app' }, { label: 'Profil' }]} />

      <h1 className="font-display text-h1 text-kore-ink mb-xl">Profil</h1>

      <div className="bg-kore-white border border-kore-border rounded-lg p-xl">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-md mb-xl">
          <div className="w-[96px] h-[96px] rounded-full bg-kore-surface flex items-center justify-center overflow-hidden">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-display text-h1 text-kore-mid select-none">
                {getInitials(profile.name)}
              </span>
            )}
          </div>

          <div className="flex gap-sm">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadAvatar.isPending}
              className="flex items-center gap-[6px] px-3 py-1.5 rounded border border-kore-border font-body text-small text-kore-ink hover:bg-kore-surface transition-colors disabled:opacity-50"
            >
              <Upload size={14} />
              {uploadAvatar.isPending ? 'Lade...' : 'Hochladen'}
            </button>
            {profile.avatarUrl && (
              <button
                onClick={handleRemoveAvatar}
                disabled={deleteAvatar.isPending}
                className="flex items-center gap-[6px] px-3 py-1.5 rounded border border-kore-border font-body text-small text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <Trash2 size={14} />
                Entfernen
              </button>
            )}
          </div>
        </div>

        {/* Profile Fields */}
        <div className="space-y-md">
          {/* Name */}
          <div>
            <label className="block font-body text-small text-kore-mid mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded border border-kore-border font-body text-body text-kore-ink bg-kore-white focus:outline-none focus:ring-2 focus:ring-kore-brass/30 focus:border-kore-brass transition-colors"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block font-body text-small text-kore-mid mb-1">E-Mail</label>
            <input
              type="email"
              value={profile.email}
              readOnly
              className="w-full px-3 py-2 rounded border border-kore-border font-body text-body text-kore-mid bg-kore-faint cursor-not-allowed"
            />
          </div>

          {/* Role (read-only badge) */}
          <div>
            <label className="block font-body text-small text-kore-mid mb-1">Rolle</label>
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-kore-surface font-body text-small text-kore-ink">
              {roleLabel}
            </span>
          </div>

          {/* Manager (read-only) */}
          <div>
            <label className="block font-body text-small text-kore-mid mb-1">Vorgesetzte/r</label>
            <input
              type="text"
              value={profile.managerName ?? 'Nicht zugewiesen'}
              readOnly
              className="w-full px-3 py-2 rounded border border-kore-border font-body text-body text-kore-mid bg-kore-faint cursor-not-allowed"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-xl flex justify-end">
          <button
            onClick={handleSave}
            disabled={!nameChanged || updateProfile.isPending}
            className="flex items-center gap-[6px] px-4 py-2 rounded bg-kore-brass text-kore-white font-body text-small font-medium hover:bg-kore-brass-dk transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save size={14} />
            {updateProfile.isPending ? 'Speichere...' : 'Speichern'}
          </button>
        </div>
      </div>

      {/* Password Change Section */}
      <div className="bg-kore-white border border-kore-border rounded-lg p-xl mt-xl">
        <h2 className="font-display text-h3 text-kore-ink mb-lg flex items-center gap-sm">
          <Lock size={18} />
          Passwort ändern
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-md">
          <div>
            <label className="block font-body text-small text-kore-mid mb-1">
              Aktuelles Passwort
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 rounded border border-kore-border font-body text-body text-kore-ink bg-kore-white focus:outline-none focus:ring-2 focus:ring-kore-brass/30 focus:border-kore-brass transition-colors"
            />
          </div>

          <div>
            <label className="block font-body text-small text-kore-mid mb-1">
              Neues Passwort
            </label>
            <input
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 rounded border border-kore-border font-body text-body text-kore-ink bg-kore-white focus:outline-none focus:ring-2 focus:ring-kore-brass/30 focus:border-kore-brass transition-colors"
            />
          </div>

          <div>
            <label className="block font-body text-small text-kore-mid mb-1">
              Neues Passwort bestätigen
            </label>
            <input
              type="password"
              autoComplete="new-password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full px-3 py-2 rounded border border-kore-border font-body text-body text-kore-ink bg-kore-white focus:outline-none focus:ring-2 focus:ring-kore-brass/30 focus:border-kore-brass transition-colors"
            />
          </div>

          {pwError && (
            <p className="font-body text-small text-kore-error">{pwError}</p>
          )}

          <div className="flex justify-end pt-sm">
            <button
              type="submit"
              disabled={pwSubmitting}
              className="flex items-center gap-[6px] px-4 py-2 rounded bg-kore-brass text-kore-white font-body text-small font-medium hover:bg-kore-brass-dk transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Lock size={14} />
              {pwSubmitting ? 'Wird geändert...' : 'Passwort ändern'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
