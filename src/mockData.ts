// Mock data for SurrealClient
export const mockSurrealClient = {
    connect: jest.fn().mockResolvedValue('Connected'),
    query: jest.fn().mockResolvedValue([]),
    authenticate: jest.fn().mockResolvedValue('Authenticated'),
    invalidate: jest.fn().mockResolvedValue('Invalidated'),
    signup: jest.fn().mockResolvedValue('SignedUp'),
    signin: jest.fn().mockResolvedValue('SignedIn'),
    create: jest.fn().mockResolvedValue([]),
    update: jest.fn().mockResolvedValue([]),
    delete: jest.fn().mockResolvedValue([]),
    merge: jest.fn().mockResolvedValue([]),
    select: jest.fn().mockResolvedValue([]),
};

// Mock data for useAuthenticate
export const mockAuthenticateParams = {
    token: 'mockToken',
};

// Mock data for useCreate
export const mockCreateParams = {
    mutationKey: ['create', 'test'],
    resource: 'testResource',
    data: { name: 'Test Item', value: 'Test Value' },
};

// Mock data for useDelete
export const mockDeleteParams = {
    mutationKey: ['delete', 'test'],
    resource: 'testResource',
};

// Mock data for useInfo
export const mockInfoParams = {
    enabled: true,
    refetchInterval: 5000,
};

// Mock data for useInvalidate
export const mockInvalidateParams = {
    client: {},
    option: true,
};

// Mock data for useMerge
export const mockMergeParams = {
    mutationKey: ['merge', 'test'],
    resource: 'testResource',
    data: { name: 'Updated Test Item', value: 'Updated Test Value' },
};

// Mock data for useQuery
export const mockQueryParams = {
    queryKey: ['query', 'test'],
    query: 'SELECT * FROM testResource',
    queryBindings: {},
};

// Mock data for useQueryMutation
export const mockQueryMutationParams = {
    mutationKey: ['queryMutation', 'test'],
    query: 'SELECT * FROM testResource',
    queryBindings: {},
};

// Mock data for useSelect
export const mockSelectParams = {
    queryKey: ['select', 'test'],
    resource: 'testResource',
};

// Mock data for useSignin
export const mockSigninParams = {
    credentials: { username: 'testuser', password: 'testpass' },
};

// Mock data for useSignup
export const mockSignupParams = {
    credentials: {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'newpass',
    },
};

// Mock data for useUpdate
export const mockUpdateParams = {
    mutationKey: ['update', 'test'],
    resource: 'testResource',
    data: { name: 'Updated Test Item', value: 'Updated Test Value' },
};
