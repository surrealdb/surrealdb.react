'use client';

import { fetcherFactory } from '../library/fetcherFactory';
import { AbstractQueryParameters, useAbstractQuery } from './useAbstract';

export function useSelect<
    Data extends Record<string, unknown>,
    Error = unknown,
>({
    queryKey,
    resource,
    ...abstractArguments
}: AbstractQueryParameters & {
    queryKey: unknown[];
    resource: string;
}) {
    const key = JSON.stringify(queryKey);
    const fetcher = fetcherFactory<[], Data[], Error>(
        'query',
        key,
        ({ surreal }) => surreal.select<Data>(resource)
    );
    return useAbstractQuery<[], Data[], Error>(key, fetcher, abstractArguments);
}
