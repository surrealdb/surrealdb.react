import React from 'react';
import { Surreal } from 'surrealdb.js';
import { renderHook, act } from '@testing-library/react-hooks';
import { useAuthenticate } from '../../methods/useAuthenticate';
import { SurrealClient } from '../../client';
import { MemoryCache } from '../../cache';

jest.mock('../client');
jest.mock('./useAbstract');
jest.mock('./useAuthUpdated');
jest.mock('../library/fetcherFactory');

const authenticateMock = jest.fn();

const mockClient = new SurrealClient({
  cache: new MemoryCache(),
  surreal: new Surreal(),
});

const SurrealContext = React.createContext<SurrealClient>(mockClient);

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SurrealContext.Provider value={mockClient}>{children}</SurrealContext.Provider>
);

describe('useAuthenticate', () => {

  beforeEach(() => {
    authenticateMock.mockReset();
  });

  it('should call surreal.authenticate with the provided token', async () => {
    authenticateMock.mockResolvedValue(true);
    const token: string = 'auth-token';
    const { result } = renderHook(() => useAuthenticate(), { wrapper });

    await act(async () => {
      result.current.mutate(token);
    });

    expect(authenticateMock).toHaveBeenCalledWith(token);
    expect(result.current.isSuccess).toBeTruthy();
  });

  // Authentication error tests
  it('should handle authentication errors', async () => {
    authenticateMock.mockRejectedValue(new Error('Auth failed'));

    const token: string = 'invalid-token';
    const { result } = renderHook(() => useAuthenticate(), { wrapper });

    await act(async () => {
        result.current.mutate(token);
    });

    expect(result.current.isError).toBeTruthy();
  });


});

