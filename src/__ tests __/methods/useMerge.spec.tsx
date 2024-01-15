import { useMerge } from '@/methods/useMerge';
import { renderHook } from '@testing-library/react';
// import { mockMergeParams } from '@/mockData';

jest.mock('@/library/fetcherFactory', () => ({
    fetcherFactory: jest.fn().mockImplementation(() => jest.fn()),
}));

jest.mock('@/methods/useAbstract', () => ({
    useAbstractMutation: jest.fn((_key, _fetcher, params) => {
        console.log('Called with:', params);
        return { mutate: jest.fn() };
    }),
}));

describe('useMerge', () => {
    // it('should correctly use mockMergeParams', () => {
    //     renderHook(() => useMerge(mockMergeParams));

    //     const mockUseAbstractMutation = require('@/methods/useAbstract').useAbstractMutation;

    //     expect(mockUseAbstractMutation).toHaveBeenCalledWith(
    //         JSON.stringify(mockMergeParams.mutationKey),
    //         expect.any(Function),
    //         expect.objectContaining({
    //             resource: mockMergeParams.resource,
    //             data: mockMergeParams.data,
    //         }),
    //     );

    // });

    it('should correctly use parameters', () => {
        const testParams = {
            mutationKey: ['merge', 'test'],
            resource: 'testResource',
            data: { name: 'Test', value: 'Value' },
        };
        renderHook(() => useMerge(testParams));
    });
});
