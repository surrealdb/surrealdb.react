import React, { useState } from 'react';
import { useCreate } from '../../../src/methods/useCreate';

const UseCreateComponent: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const mutationKey = ['createUser'];
    const resource = 'user';

    const {
        mutate: createUser,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useCreate({
        mutationKey,
        resource,
        data: { username, email, pass },
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await createUser({ username, email, pass });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
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
                    Create User
                </button>
            </form>
            {isSuccess && <p>User created successfully!</p>}
            {isError && (
                <p>
                    Error:{' '}
                    {error instanceof Error ? error.message : String(error)}
                </p>
            )}
        </div>
    );
};

export default UseCreateComponent;
