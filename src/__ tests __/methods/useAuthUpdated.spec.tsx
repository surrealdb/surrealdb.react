import { useAuthUpdated } from '@/methods/useAuthUpdated';
import { useInfo } from '@/methods/useInfo';
import { act, renderHook } from '@testing-library/react';

jest.mock('@/methods/useInfo');

describe('useAuthUpdated', () => {
    it('should call refetchInfo if isInfoPending is false', () => {
        const refetchInfo = jest.fn();
        (useInfo as jest.Mock).mockReturnValue({
            refetch: refetchInfo,
            isPending: false,
        });

        const { result } = renderHook(() => useAuthUpdated());

        act(() => {
            result.current();
        });

        expect(refetchInfo).toHaveBeenCalled();
    });

    it('should not call refetchInfo if isInfoPending is true', () => {
        const refetchInfo = jest.fn();
        (useInfo as jest.Mock).mockReturnValue({
            refetch: refetchInfo,
            isPending: true,
        });

        const { result } = renderHook(() => useAuthUpdated());

        act(() => {
            result.current();
        });

        expect(refetchInfo).not.toHaveBeenCalled();
    });
});
