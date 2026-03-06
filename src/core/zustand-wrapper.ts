import { create as originalCreate } from 'zustand/react';
import type { StateCreator } from 'zustand/vanilla';
export * from 'zustand/vanilla';
export { useStore } from 'zustand/react';

const parseJsonFromUrlValue = (valueStr: string): unknown => {
  try {
    return JSON.parse(valueStr);
  } catch {
    return undefined;
  }
};

const parseValue = (valueStr: string, initialValue: unknown): unknown => {
  if (initialValue === null || initialValue === undefined) {
    if (valueStr === 'null') return null;
    if (valueStr === 'undefined') return undefined;
    if (valueStr === 'true' || valueStr === '1') return true;
    if (valueStr === 'false' || valueStr === '0') return false;

    const trimmed = valueStr.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      const parsed = parseJsonFromUrlValue(trimmed);
      if (Array.isArray(parsed) || (parsed && typeof parsed === 'object')) {
        return parsed;
      }
    }

    const numericValue = Number(valueStr);
    if (valueStr.trim() !== '' && !Number.isNaN(numericValue)) {
      return numericValue;
    }

    // For nullable fields (e.g. string | null), keep raw text params.
    return valueStr;
  }

  if (initialValue instanceof Set) {
    const parsed = parseJsonFromUrlValue(valueStr);
    return Array.isArray(parsed) ? new Set(parsed) : initialValue;
  }

  if (initialValue instanceof Map) {
    const parsed = parseJsonFromUrlValue(valueStr);
    if (Array.isArray(parsed)) {
      return new Map(parsed as Array<[unknown, unknown]>);
    }
    if (parsed && typeof parsed === 'object') {
      return new Map(Object.entries(parsed as Record<string, unknown>));
    }
    return initialValue;
  }

  const type = typeof initialValue;

  if (type === 'number') {
    const nextValue = Number(valueStr);
    return Number.isNaN(nextValue) ? initialValue : nextValue;
  }

  if (type === 'boolean') {
    if (valueStr === 'true' || valueStr === '1') return true;
    if (valueStr === 'false' || valueStr === '0') return false;
    return initialValue;
  }

  if (Array.isArray(initialValue) || type === 'object') {
    const parsed = parseJsonFromUrlValue(valueStr);
    return parsed === undefined ? initialValue : parsed;
  }

  if (type === 'string') {
    return valueStr;
  }

  return initialValue;
};

const withUrlHydration = <T>(
  stateCreator: StateCreator<T, [], []>
): StateCreator<T, [], []> => {
  return (set, get, api) => {
    const initialState = stateCreator(set, get, api);

    if (
      typeof window === 'undefined' ||
      !initialState ||
      typeof initialState !== 'object'
    ) {
      return initialState;
    }

    const params = new URLSearchParams(window.location.search);
    const overrides: Record<string, unknown> = {};
    let hasOverrides = false;
    const stateRecord = initialState as Record<string, unknown>;

    for (const key of Object.keys(stateRecord)) {
      if (!params.has(key)) continue;
      const rawValue = params.get(key);
      if (rawValue === null) continue;
      overrides[key] = parseValue(rawValue, stateRecord[key]);
      hasOverrides = true;
    }

    return hasOverrides
      ? ({ ...stateRecord, ...overrides } as T)
      : initialState;
  };
};

export const create: typeof originalCreate = ((stateCreator?: unknown) => {
  if (typeof stateCreator === 'function') {
    return originalCreate(withUrlHydration(stateCreator as StateCreator<unknown>));
  }

  return (nextStateCreator: unknown) =>
    originalCreate(withUrlHydration(nextStateCreator as StateCreator<unknown>));
}) as typeof originalCreate;

// Compatibility for packages that still import default from `zustand`.
export default create;
