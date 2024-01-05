import { fetcherFactory } from '@/library/fetcherFactory';
import { useAbstractMutation } from '@/methods/useAbstract';
import { useAuthUpdated } from '@/methods/useAuthUpdated';
import { useAuthenticate } from '@/methods/useAuthenticate';

jest.mock('@/library/fetcherFactory', () => ({
    fetcherFactory: jest.fn(),
}));
jest.mock('@/methods/useAuthUpdated', () => ({
    useAuthUpdated: jest.fn(),
}));
jest.mock('@/methods/useAbstract', () => ({
    useAbstractMutation: jest.fn(),
}));

describe('useAuthenticate', () => {
    const mockAuthUpdated = jest.fn();
    const mockUseAbstractMutation = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        global.console = {
            ...console,
            error: jest.fn(),
        };

        (useAuthUpdated as jest.Mock).mockReturnValue(mockAuthUpdated);
        (fetcherFactory as jest.Mock).mockImplementation(
            () =>
                (
                    context: {
                        surreal: {
                            authenticate: (arg0: string) => Promise<string>;
                        };
                    },
                    token: string
                ) => {
                    if (
                        !context ||
                        !context.surreal ||
                        typeof context.surreal.authenticate !== 'function'
                    ) {
                        return Promise.reject(
                            new Error(
                                'Surreal object or authenticate method is not defined'
                            )
                        );
                    }

                    return context.surreal
                        .authenticate(token)
                        .then(() => {
                            mockAuthUpdated();
                            return true;
                        })
                        .catch((error: string) => {
                            console.error('Authentication error:', error);
                            return false;
                        });
                }
        );
        (useAbstractMutation as jest.Mock).mockReturnValue(
            mockUseAbstractMutation
        );
    });

    it('should successfully authenticate with a valid token', async () => {
        const token = 'valid-token';
        const mockSurreal = {
            authenticate: jest.fn().mockResolvedValue(true),
        };

        useAuthenticate();
        const fetcherCall = (fetcherFactory as jest.Mock).mock.calls[0];
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
        const fetcherCall = (fetcherFactory as jest.Mock).mock.calls[0];
        const fetcherFunction = fetcherCall[2];

        await expect(
            fetcherFunction({ surreal: mockSurreal }, token)
        ).rejects.toThrow('Authentication failed');
        expect(mockSurreal.authenticate).toHaveBeenCalledWith(token);
        expect(mockAuthUpdated).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith(
            'Authentication error:',
            new Error('Authentication failed')
        );
    });
});
