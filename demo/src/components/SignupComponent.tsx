import React, { useState } from 'react';
import { useSignup } from '../../../src/methods/useSignup';

const SignupComponent: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { mutate: signup, isSuccess, isError, error } = useSignup();

    const handleSignup = async () => {
        await signup({ email, password, scope: 'user' });
    };

    return (
        <div>
            <div>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
            </div>
            <div>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
            </div>
            <div>
                <button onClick={handleSignup}>Sign Up</button>
            </div>
            {isSuccess && <p>Signup successful!</p>}
            {isError && <p>Error: {error as string}</p>}
        </div>
    );
};

export default SignupComponent;
