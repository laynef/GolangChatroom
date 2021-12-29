import * as React from 'react';
import { Header, Layout } from '../components/layout';
import { useLogin } from '../hooks/login';

export const LoginPage = () => {
    const { data, mutate } = useLogin();

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const onSubmit = () => mutate({
        email,
        password,
    });

    return (
        <Layout>
            <>
                <Header />
                <main>
                    <h1>Login</h1>
                    <div className='card w-75 p-3 shadow'>
                        <div className='form-group pb-2'>
                            <label>Email</label>
                            <input className='form-control' value={email} onChange={e => setEmail(e.target.value)} type='email' name='email' />
                        </div>
                        <div className='form-group pb-2'>
                            <label>Password</label>
                            <input className='form-control' value={password} onChange={e => setPassword(e.target.value)} type='password' name='password' />
                        </div>
                        <div className='pt-2 w-100'>
                            <button className='btn w-100 btn-outline-primary btn-block' onClick={onSubmit} type='submit'>
                                Login
                            </button>
                        </div>
                        {data?.code && data.code >= 400 && data.message ? (
                            <div className='column text-danger'>An error occurred: {data.message}</div>
                        ) : null}
                    </div>
                </main>
            </>
        </Layout>
    )
};
