import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from './helpers/render';
import { mockAuthUser } from './helpers/mocks';
import { useAuthStore } from '../stores/authStore';

// ── Mock hooks used by pages ──────────────────────────────

// ProfilePage hooks
vi.mock('../hooks/useProfile', () => ({
  useProfile: () => ({ data: null, isLoading: false }),
  useUpdateProfile: () => ({ mutate: vi.fn(), isPending: false }),
  useUploadAvatar: () => ({ mutate: vi.fn(), isPending: false }),
  useDeleteAvatar: () => ({ mutate: vi.fn(), isPending: false }),
}));

// OrgchartPage hooks
vi.mock('../hooks/useOrgchart', () => ({
  useOrgchart: () => ({ data: [], isLoading: false, error: null }),
  useSetManager: () => ({ mutate: vi.fn() }),
}));

// BrandingPage uses api() directly in useEffect — mock the api module
vi.mock('../lib/api', () => ({
  api: vi.fn(() => Promise.resolve({})),
  apiUpload: vi.fn(() => Promise.resolve({})),
  setAccessToken: vi.fn(),
  getAccessToken: vi.fn(() => 'fake-token'),
  API_URL: '',
}));

beforeEach(() => {
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });
});

// ── ProfilePage ───────────────────────────────────────────

describe('ProfilePage', () => {
  it('renders without crashing and shows "Profil" text', async () => {
    const user = mockAuthUser();
    const { ProfilePage } = await import('../pages/ProfilePage');
    renderWithProviders(<ProfilePage />, { user });

    // ProfilePage renders "Profil" as h1 when data is null and not loading
    expect(screen.getByText('Profil konnte nicht geladen werden.')).toBeInTheDocument();
  });
});

// ── OrgchartPage ──────────────────────────────────────────

describe('OrgchartPage', () => {
  it('renders without crashing and shows "Organigramm" text', async () => {
    const user = mockAuthUser();
    const { OrgchartPage } = await import('../pages/OrgchartPage');
    renderWithProviders(<OrgchartPage />, { user });

    expect(screen.getByRole('heading', { name: 'Organigramm' })).toBeInTheDocument();
  });
});

// ── BrandingPage ──────────────────────────────────────────

describe('BrandingPage', () => {
  it('renders without crashing and shows "Branding" text', async () => {
    const user = mockAuthUser({ role: 'tenant_admin' });
    const { BrandingPage } = await import('../pages/BrandingPage');
    renderWithProviders(<BrandingPage />, { user });

    // BrandingPage fetches data in useEffect — after loading finishes it should render the title
    await waitFor(() => {
      expect(screen.getByText('Branding')).toBeInTheDocument();
    });
  });
});
