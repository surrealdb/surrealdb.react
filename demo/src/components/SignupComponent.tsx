import React, { useState } from 'react';
import { useSignup } from '../../../src/methods/useSignup';

const UseSignupComponent: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [pass, setPass] = useState<string>('');
    const { mutate: signup, isSuccess, isError, error } = useSignup();

    const handleSignup = async () => {
        await signup({ email, pass, scope: 'account' });
    };

    return (
        <div>
            <h2>User SignUp</h2>
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
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
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

export default UseSignupComponent;
