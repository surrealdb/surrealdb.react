import React, { useState } from 'react';
import { useSignin } from '../../../src/methods/useSignin';

const UseSignInComponent: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [pass, setPass] = useState<string>('');
    const {
        mutate: signin,
        isSuccess,
        isError,
        error,
        isLoading,
    } = useSignin();

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await signin({ email, pass, scope: 'account' });
    };

    return (
        <div>
            <h2>User SignIn</h2>
            <form onSubmit={handleSignIn}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        type="password"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={isLoading}>
                    Sign In
                </button>
            </form>
            {isSuccess && <p>Sign in successful!</p>}
            {isError && (
                <p>
                    Error:{' '}
                    {error instanceof Error ? error.message : String(error)}
                </p>
            )}
        </div>
    );
};

export default UseSignInComponent;
