import { useAbstractQuery } from '@/methods/useAbstract';
import { useSelect } from '@/methods/useSelect';
import { fetcherFactory } from '@/library/fetcherFactory';
import { renderHook, waitFor } from '@testing-library/react';
import { MemoryCache } from '@/cache';
import { SurrealClient } from '@/client';
import { SurrealContext } from '@/provider';
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
    useAbstractQuery: jest.fn().mockImplementation(() => ({
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

describe('useSelect', () => {
    it('should call useAbstractQuery with correct parameters', async () => {
        const queryKey = ['selectKey'];
        const resource = 'exampleResource';
        const abstractArguments = {};

        const { result } = renderHook(() => 
            useSelect({
                queryKey,
                resource,
                ...abstractArguments,
            }),
            { wrapper }
        );

        await waitFor(() => {
            expect(fetcherFactory).toHaveBeenCalledWith(
                'query',
                JSON.stringify(queryKey),
                expect.any(Function),
            );

            expect(useAbstractQuery).toHaveBeenCalledWith(
                JSON.stringify(queryKey),
                expect.any(Function),
                expect.objectContaining(abstractArguments),
            );

            expect(result.current.data).toEqual('mock data');
            expect(result.current.isSuccess).toBeFalsy();
        });
    });
});
