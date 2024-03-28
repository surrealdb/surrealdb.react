import React from 'react';
import { useQuery } from '../../../src/methods/useQuery';

const UseQueryComponent = ({ refetchInterval }: { refetchInterval?: number }) => {
    const { data, error, refetch } = useQuery<[number]>({
        queryKey: ['test'],
        query: 'RETURN $resource',
        queryBindings: { resource: 0 },
        refetchInterval,
    });

    return (
        <div>
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
        </div>
    );
}

export default UseQueryComponent;