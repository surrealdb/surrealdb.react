'use client';

import {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useSyncExternalStore,
} from 'react';
import { CacheCollection, CacheValue, emptyCacheValue } from '../cache';
import { SurrealClient } from '../client';
import { NoProviderError } from '../errors';
import { ParametersExceptFirst } from '../library/ParametersExceptFirst';
import useOnUnmount from '../library/useOnUnmount';
import { SurrealContext } from '../provider';

export type AbstractParameters =
    | AbstractQueryParameters
    | AbstractMutationParameters;

export type AbstractQueryParameters = {
    client?: SurrealClient;
    refetchInterval?: number;
    refetchOnWindowFocus?: boolean;
    enabled?: boolean;
};

export type AbstractMutationParameters = {
    client?: SurrealClient;
};

export function useAbstract<T extends unknown[], Data, Error = unknown>(
    collection: CacheCollection,
    key: string,
    fetcher: (client: SurrealClient, ...args: T) => Promise<Data>,
    params: AbstractParameters
) {
    const client = useQueryClient(params);
    const { cache } = client;

    const refetch = async (...args: ParametersExceptFirst<typeof fetcher>) =>
        await fetcher(client, ...args);

    const initialFetch = useInitialFetch<T, Data>(
        collection,
        params,
        refetch,
        client,
        key
    );

    const updateRefetchInterval = useRefetchInterval<T, Data, Error>(
        collection,
        params,
        refetch
    );

    useRefetchOnWindowFocus<T, Data>(collection, params, refetch);

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
        initialFetch();
    }, []);

    useOnUnmount(() => {
        cache.invalidate(collection, key);
    }, [cache]);

    return {
        ...state,
        refetch,
    };
}

// Hooks used by useAbstract

export function useQueryClient(params: AbstractParameters) {
    const contextClient = useContext(SurrealContext);
    const client = params.client || contextClient;
    if (!client) throw new NoProviderError();
    return client;
}

export function useRefetchInterval<T extends unknown[], Data, Error = unknown>(
    collection: CacheCollection,
    params: AbstractParameters,
    refetch: (...args: T) => Promise<Data>
) {
    const refetchIntervalRef = useRef<number>();
    const refetchInterval =
        collection == 'query' && 'refetchInterval' in params
            ? params.refetchInterval
            : undefined;

    return function (
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
            refetchIntervalRef.current = setTimeout(refetch, refetchInterval);
        }
    };
}

export function useRefetchOnWindowFocus<T extends unknown[], Data>(
    collection: CacheCollection,
    params: AbstractParameters,
    refetch: (...args: T) => Promise<Data>
) {
    const refetchOnWindowFocus =
        collection == 'query'
            ? 'refetchOnWindowFocus' in params &&
              typeof params.refetchOnWindowFocus == 'boolean'
                ? params.refetchOnWindowFocus
                : true
            : false;

    useEffect(() => {
        function listener() {
            if (refetchOnWindowFocus) {
                refetch(...([] as unknown as T));
            }
        }

        window.addEventListener('focus', listener);
        return () => window.removeEventListener('focus', listener);
    });
}

export function useInitialFetch<T extends unknown[], Data>(
    collection: CacheCollection,
    params: AbstractMutationParameters,
    fetcher: (...args: T) => Promise<Data>,
    { cache }: SurrealClient,
    key: string
) {
    const initialised = useRef(false);
    const enabled =
        collection == 'query'
            ? 'enabled' in params && typeof params.enabled == 'boolean'
                ? params.enabled
                : true
            : false;

    return useCallback(() => {
        if (!initialised.current) {
            initialised.current = true;
            const current = cache.get(collection, key);
            if (
                enabled &&
                collection === 'query' &&
                current?.status == 'pending' &&
                current?.fetchStatus == 'idle'
            ) {
                fetcher(...([] as unknown as Parameters<typeof fetcher>));
            }
        }
    }, []);
}

// Abstract implementations

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
