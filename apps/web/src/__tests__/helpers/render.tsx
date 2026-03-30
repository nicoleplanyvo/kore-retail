import { render, type RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '../../components/Toast';
import { useAuthStore } from '../../stores/authStore';
import type { AuthUser } from '@kore/types';
import type { ReactElement } from 'react';

interface ProviderOptions extends Omit<RenderOptions, 'wrapper'> {
  user?: AuthUser;
  route?: string;
}

export function renderWithProviders(
  ui: ReactElement,
  { user, route = '/', ...renderOptions }: ProviderOptions = {},
) {
  // Set initial route
  window.history.pushState({}, '', route);

  // Configure auth store
  if (user) {
    useAuthStore.setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  } else {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </ToastProvider>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
