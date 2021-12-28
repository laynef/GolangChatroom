import * as React from 'react';
import { Header, Layout } from '../components/layout';
import { useSignUp } from '../hooks/signup';

export const SignUpPage = () => {
    const { mutate, data }: any = useSignUp();

    const [email, setEmail] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [password_confirmation, setPasswordConfirmation] = React.useState('');

    const onSubmit = () => mutate({
        email,
        username,
        password,
        password_confirmation,
    });

    return (
        <Layout>
            <>
                <Header />
                <main>
                    <h1>Sign Up</h1>
                    <div className='card'>
                        <div className='column'>
                            <label>Username</label>
                            <input value={username} onChange={e => setUsername(e.target.value)} type='text' name='username' />
                        </div>
                        <div className='column'>
                            <label>Email</label>
                            <input value={email} onChange={e => setEmail(e.target.value)} type='email' name='email' />
                        </div>
                        <div className='column'>
                            <label>Password</label>
                            <input value={password} onChange={e => setPassword(e.target.value)} type='password' name='password' />
                        </div>
                        <div className='column'>
                            <label>Password Confirmation</label>
                            <input value={password_confirmation} onChange={e => setPasswordConfirmation(e.target.value)} type='password' name='password_confirmation' />
                        </div>
                        <button type='submit' onClick={onSubmit}>
                            Sign Up
                        </button>
                        {data?.code && data.code >= 400 && data.message ? (
                            <div className='column error-message'>An error occurred: {data.message}</div>
                        ) : null}
                    </div>
                </main>
            </>
        </Layout>
    )
};
