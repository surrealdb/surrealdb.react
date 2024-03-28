'use client';

import { fetcherFactory } from '@/library/fetcherFactory';
import { useKey } from '@/library/key';
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
    const fetcher = fetcherFactory<[], Data[], Error>(
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
