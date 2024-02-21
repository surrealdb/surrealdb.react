import { MemoryCache } from '@/cache';
import { SurrealClient } from '@/client';
import { useSignin } from '@/methods/useSignin';
import { SurrealContext } from '@/provider';
import { act, renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { Surreal } from 'surrealdb.js';

jest.mock('@/library/fetcherFactory', () => ({
    fetcherFactory: jest
        .fn()
        .mockImplementation(() => jest.fn().mockResolvedValue('mocked token')),
}));

jest.mock('@/methods/useAbstract', () => ({
    useAbstractMutation: jest.fn().mockImplementation(() => ({
        mutate: jest.fn(() => Promise.resolve({ data: 'user signin' })),
        isLoading: false,
        error: null,
        isPending: false,
        isError: false,
        isSuccess: true,
        isFetching: false,
        isIdle: true,
        status: 'success',
        fetchStatus: 'idle',
        responseUpdatedAt: undefined,
    })),
}));

jest.mock('@/methods/useInfo', () => ({
    useInfo: jest.fn().mockImplementation(() => ({
        refetch: jest.fn(),
        isPending: false,
    })),
}));

const mockClient = new SurrealClient({
    cache: new MemoryCache(),
    surreal: new Surreal(),
});

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <SurrealContext.Provider value={mockClient}>
        {children}
    </SurrealContext.Provider>
);

describe('useSignin', () => {
    it('should execute signin process with provided credentials and update auth state', async () => {
        const credentials = { username: 'testUser', password: 'testPass' };
        const { result } = renderHook(() => useSignin(), { wrapper });

        let resolvedValue: string;

        await act(async () => {
            resolvedValue = await result.current.mutate(credentials);
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBeTruthy();
            expect(resolvedValue).toEqual({ data: 'user signin' });
        });
    });
});
