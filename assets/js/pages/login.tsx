import * as React from 'react';
import { useQueryClient } from 'react-query';
import { Header, Layout } from '../components/layout';
import { useLogin } from '../hooks/login';

export const LoginPage = () => {
    const queryClient = useQueryClient();
    const login = useLogin(queryClient);

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const onSubmit = () => login.mutate({
        email,
        password,
    });

    if (login.isSuccess) {
        window.location.href = "/dashboard";
    }

    return (
        <Layout>
            <>
                <Header />
                <main>
                    <h1>Login</h1>
                    <div className='card'>
                        <div className='column'>
                            <label>Email</label>
                            <input value={email} onChange={e => setEmail(e.target.value)} type='email' name='email' />
                        </div>
                        <div className='column'>
                            <label>Password</label>
                            <input value={password} onChange={e => setPassword(e.target.value)} type='password' name='password' />
                        </div>
                        <button onClick={onSubmit} type='submit'>
                            Login
                        </button>
                        {login.isError ? (
                            <div className='column'>An error occurred: {login.error.message}</div>
                        ) : null}
                    </div>
                </main>
            </>
        </Layout>
    )
};
