'use client';

import { fetcherFactory } from '../library/fetcherFactory';
import {
    AbstractMutationParameters,
    useAbstractMutation,
} from '../methods/useAbstract';
import { useAuthUpdated } from '../methods/useAuthUpdated';

export function useInvalidate<Error = unknown>(
    abstractArguments: AbstractMutationParameters = {}
) {
    const authUpdated = useAuthUpdated();

    const key = JSON.stringify(['__auth', 'invalidate']);
    const fetcher = fetcherFactory<[], void, Error>(
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
