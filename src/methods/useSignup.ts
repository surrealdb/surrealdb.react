'use client';

import { useFetcherFactory } from '@/library/useFetcherFactory';
import { useKey } from '@/library/useKey';
import {
    AbstractMutationParameters,
    useAbstractMutation,
} from '@/methods/useAbstract';
import { useAuthUpdated } from '@/methods/useAuthUpdated';
import { type Surreal } from 'surrealdb.js';

type ScopeAuth = Parameters<Surreal['signup']>[0];

export function useSignup<Error = unknown>(
    abstractArguments: AbstractMutationParameters = {}
) {
    const authUpdated = useAuthUpdated();

    type Args = [credentials: ScopeAuth];
    const key = useKey(['__auth', 'signup']);
    const fetcher = useFetcherFactory<Args, string, Error>(
        'mutation',
        key,
        ({ surreal }, credentials) =>
            surreal.signup(credentials).finally(authUpdated)
    );

    return useAbstractMutation<Args, string, Error>(
        key,
        fetcher,
        abstractArguments
    );
}
