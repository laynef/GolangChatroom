import * as React from 'react';
import { Button, Card, Form, Input, InputGroup, Label } from 'reactstrap';
import { Header, Layout } from '../components/layout';
import { useLogin } from '../hooks/login';

export const LoginPage = () => {
    const { data, mutate } = useLogin();

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const onSubmit: React.FormEventHandler = (e) => {
        e.preventDefault();
        mutate({
            email,
            password,
        });
    }

    return (
        <Layout>
            <>
                <Header />
                <main>
                    <h1>Login</h1>
                    <Card className='w-75 p-3 shadow'>
                        <form onSubmit={onSubmit}>
                            <InputGroup className='pb-2 d-flex flex-column'>
                                <Label>Email</Label>
                                <Input className='w-100' value={email} onChange={e => setEmail(e.target.value)} type='email' name='email' />
                            </InputGroup>
                            <InputGroup className='pb-2 d-flex flex-column'>
                                <Label>Password</Label>
                                <Input className='w-100' value={password} onChange={e => setPassword(e.target.value)} type='password' name='password' />
                            </InputGroup>
                            <div className='pt-2 w-100'>
                                <Input type="submit" className='w-100 btn btn-outline-danger btn-block' value="Login" />
                            </div>
                            {data?.code && data.code >= 400 && data.message ? (
                                <div className='column text-danger'>
                                    An error occurred: {data.message}
                                </div>
                            ) : null}
                        </form>
                    </Card>
                </main>
            </>
        </Layout>
    )
};
