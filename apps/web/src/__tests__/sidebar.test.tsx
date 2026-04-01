import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './helpers/render';
import { mockAuthUser } from './helpers/mocks';
import { useAuthStore } from '../stores/authStore';

// Mock hooks that AppSidebar depends on
vi.mock('../hooks/useMyTools', () => ({
  useMyTools: () => ({ data: [] }),
}));
vi.mock('../hooks/useMessaging', () => ({
  useUnreadCount: () => ({ data: 0 }),
}));

import { AppSidebar } from '../components/AppSidebar';

beforeEach(() => {
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });
});

describe('AppSidebar', () => {
  const defaultProps = { open: true, onClose: vi.fn(), collapsed: false, onToggleCollapse: vi.fn() };

  it('renders "Home" link for any user', () => {
    const user = mockAuthUser();
    renderWithProviders(<AppSidebar {...defaultProps} />, { user });

    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders "Nachrichten" link', () => {
    const user = mockAuthUser();
    renderWithProviders(<AppSidebar {...defaultProps} />, { user });

    expect(screen.getByText('Nachrichten')).toBeInTheDocument();
  });

  it('renders "Organigramm" link', () => {
    const user = mockAuthUser();
    renderWithProviders(<AppSidebar {...defaultProps} />, { user });

    expect(screen.getByText('Organigramm')).toBeInTheDocument();
  });

  it('renders "Mein Profil" link', () => {
    const user = mockAuthUser();
    renderWithProviders(<AppSidebar {...defaultProps} />, { user });

    expect(screen.getByText('Mein Profil')).toBeInTheDocument();
  });

  it('shows "Branding" link for tenant_admin', () => {
    const user = mockAuthUser({ role: 'tenant_admin' });
    renderWithProviders(<AppSidebar {...defaultProps} />, { user });

    expect(screen.getByText('Branding')).toBeInTheDocument();
  });

  it('shows "Branding" link for kore_admin', () => {
    const user = mockAuthUser({ role: 'kore_admin' });
    renderWithProviders(<AppSidebar {...defaultProps} />, { user });

    expect(screen.getByText('Branding')).toBeInTheDocument();
  });

  it('does NOT show "Branding" for learner', () => {
    const user = mockAuthUser({ role: 'learner' });
    renderWithProviders(<AppSidebar {...defaultProps} />, { user });

    expect(screen.queryByText('Branding')).not.toBeInTheDocument();
  });

  it('shows "KORE" text when no tenant logo', () => {
    const user = mockAuthUser({
      tenantBranding: {
        tenantName: 'Test Tenant',
        logoUrl: null,
        primaryColor: null,
        accentColor: null,
      },
    });
    renderWithProviders(<AppSidebar {...defaultProps} />, { user });

    expect(screen.getByText('KORE')).toBeInTheDocument();
  });

  it('shows tenant name from branding', () => {
    const user = mockAuthUser({
      tenantBranding: {
        tenantName: 'Luxus Store GmbH',
        logoUrl: null,
        primaryColor: null,
        accentColor: null,
      },
    });
    renderWithProviders(<AppSidebar {...defaultProps} />, { user });

    expect(screen.getByText('Luxus Store GmbH')).toBeInTheDocument();
  });
});
