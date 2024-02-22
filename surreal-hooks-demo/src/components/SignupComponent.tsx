import React, { useState } from 'react';
import { useSignup } from '../hooks/methods/useSignup';

const SignupComponent: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { mutate: signup, isSuccess, isError, error } = useSignup();

    const handleSignup = async () => {
        await signup({ email, password, scope: 'user' });
    };

    return (
        <div>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={handleSignup}>Sign Up</button>
            {isSuccess && <p>Signup successful!</p>}
            {isError && <p>Error: {error as string}</p>}
        </div>
    );
};

export default SignupComponent;
