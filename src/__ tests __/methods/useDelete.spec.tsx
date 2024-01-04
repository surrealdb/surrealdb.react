import { renderHook, act } from '@testing-library/react-hooks';
import { useDelete } from '../../methods/useDelete';
import { fetcherFactory } from '../../library/fetcherFactory';
import { useAbstractMutation } from '../../methods/useAbstract';

jest.mock('../../library/fetcherFactory');
jest.mock('../../methods/useAbstract');

describe('useDelete', () => {
    const mockResource = 'testResource';
    const mockMutationKey = ['testKey'];

    it('should use fetcherFactory and useAbstractMutation with correct parameters', () => {
        const mockMutationResult = { mutate: jest.fn() };
        (useAbstractMutation as jest.Mock).mockReturnValue(mockMutationResult);
        (fetcherFactory as jest.Mock).mockImplementation((_, _key, fetcher) => fetcher);

        const { result } = renderHook(() =>
            useDelete({
                mutationKey: mockMutationKey,
                resource: mockResource,
            })
        );

        act(() => {
            result.current.mutate();
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
        expect(mockMutationResult.mutate).toHaveBeenCalled();
    });

});
