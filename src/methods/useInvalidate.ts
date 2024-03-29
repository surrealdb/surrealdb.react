'use client';

import { useFetcherFactory } from '@/library/fetcherFactory';
import { useKey } from '@/library/key';
import {
    AbstractMutationParameters,
    useAbstractMutation,
} from '@/methods/useAbstract';
import { useAuthUpdated } from '@/methods/useAuthUpdated';

export function useInvalidate<Error = unknown>(
    abstractArguments: AbstractMutationParameters = {}
) {
    const authUpdated = useAuthUpdated();

    const key = useKey(['__auth', 'invalidate']);
    const fetcher = useFetcherFactory<[], void, Error>(
        'mutation',
        key,
        ({ surreal }) => surreal.invalidate().finally(authUpdated)
    );

    return useAbstractMutation<[], void, Error>(
        key,
        fetcher,
        abstractArguments
    );
}
