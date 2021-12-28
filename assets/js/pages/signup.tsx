import * as React from 'react';
import { useMutation } from 'react-query';
import { Header, Layout } from '../components/layout';

type RequestBody = {
    email: string;
    username: string;
    password: string;
    password_confirmation: string;
}

type ErrorResponse = {
    message: string;
    code: number;
}

export const SignUpPage = () => {
    const signup = useMutation((body: RequestBody) => {
        return fetch('/api/v1/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        })
        .then(res => res.json())
        .catch((err: ErrorResponse) => err)
    }, {
        onError: (error: ErrorResponse) => {
            console.error(error);
        },
        onSuccess: (data, variables, context) => {
            // Boom baby!
        },
    });

    const [email, setEmail] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [password_confirmation, setPasswordConfirmation] = React.useState('');

    return (
        <Layout>
            <>
                <Header />
                <main>
                    <h1>Sign Up</h1>
                    <form className='card' onSubmit={() => signup.mutate({
                        email,
                        username,
                        password,
                        password_confirmation,
                    })} action={null}>
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
