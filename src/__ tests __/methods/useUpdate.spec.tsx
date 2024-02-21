import { MemoryCache } from '@/cache';
import { SurrealClient } from '@/client';
import { useUpdate } from '@/methods/useUpdate';
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
        mutate: jest.fn().mockResolvedValue({ data: 'update success' }),
        isSuccess: true,
        isLoading: false,
        error: null,
        isPending: false,
        isError: false,
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

describe('useUpdate', () => {
    it('should execute update process with provided data and update state', async () => {
        const updateData = {
            email: 'updated@surrealdb.com',
        };
        const mutationKey = ['testResource', 'testId'];
        const resource = 'testResource';

        const { result } = renderHook(
            () =>
                useUpdate({
                    mutationKey,
                    resource,
                    data: updateData,
                }),
            { wrapper }
        );

        let resolvedValue: object;

        await act(async () => {
            await result.current.mutate(updateData);
            resolvedValue = await result.current.mutate(updateData);
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBeTruthy();
            expect(resolvedValue).toEqual({ data: 'update success' });
        });
    });
});
