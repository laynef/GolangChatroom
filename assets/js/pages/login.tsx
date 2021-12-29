import * as React from 'react';
import { Button, Card, Input, InputGroup, Label } from 'reactstrap';
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
                    <Card className='w-75 p-3 shadow'>
                        <InputGroup className='pb-2 d-flex flex-column'>
                            <Label>Email</Label>
                            <Input className='w-100' value={email} onChange={e => setEmail(e.target.value)} type='email' name='email' />
                        </InputGroup>
                        <InputGroup className='pb-2 d-flex flex-column'>
                            <Label>Password</Label>
                            <Input className='w-100' value={password} onChange={e => setPassword(e.target.value)} type='password' name='password' />
                        </InputGroup>
                        <div className='pt-2 w-100'>
                            <Button block outline color='primary' className='w-100' onClick={onSubmit}>
                                Login
                            </Button>
                        </div>
                        {data?.code && data.code >= 400 && data.message ? (
                            <div className='column text-danger'>
                                An error occurred: {data.message}
                            </div>
                        ) : null}
                    </Card>
                </main>
            </>
        </Layout>
    )
};
