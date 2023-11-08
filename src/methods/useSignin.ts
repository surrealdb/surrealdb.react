'use client';

import { AnyAuth } from 'surrealdb.js/types';
import { fetcherFactory } from '../library/fetcherFactory';
import { AbstractMutationParameters, useAbstractMutation } from './useAbstract';
import { useAuthUpdated } from './useAuthUpdated';

export function useSignin<Error = unknown>(
    abstractArguments: AbstractMutationParameters = {}
) {
    const authUpdated = useAuthUpdated();

    type Args = [credentials: AnyAuth];
    const key = JSON.stringify(['__auth', 'signin']);
    const fetcher = fetcherFactory<Args, string, Error>(
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
