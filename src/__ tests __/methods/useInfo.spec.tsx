import { SurrealClient } from '@/client';
import { useAbstractQuery } from '@/methods/useAbstract';
import { useInfo } from '@/methods/useInfo';
import { SurrealProvider } from '@/provider';
import { renderHook } from '@testing-library/react';
import React from 'react';

jest.mock('@/methods/useAbstract', () => ({
    useAbstractQuery: jest.fn().mockImplementation(() => {}),
}));

describe('useInfo', () => {
    it('should call useAbstractQuery with correct parameters', () => {
        const surrealClient = new SurrealClient();
        const queryKey = ['__auth', 'info'];
        const abstractArguments = {};

        const wrapper: React.FC<{ children: React.ReactNode }> = ({
            children,
        }) => (
            <SurrealProvider client={surrealClient}>{children}</SurrealProvider>
        );

        renderHook(() => useInfo(abstractArguments), {
            wrapper,
        });

        expect(useAbstractQuery).toHaveBeenCalledWith(
            JSON.stringify(queryKey),
            expect.any(Function),
            abstractArguments
        );
    });
});
