'use client';

import { type Surreal } from 'surrealdb.js';
import { fetcherFactory } from '../library/fetcherFactory';
import {
    AbstractMutationParameters,
    useAbstractMutation,
} from '../methods/useAbstract';
import { useAuthUpdated } from '../methods/useAuthUpdated';

type ScopeAuth = Parameters<Surreal['signup']>[0];

export function useSignup<Error = unknown>(
    abstractArguments: AbstractMutationParameters = {}
) {
    const authUpdated = useAuthUpdated();

    type Args = [credentials: ScopeAuth];
    const key = JSON.stringify(['__auth', 'signup']);
    const fetcher = fetcherFactory<Args, string, Error>(
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
