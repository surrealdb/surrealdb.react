import { useCallback } from 'react';
import { useInfo } from './useInfo';

export function useAuthUpdated() {
    const { refetch: refetchInfo, isPending: isInfoPending } = useInfo({
        enabled: false,
    });

    return useCallback(() => {
        if (!isInfoPending) refetchInfo();
    }, [isInfoPending, refetchInfo]);
}
