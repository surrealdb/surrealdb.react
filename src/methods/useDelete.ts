'use client';

import { fetcherFactory } from '../library/fetcherFactory';
import { AbstractMutationParameters, useAbstractMutation } from './useAbstract';

export function useDelete<
    Data extends Record<string, unknown>,
    Error = unknown,
>({
    mutationKey,
    resource,
    ...abstractArguments
}: AbstractMutationParameters & {
    mutationKey: unknown[];
    resource: string;
}) {
    const key = JSON.stringify(mutationKey);
    const fetcher = fetcherFactory<[], Data[], Error>(
        'mutation',
        key,
        ({ surreal }) => surreal.merge<Data>(resource)
    );
    return useAbstractMutation<[], Data[], Error>(
        key,
        fetcher,
        abstractArguments
    );
}
