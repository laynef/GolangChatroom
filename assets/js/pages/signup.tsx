import * as React from 'react';
import { Header, Layout } from '../components/layout';

export const SignUpPage = () => {
    return (
        <Layout>
            <>
                <Header />
                <main>
                    <h1>Sign Up</h1>
                    <form className='card' action={null}>
                        <div className='column'>
                            <label>Email</label>
                            <input type='email' name='email' />
                        </div>
                        <div className='column'>
                            <label>Username</label>
                            <input type='text' name='username' />
                        </div>
                        <div className='column'>
                            <label>Password</label>
                            <input type='password' name='password' />
                        </div>
                        <div className='column'>
                            <label>Password Confirmation</label>
                            <input type='password' name='password_confirmation' />
                        </div>
                        <input type='submit' value='Sign Up' />
                    </form>
                </main>
            </>
        </Layout>
    )
};
