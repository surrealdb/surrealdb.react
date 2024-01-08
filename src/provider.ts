'use client';

import { SurrealClient } from '@/client';
import { ReactNode, createContext, createElement, useMemo } from 'react';

export const SurrealContext = createContext<SurrealClient | undefined>(
    undefined
);
export function SurrealProvider({
    children,
    client,
}: {
    children?: ReactNode;
    client: SurrealClient;
}) {
    const value = useMemo(() => client, []);
    return createElement(SurrealContext.Provider, { value }, children);
}
