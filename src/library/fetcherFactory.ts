import { updateCache } from '@/cache';
import { CacheCollection, SurrealClient } from '@/index';
import { ParametersExceptFirst } from '@/library/ParametersExceptFirst';

export function fetcherFactory<
    T extends unknown[],
    Data = unknown,
    Error = unknown,
>(
    collection: CacheCollection,
    key: string,
    fetcher: (client: SurrealClient, ...args: T) => Promise<Data>
) {
    return async function (
        client: SurrealClient,
        ...args: ParametersExceptFirst<typeof fetcher>
    ) {
        const { cache } = client;
        updateCache(cache, collection, key, { fetchStatus: 'fetching' });

        return await fetcher(client, ...args)
            .then((res) => {
                updateCache(cache, collection, key, {
                    fetchStatus: 'idle',
                    status: 'success',
                    data: res,
                    error: undefined,
                    responseUpdatedAt: new Date(),
                });

                return res;
            })
            .catch((err) => {
                updateCache(cache, collection, key, {
                    fetchStatus: 'idle',
                    status: 'error',
                    data: undefined,
                    error: err.message as Error,
                    responseUpdatedAt: new Date(),
                });

                return Promise.reject(err.message);
            });
    };
}
