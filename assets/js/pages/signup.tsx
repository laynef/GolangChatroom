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
                    <div className='card w-75 p-3 shadow'>
                        <div className='form-group pb-1'>
                            <label>Username</label>
                            <input className='form-control' value={username} onChange={e => setUsername(e.target.value)} type='text' name='username' />
                        </div>
                        <div className='form-group pb-1'>
                            <label>Email</label>
                            <input className='form-control' value={email} onChange={e => setEmail(e.target.value)} type='email' name='email' />
                        </div>
                        <div className='form-group pb-1'>
                            <label>Password</label>
                            <input className='form-control' value={password} onChange={e => setPassword(e.target.value)} type='password' name='password' />
                        </div>
                        <div className='form-group pb-1'>
                            <label>Password Confirmation</label>
                            <input className='form-control' value={password_confirmation} onChange={e => setPasswordConfirmation(e.target.value)} type='password' name='password_confirmation' />
                        </div>
                        <div className='pt-2 w-100'>
                            <button className='btn btn-outline-primary w-100 btn-block' type='submit' onClick={onSubmit}>
                                Sign Up
                            </button>
                        </div>
                        {data?.code && data.code >= 400 && data.message ? (
                            <div className='column error-message'>An error occurred: {data.message}</div>
                        ) : null}
                    </div>
                </main>
            </>
        </Layout>
    )
};
