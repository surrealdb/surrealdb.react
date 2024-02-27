'use client';

import { useFetcherFactory } from '@/library/fetcherFactory';
import { useKey } from '@/library/key';
import {
    AbstractQueryParameters,
    useAbstractQuery,
} from '@/methods/useAbstract';
import { PreparedQuery, type Surreal } from 'surrealdb.js';

type RawQueryResult = Awaited<ReturnType<Surreal['query']>>[number];

export function useQuery<Data extends RawQueryResult[], Error = unknown>({
    queryKey,
    query,
    queryBindings,
    ...abstractArguments
}: AbstractQueryParameters & {
    queryKey: unknown[];
    query: string | PreparedQuery;
    queryBindings?: Record<string, unknown>;
}) {
    type Args = [bindings?: Record<string, unknown>];
    const key = useKey(queryKey);
    const fetcher = useFetcherFactory<Args, Data, Error>(
        'query',
        key,
        ({ surreal }, bindings?: Record<string, unknown>) =>
            surreal.query<Data>(query, {
                ...queryBindings,
                ...bindings,
            })
    );

    return useAbstractQuery<Args, Data, Error>(key, fetcher, abstractArguments);
}
