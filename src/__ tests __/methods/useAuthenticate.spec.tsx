import { useAuthenticate } from '@/methods/useAuthenticate';

jest.mock('@/client');

jest.mock('@/library/fetcherFactory', () => ({
    fetcherFactory: jest.fn().mockImplementation(() => jest.fn())
}));

jest.mock('@/methods/useAuthUpdated', () => ({
    useAuthUpdated: jest.fn()
}));

jest.mock('@/methods/useAbstract', () => ({
    useAbstractMutation: jest.fn()
}));

describe('useAuthenticate', () => {

    const { fetcherFactory } = require('@/library/fetcherFactory');
    const { useAuthUpdated } = require('@/methods/useAuthUpdated');
    const { useAbstractMutation } = require('@/methods/useAbstract');

    const mockAuthUpdated = jest.fn();
    const mockUseAbstractMutation = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        global.console = {
            ...console,
            error: jest.fn(),
        };

        useAuthUpdated.mockReturnValue(mockAuthUpdated);
        fetcherFactory.mockImplementation(() => (context: { surreal: { authenticate: (arg0: any) => Promise<any>; }; }, token: any) => {
            if (!context || !context.surreal || typeof context.surreal.authenticate !== 'function') {
                return Promise.reject(new Error('Surreal object or authenticate method is not defined'));
            }

            return context.surreal.authenticate(token)
                .then(() => {
                    mockAuthUpdated();
                    return true;
                })
                .catch((error: any) => {
                    console.error('Authentication error:', error);
                    return false;
                });
        });
        useAbstractMutation.mockReturnValue(mockUseAbstractMutation);
    });

    it('should call surreal.authenticate with the provided token', async () => {
        const token = 'mock-token';
        const mockSurreal = {
            authenticate: jest.fn().mockResolvedValue(true)
        };

        useAuthenticate();
        const fetcherCall = fetcherFactory.mock.calls[0];
        const fetcherFunction = fetcherCall[2];
        const result = await fetcherFunction({ surreal: mockSurreal }, token);

        expect(mockSurreal.authenticate).toHaveBeenCalledWith(token);
        expect(mockAuthUpdated).toHaveBeenCalled();
        expect(result).toBe(true);
    });

    // Authentication error tests
    it('should handle authentication errors', async () => {
        const token = 'invalid-token';
        const mockSurreal = {
            authenticate: jest.fn().mockRejectedValue(new Error('Authentication failed'))
        };
    
        useAuthenticate();
        const fetcherCall = fetcherFactory.mock.calls[0];
        const fetcherFunction = fetcherCall[2];
    
        await expect(fetcherFunction({ surreal: mockSurreal }, token)).rejects.toThrow('Authentication failed');
    
        expect(mockSurreal.authenticate).toHaveBeenCalledWith(token);
        expect(mockAuthUpdated).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith('Authentication error:', expect.any(Error));
    });
});
