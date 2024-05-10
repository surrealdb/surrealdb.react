import { SurrealClient } from '@/client';
import { useFetcherFactory } from '@/library/useFetcherFactory';
import { useAbstractMutation } from '@/methods/useAbstract';
import { useAuthUpdated } from '@/methods/useAuthUpdated';
import { useAuthenticate } from '@/methods/useAuthenticate';

jest.mock('@/library/fetcherFactory', () => ({
    fetcherFactory: jest.fn((...args: Parameters<typeof useFetcherFactory>) =>
        useFetcherFactory(...args)
    ),
}));
jest.mock('@/methods/useAuthUpdated', () => ({
    useAuthUpdated: jest.fn((...args: Parameters<typeof useAuthUpdated>) =>
        useAuthUpdated(...args)
    ),
}));
jest.mock('@/methods/useAbstract', () => ({
    useAbstractMutation: jest.fn(
        (...args: Parameters<typeof useAbstractMutation>) =>
            useAbstractMutation(...args)
    ),
}));

describe('useAuthenticate', () => {
    const mockAuthUpdated = jest.fn();
    const mockAbstractMutation = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useAuthUpdated as jest.Mock).mockReturnValue(mockAuthUpdated);
        (useFetcherFactory as jest.Mock).mockImplementation(
            () =>
                ({ surreal }: SurrealClient, token: string) =>
                    surreal.authenticate(token).finally(mockAuthUpdated)
        );
        (useAbstractMutation as jest.Mock).mockReturnValue(
            mockAbstractMutation
        );
    });

    it('should successfully authenticate with a valid token', async () => {
        const token = 'valid-token';
        const mockSurreal = {
            authenticate: jest.fn().mockResolvedValue(true),
        };

        useAuthenticate();
        const fetcherCall = (useFetcherFactory as jest.Mock).mock.calls[0];
        const fetcherFunction = fetcherCall[2];
        const result = await fetcherFunction({ surreal: mockSurreal }, token);

        expect(mockSurreal.authenticate).toHaveBeenCalledWith(token);
        expect(mockAuthUpdated).toHaveBeenCalled();
        expect(result).toBe(true);
    });

    it('should handle authentication failure', async () => {
        const token = 'invalid-token';
        const mockSurreal = {
            authenticate: jest
                .fn()
                .mockRejectedValue(new Error('Authentication failed')),
        };

        useAuthenticate();
        const fetcherCall = (useFetcherFactory as jest.Mock).mock.calls[0];
        const fetcherFunction = fetcherCall[2];

        await expect(
            fetcherFunction({ surreal: mockSurreal }, token)
        ).rejects.toThrow('Authentication failed');
        expect(mockSurreal.authenticate).toHaveBeenCalledWith(token);

        // Auth is always updated no matter if the request succeeded or failed
        expect(mockAuthUpdated).toHaveBeenCalledTimes(1);
    });
});
