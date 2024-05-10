'use client';

import { useFetcherFactory } from '@/library/useFetcherFactory';
import { useKey } from '@/library/useKey';
import {
    AbstractMutationParameters,
    useAbstractMutation,
} from '@/methods/useAbstract';

export function useCreate<
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
            surreal.create<Data, Bindings>(resource, {
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
