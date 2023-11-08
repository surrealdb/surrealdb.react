'use client';

import { fetcherFactory } from '../library/fetcherFactory';
import { AbstractMutationParameters, useAbstractMutation } from './useAbstract';
import { useAuthUpdated } from './useAuthUpdated';

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
