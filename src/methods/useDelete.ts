'use client';

import { useFetcherFactory } from '@/library/useFetcherFactory';
import { useKey } from '@/library/useKey';
import {
    AbstractMutationParameters,
    useAbstractMutation,
} from '@/methods/useAbstract';

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
    const key = useKey(mutationKey);
    const fetcher = useFetcherFactory<[], Data[], Error>(
        'mutation',
        key,
        ({ surreal }) => surreal.delete<Data>(resource)
    );
    return useAbstractMutation<[], Data[], Error>(
        key,
        fetcher,
        abstractArguments
    );
}
