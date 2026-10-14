import { AsyncState } from '../types/async-state.model';

export function createInitialState<T>(initialData: T | null = null): AsyncState<T> {
  return {
    status: 'initial',
    data: initialData,
    error: null,
    errorCode: null,
  };
}

export function createLoadingState<T>(currentData: T | null = null): AsyncState<T> {
  return {
    status: 'loading',
    data: currentData,
    error: null,
    errorCode: null,
  };
}

export function createSuccessState<T>(data: T): AsyncState<T> {
  return {
    status: 'success',
    data,
    error: null,
    errorCode: null,
  };
}

export function createEmptyState<T>(fallbackData: T | null = null): AsyncState<T> {
  return {
    status: 'empty',
    data: fallbackData,
    error: null,
    errorCode: null,
  };
}

export function createErrorState<T>(
  error: string,
  errorCode?: string | null,
  currentData: T | null = null,
): AsyncState<T> {
  return {
    status: 'error',
    data: currentData,
    error,
    errorCode: errorCode ?? null,
  };
}
