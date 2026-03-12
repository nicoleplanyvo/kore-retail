import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useForecastStores() {
  return useQuery({ queryKey: ['forecast', 'stores'], queryFn: () => api.get('/tools/forecast/stores').then((r) => r.data) });
}

export function useForecasts(page = 1, storeId?: string, forecastType?: string) {
  return useQuery({
    queryKey: ['forecast', 'list', page, storeId, forecastType],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), pageSize: '20' });
      if (storeId) params.set('storeId', storeId);
      if (forecastType) params.set('forecastType', forecastType);
      return api.get(`/tools/forecast?${params}`).then((r) => r.data);
    },
  });
}

export function useForecast(id: string) {
  return useQuery({
    queryKey: ['forecast', 'detail', id],
    queryFn: () => api.get(`/tools/forecast/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useForecastAccuracy() {
  return useQuery({
    queryKey: ['forecast', 'accuracy'],
    queryFn: () => api.get('/tools/forecast/reports/accuracy').then((r) => r.data),
  });
}
