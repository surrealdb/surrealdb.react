'use client';

import { PreparedQuery, type Surreal } from 'surrealdb.js';
import { fetcherFactory } from '@/library/fetcherFactory';
import {
    AbstractQueryParameters,
    useAbstractQuery,
} from '@/methods/useAbstract';

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
    const key = JSON.stringify(queryKey);
    const fetcher = fetcherFactory<Args, Data, Error>(
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
