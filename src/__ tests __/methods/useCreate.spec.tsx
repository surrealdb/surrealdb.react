import { fetcherFactory } from '@/library/fetcherFactory';
import { useAbstractMutation } from '@/methods/useAbstract';
import { useCreate } from '@/methods/useCreate';
import { act, renderHook } from '@testing-library/react';

jest.mock('@/library/fetcherFactory');
jest.mock('@/methods/useAbstract');

describe('useCreate', () => {
    const mockResource = 'testResource';
    const mockData = { key: 'value' };
    const mockMutationKey = ['testKey'];

    it('should use fetcherFactory and useAbstractMutation with correct parameters', () => {
        const mockMutationResult = { mutate: jest.fn() };
        (useAbstractMutation as jest.Mock).mockReturnValue(mockMutationResult);
        (fetcherFactory as jest.Mock).mockImplementation(
            (_, _key, fetcher) => fetcher
        );

        const { result } = renderHook(() =>
            useCreate({
                mutationKey: mockMutationKey,
                resource: mockResource,
                data: mockData,
            })
        );

        act(() => {
            result.current.mutate(mockData);
        });

        expect(fetcherFactory).toHaveBeenCalledWith(
            'mutation',
            JSON.stringify(mockMutationKey),
            expect.any(Function)
        );
        expect(useAbstractMutation).toHaveBeenCalledWith(
            JSON.stringify(mockMutationKey),
            expect.any(Function),
            expect.any(Object)
        );
        expect(mockMutationResult.mutate).toHaveBeenCalledWith(mockData);
    });
});
