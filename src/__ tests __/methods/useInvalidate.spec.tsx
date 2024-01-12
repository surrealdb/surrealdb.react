import { useInvalidate } from '@/methods/useInvalidate';
import { act, renderHook } from '@testing-library/react';

jest.mock('@/library/fetcherFactory', () => ({
    fetcherFactory: jest.fn().mockImplementation(() => jest.fn()),
}));

jest.mock('@/methods/useAbstract', () => ({
    useAbstractMutation: jest.fn().mockImplementation(() => ({
        mutate: jest.fn(),
    })),
}));

jest.mock('@/methods/useAuthUpdated', () => ({
    useAuthUpdated: jest.fn().mockImplementation(() => jest.fn()),
}));

describe('useInvalidate', () => {
    it('should initialize and use fetcherFactory, useAbstractMutation, and useAuthUpdated correctly', async () => {
        const { result } = renderHook(() => useInvalidate());

        await act(async () => {
            await result.current.mutate();
        });

        expect(
            jest.requireMock('@/library/fetcherFactory').fetcherFactory
        ).toHaveBeenCalled();
        expect(
            jest.requireMock('@/methods/useAbstract').useAbstractMutation
        ).toHaveBeenCalled();
        expect(
            jest.requireMock('@/methods/useAuthUpdated').useAuthUpdated
        ).toHaveBeenCalled();
    });
});
