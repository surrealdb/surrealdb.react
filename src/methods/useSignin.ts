'use client';

import { useFetcherFactory } from '@/library/fetcherFactory';
import { useKey } from '@/library/key';
import {
    AbstractMutationParameters,
    useAbstractMutation,
} from '@/methods/useAbstract';
import { useAuthUpdated } from '@/methods/useAuthUpdated';
import { type Surreal } from 'surrealdb.js';

type AnyAuth = Parameters<Surreal['signin']>[0];

export function useSignin<Error = unknown>(
    abstractArguments: AbstractMutationParameters = {}
) {
    const authUpdated = useAuthUpdated();

    type Args = [credentials: AnyAuth];
    const key = useKey(['__auth', 'signin']);
    const fetcher = useFetcherFactory<Args, string, Error>(
        'mutation',
        key,
        ({ surreal }, credentials) =>
            surreal.signin(credentials).finally(authUpdated)
    );

    return useAbstractMutation<Args, string, Error>(
        key,
        fetcher,
        abstractArguments
    );
}
