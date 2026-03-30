import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import { useToast } from '../components/Toast';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Wrapper around useMutation that automatically shows toast notifications
 * on success and error. Passes through all standard useMutation options.
 */
export function useMutationWithToast<TData = any, TError = Error, TVariables = any, TContext = unknown>(
  options: UseMutationOptions<TData, TError, TVariables, TContext> & {
    successMessage?: string;
    errorMessage?: string;
    invalidateKeys?: string[][];
  }
) {
  const toast = useToast();
  const qc = useQueryClient();
  const { successMessage, errorMessage, invalidateKeys, onSuccess, onError, ...rest } = options;

  return useMutation({
    ...rest,
    onSuccess: (...args) => {
      if (successMessage) toast.success(successMessage);
      if (invalidateKeys) {
        invalidateKeys.forEach(key => qc.invalidateQueries({ queryKey: key }));
      }
      onSuccess?.(...args);
    },
    onError: (...args) => {
      toast.error(errorMessage || 'Ein Fehler ist aufgetreten.');
      onError?.(...args);
    },
  });
}
