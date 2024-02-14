import { SurrealClient } from '@/client';
import { useQuery } from '@/methods/useQuery';
import { SurrealContext } from '@/provider';
import { renderHook } from '@testing-library/react';
import { MemoryCache } from '@/cache';
import { Surreal } from 'surrealdb.js';
import React from 'react';

jest.mock('@/library/fetcherFactory', () => ({
  fetcherFactory: jest.fn().mockImplementation(() => jest.fn().mockResolvedValue({ data: 'mock data' })),
}));

jest.mock('@/methods/useAbstract', () => ({
  useAbstractQuery: jest.fn().mockImplementation(() => ({
    data: 'mock data', isLoading: false, error: null, isPending: false, isError: false, isSuccess: false, isFetching: false, isIdle: true, refetch: jest.fn(), status: 'pending', fetchStatus: 'idle', responseUpdatedAt: undefined,
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

describe('useQuery', () => {
  it('should call useQuery with correct parameters', async () => {
    const { result } = renderHook(() => useQuery({
      queryKey: ['exampleQueryKey'],
      query: 'SELECT * FROM exampleTable',
      queryBindings: { exampleBinding: 'value' },
    }), { wrapper });
  
    expect(result.current).toBeDefined();

  });
});

