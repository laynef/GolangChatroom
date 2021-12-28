import * as React from 'react';
import { useQueryClient } from 'react-query';
import { Header, Layout } from '../components/layout';
import { useSignUp } from '../hooks/signup';

export const SignUpPage = () => {
    const queryClient = useQueryClient();
    const signup = useSignUp(queryClient);

    const [email, setEmail] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [password_confirmation, setPasswordConfirmation] = React.useState('');

    const onSubmit = () => signup.mutate({
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
                    <form className='card' method='POST' onSubmit={onSubmit} action={null}>
                        <div className='column'>
                            <label>Username</label>
                            <input onChange={e => setUsername(e.target.value)} type='text' name='username' />
                        </div>
                        <div className='column'>
                            <label>Email</label>
                            <input onChange={e => setEmail(e.target.value)} type='email' name='email' />
                        </div>
                        <div className='column'>
                            <label>Password</label>
                            <input onChange={e => setPassword(e.target.value)} type='password' name='password' />
                        </div>
                        <div className='column'>
                            <label>Password Confirmation</label>
                            <input onChange={e => setPasswordConfirmation(e.target.value)} type='password' name='password_confirmation' />
                        </div>
                        <input type='submit' value='Sign Up' />
                        {signup.isError ? (
                            <div>An error occurred: {signup.error.message}</div>
                        ) : null}
                    </form>
                </main>
            </>
        </Layout>
    )
};
