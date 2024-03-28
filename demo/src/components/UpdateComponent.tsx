import React, { useState } from 'react';
import { useUpdate } from '../../../src/methods/useUpdate';

const UseUpdateComponent: React.FC = () => {
    const [id, setId] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [username, setUsername] = useState('');

    const mutationKey = ['updateUser', id];
    const resource = 'user';

    const {
        mutate: updateUser,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useUpdate({
        mutationKey,
        resource,
        data: { email, pass, username },
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await updateUser({ email, pass, username });
    };

    return (
        <div>
            <h2>Update a user</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="userId">User ID:</label>
                    <input
                        id="userId"
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                    />
                </div>
                <br />
                <div>
                    <label htmlFor="username">New Username:</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="email">New Email:</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">New Password:</label>
                    <input
                        id="password"
                        type="password"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                    />
                </div>
                <button type="submit" disabled={isLoading}>
                    Update User
                </button>
            </form>
            {isSuccess && <p>User updated successfully!</p>}
            {isError && (
                <p>
                    Error:{' '}
                    {error instanceof Error ? error.message : String(error)}
                </p>
            )}
        </div>
    );
};

export default UseUpdateComponent;
