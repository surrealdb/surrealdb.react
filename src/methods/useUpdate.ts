'use client';

import { useFetcherFactory } from '@/library/fetcherFactory';
import { useKey } from '@/library/key';
import {
    AbstractMutationParameters,
    useAbstractMutation,
} from '@/methods/useAbstract';

export function useUpdate<
    Data extends Record<string, unknown>,
    Bindings extends Record<string, unknown> = Data,
    Error = unknown,
>({
    mutationKey,
    resource,
    data,
    ...abstractArguments
}: AbstractMutationParameters & {
    mutationKey: unknown[];
    resource: string;
    data?: Bindings;
}) {
    type Args = [data?: Bindings];
    const key = useKey(mutationKey);
    const fetcher = useFetcherFactory<Args, Data[], Error>(
        'mutation',
        key,
        ({ surreal }, dataOverwrite) =>
            surreal.update<Data, Bindings>(resource, {
                ...data,
                ...dataOverwrite,
            } as Bindings)
    );

    return useAbstractMutation<Args, Data[], Error>(
        key,
        fetcher,
        abstractArguments
    );
}
