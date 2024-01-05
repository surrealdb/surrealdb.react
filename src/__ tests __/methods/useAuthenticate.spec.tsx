import { MemoryCache } from '@/cache';
import { SurrealClient } from '@/client';
import { useAuthenticate } from '@/methods/useAuthenticate';
import { useAbstractMutation } from '@/methods/useAbstract';
import { act, renderHook } from '@testing-library/react';
import React from 'react';
import { Surreal } from 'surrealdb.js';

jest.mock('@/client');
jest.mock('@/methods/useAbstract');
jest.mock('@/methods/useAuthUpdated');
jest.mock('@/library/fetcherFactory');

const authenticateMock = jest.fn();

const mockSurreal = {
    authenticate: authenticateMock,
} as Partial<Surreal>; 

const mockedSurreal = mockSurreal as unknown as Surreal;

const mockClient = new SurrealClient({
    cache: new MemoryCache(),
    surreal: mockedSurreal,
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

        authenticateMock.mockResolvedValue(true);

        const token: string = 'mock-token';
        const { result } = renderHook(() => useAuthenticate(), { wrapper });

        await act(async () => {
            result.current.mutate(token);
        });

        expect(authenticateMock).toHaveBeenCalledWith(token);

    });

    // Authentication error tests
    it('should handle authentication errors', async () => {

        authenticateMock.mockRejectedValue(new Error('Auth failed'));

        const mockToken = 'mock-token';
        const { result } = renderHook(() => useAuthenticate(), { wrapper });

        await act(async () => {
            result.current.mutate(mockToken);
        });

        expect(result.current.isError).toBeTruthy();
        
    });
});
