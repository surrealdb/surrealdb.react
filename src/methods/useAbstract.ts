'use client';

import { useContext, useEffect, useRef, useSyncExternalStore } from 'react';
import { CacheCollection, CacheValue, emptyCacheValue } from '../cache';
import { SurrealClient } from '../client';
import { NoProviderError } from '../errors';
import { ParametersExceptFirst } from '../library/ParametersExceptFirst';
import useOnUnmount from '../library/useOnUnmount';
import { SurrealContext } from '../provider';

export type AbstractQueryParameters = {
    client?: SurrealClient;
    refetchInterval?: number;
    enabled?: boolean;
};

export type AbstractMutationParameters = {
    client?: SurrealClient;
};

export function useAbstract<T extends unknown[], Data, Error = unknown>(
    collection: CacheCollection,
    key: string,
    fetcher: (client: SurrealClient, ...args: T) => Promise<Data>,
    { client, ...params }: AbstractQueryParameters | AbstractMutationParameters
) {
    const refetchIntervalRef = useRef<number>();
    const initialised = useRef(false);

    const contextClient = useContext(SurrealContext);
    client = client || contextClient;
    if (!client) throw new NoProviderError();
    const { cache } = client;

    const wrappedFetcher = async (
        ...args: ParametersExceptFirst<typeof fetcher>
    ) => await fetcher(client!, ...args);
    const refetchInterval =
        collection == 'query' && 'refetchInterval' in params
            ? params.refetchInterval
            : undefined;
    const enabled =
        collection == 'query'
            ? 'enabled' in params && typeof params.enabled == 'boolean'
                ? params.enabled
                : true
            : undefined;

    function updateRefetchInterval(
        v: CacheValue<Data, Error>,
        prev?: CacheValue<Data, Error>
    ) {
        if (!refetchInterval) return;
        if (
            !prev ||
            !v.responseUpdatedAt ||
            !prev.responseUpdatedAt ||
            v.responseUpdatedAt > prev.responseUpdatedAt
        ) {
            if (refetchIntervalRef.current)
                clearTimeout(refetchIntervalRef.current);
            refetchIntervalRef.current = setTimeout(
                wrappedFetcher,
                refetchInterval
            );
        }
    }

    const state = useSyncExternalStore(
        (l) => {
            function listener(
                _: string,
                value: CacheValue<Data, Error>,
                prev?: CacheValue<Data, Error>
            ) {
                updateRefetchInterval(value, prev);
                l();
            }

            cache.subscribe(listener, collection, key);
            return () => cache.unsubscribe(listener, collection, key);
        },
        () => {
            const v = cache.get(collection, key);
            const f = emptyCacheValue;
            return v ?? f;
        },
        () => emptyCacheValue
    ) as CacheValue<Data, Error>;

    useEffect(() => {
        cache.createEmptyCacheValue(collection, key);
        if (!initialised.current) {
            initialised.current = true;
            const current = cache.get(collection, key);
            if (
                enabled &&
                collection === 'query' &&
                current?.status == 'pending' &&
                current?.fetchStatus == 'idle'
            ) {
                wrappedFetcher(
                    ...([] as unknown as ParametersExceptFirst<typeof fetcher>)
                );
            }
        }
    }, [enabled]);

    useOnUnmount(() => {
        cache.invalidate(collection, key);
    }, [cache]);

    return {
        ...state,
        refetch: wrappedFetcher,
    };
}

export function useAbstractQuery<T extends unknown[], Data, Error = unknown>(
    key: string,
    fetcher: (client: SurrealClient, ...args: T) => Promise<Data>,
    params: AbstractQueryParameters
) {
    const abstract = useAbstract<T, Data, Error>('query', key, fetcher, params);

    return {
        ...abstract,
        isPending: abstract.status === 'pending',
        isError: abstract.status === 'error',
        isSuccess: abstract.status === 'success',
        isFetching: abstract.fetchStatus === 'fetching',
        isIdle: abstract.fetchStatus === 'idle',
        isLoading:
            abstract.status === 'pending' ||
            abstract.fetchStatus === 'fetching',
    };
}

export function useAbstractMutation<T extends unknown[], Data, Error = unknown>(
    key: string,
    fetcher: (client: SurrealClient, ...args: T) => Promise<Data>,
    params: AbstractMutationParameters
) {
    const { status, fetchStatus, refetch, ...abstract } = useAbstract<
        T,
        Data,
        Error
    >('mutation', key, fetcher, params);

    const computedStatus =
        fetchStatus == 'fetching'
            ? 'pending'
            : status === 'pending'
            ? 'idle'
            : status;

    return {
        ...abstract,
        status: computedStatus,
        isIdle: computedStatus == 'idle',
        isPending: computedStatus == 'pending',
        isError: computedStatus == 'error',
        isSuccess: computedStatus == 'success',
        mutate: refetch,
    };
}
