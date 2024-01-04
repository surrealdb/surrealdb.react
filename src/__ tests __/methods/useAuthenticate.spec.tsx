import { MemoryCache } from '@/cache';
import { SurrealClient } from '@/client';
import { useAuthenticate } from '@/methods/useAuthenticate';
import { useAbstractMutation } from '@/methods/useAbstract'; // Import to mock
import { act, renderHook } from '@testing-library/react';
import React from 'react';
import { Surreal } from 'surrealdb.js';

jest.mock('@/client');
jest.mock('@/methods/useAbstract');
jest.mock('@/methods/useAuthUpdated');
jest.mock('@/library/fetcherFactory');

const mockSurreal = {
    authenticate: jest.fn(),
};

const mockClient = new SurrealClient({
    cache: new MemoryCache(),
    surreal: mockSurreal as unknown as Surreal,
});

const SurrealContext = React.createContext<SurrealClient>(mockClient);

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <SurrealContext.Provider value={mockClient}>
        {children}
    </SurrealContext.Provider>
);

describe('useAuthenticate', () => {
    beforeEach(() => {
        (useAbstractMutation as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
            isSuccess: false,
            isError: false,
        });
    });

    it('should call surreal.authenticate with the provided token', async () => {
        const token: string = 'auth-token';
        const { result } = renderHook(() => useAuthenticate(), { wrapper });

        await act(async () => {
            result.current.mutate(token);
        });

        expect(mockClient.surreal.authenticate).toHaveBeenCalledWith(token);
        expect(result.current.isSuccess).toBeTruthy();
    });

    // Authentication error tests
    it('should handle authentication errors', async () => {
        (mockClient.surreal.authenticate as jest.Mock).mockRejectedValue(new Error('Auth failed'));

        const token: string = 'invalid-token';
        const { result } = renderHook(() => useAuthenticate(), { wrapper });

        await act(async () => {
            result.current.mutate(token);
        });

        expect(result.current.isError).toBeTruthy();
    });
});
