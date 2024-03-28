import React, { useState } from 'react';
import { useMerge } from '../../../src/methods/useMerge';

const MergeComponent: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
    });

    const { mutate, isLoading, isSuccess, isError, error } = useMerge({
        mutationKey: ['username', 'user'],
        resource: 'test',
        data: formData,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate(formData);
    };

    return (
        <div>
            <h4>Update(merge) a username with an email</h4>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                </div>
                <button type="submit" disabled={isLoading}>
                    Merge
                </button>
            </form>
            {isLoading && <p>Updating...</p>}
            {isSuccess && <p>Profile merged successfully!</p>}
            {isError && (
                <p>
                    Error updating profile: {error?.message || 'Unknown error'}
                </p>
            )}
        </div>
    );
};

export default MergeComponent;
