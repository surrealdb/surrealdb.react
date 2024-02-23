import React from 'react';
import { useQuery } from '../../src';
import SignupComponent from './components/SignupComponent';

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
            <h2>useQuery hook</h2>
            <Component />

            <p>---------------------------------------------------------------------</p>

            <h2>useSignup hook</h2>
            <SignupComponent />
        </>
    );
}
