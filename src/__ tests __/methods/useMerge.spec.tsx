import { useFetcherFactory } from '@/library/useFetcherFactory';
import { useAbstractMutation } from '@/methods/useAbstract';
import { useMerge } from '@/methods/useMerge';
import { act, renderHook } from '@testing-library/react';

jest.mock('@/library/fetcherFactory');
jest.mock('@/methods/useAbstract');

describe('useMerge', () => {
    const mockResource = 'testResource';
    const mockMutationKey = ['testKey'];

    it('should use fetcherFactory and useAbstractMutation with correct parameters', () => {
        const mockMutationResult = { mutate: jest.fn() };
        (useAbstractMutation as jest.Mock).mockReturnValue(mockMutationResult);
        (useFetcherFactory as jest.Mock).mockImplementation(
            (_, _key, fetcher) => fetcher
        );

        const { result } = renderHook(() =>
            useMerge({
                mutationKey: mockMutationKey,
                resource: mockResource,
            })
        );

        act(() => {
            result.current.mutate();
        });

        expect(useFetcherFactory).toHaveBeenCalledWith(
            'mutation',
            JSON.stringify(mockMutationKey),
            expect.any(Function)
        );
        expect(useAbstractMutation).toHaveBeenCalledWith(
            JSON.stringify(mockMutationKey),
            expect.any(Function),
            expect.any(Object)
        );
        expect(mockMutationResult.mutate).toHaveBeenCalled();
    });
});
