'use client';

import { fetcherFactory } from '@/library/fetcherFactory';
import {
    AbstractMutationParameters,
    useAbstractMutation,
} from '@/methods/useAbstract';
import { useAuthUpdated } from '@/methods/useAuthUpdated';

export function useAuthenticate<Error = unknown>(
    abstractArguments: AbstractMutationParameters = {}
) {
    const authUpdated = useAuthUpdated();

    type Args = [token: string];
    const key = JSON.stringify(['__auth', 'authenticate']);

    const fetcher = fetcherFactory<Args, boolean, Error>(
        'mutation',
        key,
        (context, token) => {
            if (!context || !context.surreal || typeof context.surreal.authenticate !== 'function') {
                throw new Error('Surreal object or authenticate method is not defined');
            }

            return context.surreal.authenticate(token)
                .then(result => {
                    authUpdated();
                    return result;
                })
                .catch(error => {
                    console.error('Authentication error:', error);
                    throw error;
                });
        }
    );

    return useAbstractMutation<Args, boolean, Error>(
        key,
        fetcher,
        abstractArguments
    );
}