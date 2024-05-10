'use client';

import { useFetcherFactory } from '@/library/fetcherFactory';
import { useKey } from '@/library/key';
import {
    AbstractQueryParameters,
    useAbstractQuery,
} from '@/methods/useAbstract';

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
    const key = useKey(queryKey);
    const fetcher = useFetcherFactory<[], Data[], Error>(
        'query',
        key,
        ({ surreal }) => surreal.select<Data>(resource)
    );
    return useAbstractQuery<[], Data[], Error>(key, fetcher, abstractArguments);
}
