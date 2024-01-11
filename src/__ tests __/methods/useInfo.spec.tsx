import React from 'react';
import { renderHook } from '@testing-library/react';
import { SurrealClient } from '@/client';
import { SurrealProvider } from '@/provider';
import { useInfo } from '@/methods/useInfo';

jest.mock('@/methods/useAbstract', () => ({
  useAbstractQuery: jest.fn(),
}));

describe('useInfo', () => {
  it('should call useAbstractQuery with correct parameters', () => {
    const mockUseAbstractQuery = require('@/methods/useAbstract').useAbstractQuery;
    const surrealClient = new SurrealClient();
    const queryKey = ['__auth', 'info'];
    const abstractArguments = {};

    const wrapper: React.FC<{children: React.ReactNode}> = ({ children }) => (
      <SurrealProvider client={surrealClient}>
        {children}
      </SurrealProvider>
    );

    renderHook(() => useInfo(abstractArguments), {
      wrapper,
    });

    expect(mockUseAbstractQuery).toHaveBeenCalledWith(
      JSON.stringify(queryKey),
      expect.any(Function),
      abstractArguments
    );
  });

});



