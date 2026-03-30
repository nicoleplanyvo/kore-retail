import { useSearchParams } from 'react-router-dom';

export function usePagination(paramName = 'page') {
  const [searchParams] = useSearchParams();
  const page = Math.max(1, Number(searchParams.get(paramName)) || 1);
  return page;
}
