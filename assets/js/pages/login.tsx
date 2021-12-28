import * as React from 'react';
import { Header, Layout } from '../components/layout';

export const LoginPage = () => {
    return (
        <Layout>
            <>
                <Header />
                <main>
                    <h1>Login</h1>
                    <form className='card' action={null}>
                        <div className='column'>
                            <label>Email</label>
                            <input type='email' name='email' />
                        </div>
                        <div className='column'>
                            <label>Password</label>
                            <input type='password' name='password' />
                        </div>
                        <input type='submit' value='Login' />
                    </form>
                </main>
            </>
        </Layout>
    )
};
