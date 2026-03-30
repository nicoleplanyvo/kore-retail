import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { useAuthStore } from '../stores/authStore';
import { renderWithProviders } from './helpers/render';
import { mockAuthUser } from './helpers/mocks';
import { ProtectedRoute } from '../components/ProtectedRoute';

// Reset auth store before each test
beforeEach(() => {
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });
});

// ── authStore unit tests ──────────────────────────────────

describe('authStore', () => {
  it('setAuth stores user and sets isAuthenticated to true', () => {
    const user = mockAuthUser();
    useAuthStore.getState().setAuth(user, 'fake-token');

    const state = useAuthStore.getState();
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it('clearAuth resets user to null and isAuthenticated to false', () => {
    // First set auth
    const user = mockAuthUser();
    useAuthStore.getState().setAuth(user, 'fake-token');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    // Then clear
    useAuthStore.getState().clearAuth();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });
});

// ── ProtectedRoute component tests ───────────────────────

describe('ProtectedRoute', () => {
  it('redirects to /login when not authenticated', () => {
    renderWithProviders(<ProtectedRoute />, { route: '/app' });

    // Navigate should redirect to /login
    expect(window.location.pathname).toBe('/login');
  });

  it('stays on current route when authenticated', () => {
    const user = mockAuthUser();
    renderWithProviders(<ProtectedRoute />, {
      user,
      route: '/app',
    });

    // Should not redirect — pathname stays at /app
    expect(window.location.pathname).toBe('/app');
  });

  it('shows AccessDeniedPage when role is insufficient with minRole', () => {
    const user = mockAuthUser({ role: 'learner' });
    renderWithProviders(<ProtectedRoute minRole="store_manager" />, {
      user,
      route: '/app',
    });

    // AccessDeniedPage renders "Zugriff verweigert"
    expect(screen.getByText('Zugriff verweigert')).toBeInTheDocument();
  });

  it('allows through when role is sufficient with minRole', () => {
    const user = mockAuthUser({ role: 'tenant_admin' });
    renderWithProviders(<ProtectedRoute minRole="store_manager" />, {
      user,
      route: '/app',
    });

    // Should not show access denied and should not redirect
    expect(screen.queryByText('Zugriff verweigert')).not.toBeInTheDocument();
    expect(window.location.pathname).toBe('/app');
  });

  it('shows AccessDeniedPage when role not in allowedRoles', () => {
    const user = mockAuthUser({ role: 'learner' });
    renderWithProviders(
      <ProtectedRoute allowedRoles={['store_manager', 'tenant_admin']} />,
      { user, route: '/app' },
    );

    expect(screen.getByText('Zugriff verweigert')).toBeInTheDocument();
  });

  it('allows through when role is in allowedRoles', () => {
    const user = mockAuthUser({ role: 'store_manager' });
    renderWithProviders(
      <ProtectedRoute allowedRoles={['store_manager', 'tenant_admin']} />,
      { user, route: '/app' },
    );

    expect(screen.queryByText('Zugriff verweigert')).not.toBeInTheDocument();
    expect(window.location.pathname).toBe('/app');
  });
});
