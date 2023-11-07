export type CacheCollection = 'query' | 'mutation';
export type CacheListener<Data = unknown, Error = unknown> = (
    key: string,
    value: CacheValue<Data, Error>,
    previous?: CacheValue<Data, Error>
) => unknown;
export type CacheValue<Data = unknown, Error = unknown> = {
    status: 'pending' | 'error' | 'success';
    fetchStatus: 'fetching' | 'idle';
    data?: Data;
    error?: Error;
    responseUpdatedAt?: Date;
};

export abstract class AbstractCache {
    abstract get<Data = unknown, Error = unknown>(
        collection: CacheCollection,
        key: string
    ): CacheValue<Data, Error> | undefined;
    abstract set(
        collection: CacheCollection,
        key: string,
        value: CacheValue
    ): boolean;
    abstract invalidate(collection: CacheCollection, key: string): boolean;
    abstract subscribe<Data = unknown, Error = unknown>(
        listener: CacheListener<Data, Error>,
        collection?: CacheCollection,
        key?: string
    ): boolean;
    abstract unsubscribe<Data = unknown, Error = unknown>(
        listener: CacheListener<Data, Error>,
        collection?: CacheCollection,
        key?: string
    ): boolean;
    abstract createEmptyCacheValue(
        collection: CacheCollection,
        key: string
    ): boolean;
}

export const emptyCacheValue = {
    status: 'pending',
    fetchStatus: 'idle',
} satisfies CacheValue;

Object.freeze(emptyCacheValue);

export function updateCache<Data = unknown, Error = unknown>(
    cache: AbstractCache,
    collection: CacheCollection,
    key: string,
    updates: Partial<CacheValue<Data, Error>>
) {
    const current = cache.get<Data, Error>(collection, key);
    if (!current) throw new Error('No cache available');
    cache.set(collection, key, {
        ...current,
        ...updates,
    });
}

export class MemoryCache extends AbstractCache {
    private listeners: Set<CacheListener> = new Set();
    private listenersByCollection: Record<CacheCollection, Set<CacheListener>> =
        {
            query: new Set(),
            mutation: new Set(),
        };
    private listenersByKey: Record<
        CacheCollection,
        Record<string, Set<CacheListener>>
    > = {
        query: {},
        mutation: {},
    };

    private readonly collections: Record<
        CacheCollection,
        Record<string, CacheValue>
    > = {
        mutation: {},
        query: {},
    };

    get<Data = unknown, Error = unknown>(
        collection: CacheCollection,
        key: string
    ) {
        return this.collections[collection][key] as
            | CacheValue<Data, Error>
            | undefined;
    }

    set(collection: CacheCollection, key: string, value: CacheValue) {
        const previous = this.collections[collection][key]
            ? { ...this.collections[collection][key] }
            : undefined;
        this.collections[collection][key] = value;
        const listeners = [
            ...this.listeners,
            ...this.listenersByCollection[collection],
            ...(this.listenersByKey[collection][key] ?? []),
        ];

        listeners.forEach((l) => l(key, value, previous));
        return true;
    }

    invalidate(collection: CacheCollection, key: string) {
        delete this.listenersByKey[collection][key];
        return delete this.collections[collection][key];
    }

    subscribe<Data = unknown, Error = unknown>(
        listener: CacheListener<Data, Error>,
        collection: CacheCollection,
        key: string
    ) {
        if (collection) {
            if (key) {
                if (!(key in this.listenersByKey[collection]))
                    this.listenersByKey[collection][key] = new Set();
                return (
                    this.listenersByKey[collection][key].size !==
                    this.listenersByKey[collection][key].add(
                        listener as CacheListener
                    ).size
                );
            }

            return (
                this.listenersByCollection[collection].size !==
                this.listenersByCollection[collection].add(
                    listener as CacheListener
                ).size
            );
        }

        return (
            this.listeners.size !==
            this.listeners.add(listener as CacheListener).size
        );
    }

    unsubscribe<Data = unknown, Error = unknown>(
        listener: CacheListener<Data, Error>,
        collection?: CacheCollection,
        key?: string
    ) {
        if (collection) {
            if (key) {
                if (!(key in this.listenersByKey[collection])) return false;
                return this.listenersByKey[collection][key].delete(
                    listener as CacheListener
                );
            }

            return this.listenersByCollection[collection].delete(
                listener as CacheListener
            );
        }

        return this.listeners.delete(listener as CacheListener);
    }

    createEmptyCacheValue(collection: CacheCollection, key: string) {
        if (!this.get(collection, key)) {
            return this.set(collection, key, emptyCacheValue);
        }

        return false;
    }
}
