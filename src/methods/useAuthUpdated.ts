import { useInfo } from '@/methods/useInfo';
import { useCallback } from 'react';

export function useAuthUpdated() {
    const { refetch: refetchInfo, isPending: isInfoPending } = useInfo({
        enabled: false,
    });

    return useCallback(() => {
        if (!isInfoPending) refetchInfo();
    }, [isInfoPending, refetchInfo]);
}
