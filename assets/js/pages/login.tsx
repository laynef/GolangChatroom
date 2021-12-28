import * as React from 'react';
import { Header, Layout } from '../components/layout';
import { useLogin } from '../hooks/login';

export const LoginPage = () => {
    const login = useLogin();

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const onSubmit = () => login.mutate({
        email,
        password,
    });

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
                            <div className='column'>An error occurred: {login?.error}</div>
                        ) : null}
                    </div>
                </main>
            </>
        </Layout>
    )
};
