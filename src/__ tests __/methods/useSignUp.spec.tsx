import { MemoryCache } from '@/cache';
import { SurrealClient } from '@/client';
import { useSignup } from '@/methods/useSignup';
import { SurrealContext } from '@/provider';
import { act, renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { Surreal } from 'surrealdb.js';

jest.mock('@/library/fetcherFactory', () => ({
    fetcherFactory: jest
        .fn()
        .mockImplementation(() => jest.fn().mockResolvedValue('mocked data')),
}));

jest.mock('@/methods/useAbstract', () => ({
    useAbstractMutation: jest.fn().mockImplementation(() => ({
        mutate: jest.fn((credentials) => {
            if (credentials.email === 'test@surrealdb.com') {
                return Promise.resolve({ data: 'signup success' });
            } else {
                return Promise.resolve({
                    data: 'signup failed',
                    error: 'Invalid credentials',
                });
            }
        }),
        isLoading: false,
        isSuccess: true,
        error: null,
        isPending: false,
        isError: false,
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

jest.mock('@/methods/useAuthUpdated', () => ({
    useAuthUpdated: jest.fn().mockImplementation(() => ({
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

describe('useSignup', () => {
    it('should execute signup process with provided credentials and update auth state', async () => {
        const credentials = {
            email: 'test@surrealdb.com',
            password: 'testPassword',
            scope: 'ScopeAuth',
        };

        const { result } = renderHook(() => useSignup(), { wrapper });

        let resolvedValue: string;

        await act(async () => {
            resolvedValue = await result.current.mutate(credentials);
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBeTruthy();
            expect(resolvedValue).toEqual({ data: 'signup success' });
        });
    });
});
