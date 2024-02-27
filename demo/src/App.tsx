import React from 'react';
import { useQuery } from '../../src';
import CreateComponent from './components/CreateComponent';
import SigninComponent from './components/SigninComponent';
import SignupComponent from './components/SignupComponent';
import UpdateComponent from './components/UpdateComponent';

function Component({ refetchInterval }: { refetchInterval?: number }) {
    const { data, error, refetch } = useQuery<[number]>({
        queryKey: ['test'],
        query: 'RETURN $resource',
        queryBindings: { resource: 0 },
        refetchInterval,
    });

    return (
        <>
            <div>{refetchInterval ?? 'none'}</div>
            {data ? (
                <p>{JSON.stringify(data[0])}</p>
            ) : error ? (
                <p>{error as string}</p>
            ) : (
                <p>No response</p>
            )}
            <button onClick={() => refetch({ resource: (data?.[0] ?? 0) + 1 })}>
                refetch
            </button>
        </>
    );
}

export default function App() {
    return (
        <>
            <h2>useQuery</h2>
            <Component />

            <p>
                ---------------------------------------------------------------------
            </p>

            <h2>useSignup</h2>
            <SignupComponent />

            <p>
                ---------------------------------------------------------------------
            </p>

            <h2>useSignIn</h2>
            <SigninComponent />

            <p>
                ---------------------------------------------------------------------
            </p>

            <h2>useCreate</h2>
            <CreateComponent />

            <p>
                ---------------------------------------------------------------------
            </p>

            <h2>useUpdate</h2>
            <UpdateComponent />
        </>
    );
}
