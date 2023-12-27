import React from 'react';
import { Surreal } from 'surrealdb.js';
import { renderHook } from '@testing-library/react-hooks';
import { useAbstract, AbstractQueryParameters } from '../../methods/useAbstract';
import { SurrealClient } from '../../client';
import { SurrealContext } from '../../provider';
import { MemoryCache } from '../../cache';

const mockClient = new SurrealClient({
  cache: new MemoryCache(),
  surreal: new Surreal(),
});

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SurrealContext.Provider value={mockClient}>{children}</SurrealContext.Provider>
);

describe('useAbstract', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Query
  it('initializes correctly with query collection', () => {
    const fetcher = jest.fn();
    const params: AbstractQueryParameters = { enabled: true };

    const { result } = renderHook(() => useAbstract('query', 'key', fetcher, params), { wrapper });

    expect(result.current).toBeDefined();
  });

  // Mutation
  it('initializes correctly with mutation collection', () => {
    const fetcher = jest.fn();
    const params: AbstractQueryParameters = { enabled: true };

    const { result } = renderHook(() => useAbstract('mutation', 'key', fetcher, params), { wrapper });

    expect(result.current).toBeDefined();
  });
});




