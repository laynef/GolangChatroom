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

    return (
        <Layout>
            <>
                <Header />
                <main>
                    <h1>Login</h1>
                    <form className='card' method='POST' onSubmit={onSubmit} action={null}>
                        <div className='column'>
                            <label>Email</label>
                            <input onChange={e => setEmail(e.target.value)} type='email' name='email' />
                        </div>
                        <div className='column'>
                            <label>Password</label>
                            <input onChange={e => setPassword(e.target.value)} type='password' name='password' />
                        </div>
                        <input type='submit' value='Login' />
                    </form>
                </main>
            </>
        </Layout>
    )
};
