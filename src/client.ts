import { AbstractCache, MemoryCache } from '@/cache';
import { Surreal } from 'surrealdb.js';
export class SurrealClient {
    public readonly cache: AbstractCache;
    public readonly surreal: Surreal;

    constructor({
        cache,
        surreal,
    }: {
        cache?: AbstractCache;
        surreal?: Surreal;
    } = {}) {
        this.cache = cache ?? new MemoryCache();
        this.surreal = surreal ?? new Surreal();
    }

    async connect(...args: Parameters<Surreal['connect']>) {
        return this.surreal.connect(...args);
    }
}
