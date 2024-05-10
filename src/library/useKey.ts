import { useMemo } from 'react';

export function useKey(key: unknown[]) {
    return useMemo(() => JSON.stringify(key), [key]);
}
