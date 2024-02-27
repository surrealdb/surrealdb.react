import React, { useState } from 'react';
import { useDelete } from '../../../src/methods/useDelete';

const UseDeleteComponent: React.FC = () => {
    const [id, setId] = useState('');

    const mutationKey = ['deleteUser', id];
    const resource = 'user';

    const {
        mutate: deleteUser,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useDelete({
        mutationKey,
        resource,
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await deleteUser();
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="userId">User ID:</label>
                    <input
                        id="id"
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={isLoading}>
                    Delete User
                </button>
            </form>
            {isSuccess && <p>User deleted successfully!</p>}
            {isError && (
                <p>
                    Error:{' '}
                    {error instanceof Error ? error.message : String(error)}
                </p>
            )}
        </div>
    );
};

export default UseDeleteComponent;
