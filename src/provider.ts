'use client';

import { ReactNode, createContext, createElement } from 'react';
import { SurrealClient } from './client';

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
    return createElement(SurrealContext.Provider, { value: client }, children);
}
