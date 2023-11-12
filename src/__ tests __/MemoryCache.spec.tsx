import { CacheCollection, CacheValue, MemoryCache } from '../cache';

describe('MemoryCache', () => {
    let cache: MemoryCache;
    const testCollection: CacheCollection = 'query';
    const testKey = 'testKey';
    const testValue: CacheValue = {
        status: 'success',
        fetchStatus: 'idle',
        data: { some: 'data' },
    };

    beforeEach(() => {
        cache = new MemoryCache();
    });

    // Test cases for set and get methods
    test('set and get methods should store and retrieve data correctly', () => {
        cache.set(testCollection, testKey, testValue);
        const retrievedValue = cache.get(testCollection, testKey);

        expect(retrievedValue).toEqual(testValue);
    });

    // Test cases for listener functionality
    test('should correctly add a listener', () => {
        const listener = jest.fn();
        const added = cache.subscribe(listener, testCollection, testKey);

        expect(added).toBe(true);
        expect(listener).not.toHaveBeenCalled();
    });
    test('should notify the listener when a value is set', () => {
        const listener = jest.fn();
        cache.subscribe(listener, testCollection, testKey);
        cache.set(testCollection, testKey, testValue);

        expect(listener).toHaveBeenCalledWith(testKey, testValue, undefined);
    });
    test('should correctly remove a listener', () => {
        const listener = jest.fn();
        cache.subscribe(listener, testCollection, testKey);

        const removed = cache.unsubscribe(listener, testCollection, testKey);
        cache.set(testCollection, testKey, testValue);

        expect(removed).toBe(true);
        expect(listener).not.toHaveBeenCalledWith(
            testKey,
            testValue,
            undefined
        );
    });

    // Edge case tests
    test('get method should return undefined for a non-existent key', () => {
        const nonExistentKey = 'nonExistentKey';
        const value = cache.get(testCollection, nonExistentKey);

        expect(value).toBeUndefined();
    });
    test('should allow adding a listener to a non-existent key', () => {
        const nonExistentKey = 'nonExistentKey';
        const listener = jest.fn();
        const added = cache.subscribe(listener, testCollection, nonExistentKey);

        expect(added).toBe(true);
    });
    test('should return false when removing a non-existent listener', () => {
        const nonExistentListener = jest.fn();
        const removed = cache.unsubscribe(
            nonExistentListener,
            testCollection,
            testKey
        );

        expect(removed).toBe(false);
    });
    test('should not notify a listener twice if added twice for the same key', () => {
        const listener = jest.fn();
        const initialValue: CacheValue = {
            status: 'success',
            fetchStatus: 'idle',
        };
        const anotherValue: CacheValue = {
            status: 'success',
            fetchStatus: 'idle',
        };

        cache.set(testCollection, testKey, initialValue);
        cache.subscribe(listener, testCollection, testKey);
        cache.subscribe(listener, testCollection, testKey);
        cache.set(testCollection, testKey, anotherValue);

        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith(
            testKey,
            anotherValue,
            initialValue
        );
    });
});
