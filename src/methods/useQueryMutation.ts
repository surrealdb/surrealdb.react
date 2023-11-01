'use client';

import { PreparedQuery } from 'surrealdb.js';
import { RawQueryResult } from 'surrealdb.js/types';
import { fetcherFactory } from '../library/fetcherFactory';
import { AbstractMutationParameters, useAbstractMutation } from './useAbstract';

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
    const key = JSON.stringify(mutationKey);
    const fetcher = fetcherFactory<Args, Data, Error>(
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
