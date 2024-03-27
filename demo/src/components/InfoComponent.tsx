import React from 'react';
import { useInfo } from '../../../src/methods/useInfo';

const UserInfoComponent = () => {
    const { userInfo, isLoading, error, fetchUserInfo } = useInfo();

    return (
        <div>
            <button onClick={fetchUserInfo} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Fetch User Info'}
            </button>
            {error && <p>Error loading user information.</p>}
            {userInfo && (
                <ul>
                    <li>Username: {userInfo.username}</li>
                    <li>Email: {userInfo.email}</li>
                </ul>
            )}
            {!isLoading && !userInfo && !error && (
                <p>
                    No user information available. Click the button above to
                    fetch user info.
                </p>
            )}
        </div>
    );
};

export default UserInfoComponent;
