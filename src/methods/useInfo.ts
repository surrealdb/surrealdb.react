'use client';

import { fetcherFactory } from '@/library/fetcherFactory';
import { useKey } from '@/library/key';
import {
    AbstractQueryParameters,
    useAbstractQuery,
} from '@/methods/useAbstract';

export function useInfo<Data extends Record<string, unknown>, Error = unknown>(
    abstractArguments: AbstractQueryParameters = {}
) {
    const key = useKey(['__auth', 'info']);
    const fetcher = fetcherFactory<[], Data | undefined, Error>(
        'query',
        key,
        ({ surreal }) => surreal.info<Data>()
    );
    return useAbstractQuery<[], Data | undefined, Error>(
        key,
        fetcher,
        abstractArguments
    );
}
