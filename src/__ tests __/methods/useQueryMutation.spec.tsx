import { MemoryCache } from '@/cache';
import { SurrealClient } from '@/client';
import { useQueryMutation } from '@/methods/useQueryMutation';
import { SurrealContext } from '@/provider';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { Surreal } from 'surrealdb.js';

jest.mock('@/library/fetcherFactory', () => ({
    fetcherFactory: jest
        .fn()
        .mockImplementation(() =>
            jest.fn().mockResolvedValue({ data: 'mock data' })
        ),
}));

jest.mock('@/methods/useAbstract', () => ({
    useAbstractMutation: jest.fn().mockImplementation(() => ({
        data: 'mock data',
        isLoading: false,
        error: null,
        isPending: false,
        isError: false,
        isSuccess: false,
        isFetching: false,
        isIdle: true,
        refetch: jest.fn(),
        status: 'pending',
        fetchStatus: 'idle',
        responseUpdatedAt: undefined,
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

describe('useQueryMutation', () => {
    it('should call useQueryMutation with correct parameters', async () => {
        const { result } = renderHook(
            () =>
                useQueryMutation({
                        mutationKey: ['exampleMutationKey'],
                        query: 'INSERT INTO exampleTable VALUES (@value)',
                        queryBindings: { exampleBinding: 'value' },
                    }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result.current.isSuccess).toBeFalsy();
            expect(result.current).toBeDefined();
            expect(result.current.data).toEqual('mock data');
        });

    });
});
