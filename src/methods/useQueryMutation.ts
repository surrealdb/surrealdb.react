'use client';

import { useFetcherFactory } from '@/library/useFetcherFactory';
import { useKey } from '@/library/useKey';
import {
    AbstractMutationParameters,
    useAbstractMutation,
} from '@/methods/useAbstract';
import { PreparedQuery, type Surreal } from 'surrealdb.js';

type RawQueryResult = Awaited<ReturnType<Surreal['query']>>[number];

export function useQueryMutation<
    Data extends RawQueryResult[],
    Error = unknown,
>({
    mutationKey,
    query,
    queryBindings,
    ...abstractArguments
}: AbstractMutationParameters & {
    mutationKey: unknown[];
    query: string | PreparedQuery;
    queryBindings?: Record<string, unknown>;
}) {
    type Args = [bindings?: Record<string, unknown>];
    const key = useKey(mutationKey);
    const fetcher = useFetcherFactory<Args, Data, Error>(
        'mutation',
        key,
        ({ surreal }, bindings) =>
            surreal.query<Data>(query, {
                ...queryBindings,
                ...bindings,
            })
    );

    return useAbstractMutation<Args, Data, Error>(
        key,
        fetcher,
        abstractArguments
    );
}
