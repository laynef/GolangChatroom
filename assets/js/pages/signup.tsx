import * as React from 'react';
import { Button, Card, Input, InputGroup, Label } from 'reactstrap';
import { Header, Layout } from '../components/layout';
import { useSignUp } from '../hooks/signup';

export const SignUpPage = () => {
    const { mutate, data }: any = useSignUp();

    const [email, setEmail] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [password_confirmation, setPasswordConfirmation] = React.useState('');

    const onSubmit: React.FormEventHandler = async (e) => {
        e.preventDefault();
        mutate({
            email,
            username,
            password,
            password_confirmation,
        });
    }

    return (
        <Layout>
            <>
                <Header />
                <main>
                    <h1>Sign Up</h1>
                    <Card className='w-75 p-3 shadow'>
                        <form onSubmit={onSubmit}>
                            <InputGroup className='pb-1 d-flex flex-column'>
                                <Label>Username</Label>
                                <Input className='w-100' value={username} onChange={e => setUsername(e.target.value)} type='text' name='username' />
                            </InputGroup>
                            <InputGroup className='pb-1 d-flex flex-column'>
                                <Label>Email</Label>
                                <Input className='w-100' value={email} onChange={e => setEmail(e.target.value)} type='email' name='email' />
                            </InputGroup>
                            <InputGroup className='pb-1 d-flex flex-column'>
                                <Label>Password</Label>
                                <Input className='w-100' value={password} onChange={e => setPassword(e.target.value)} type='password' name='password' />
                            </InputGroup>
                            <InputGroup className='pb-1 d-flex flex-column'>
                                <Label>Password Confirmation</Label>
                                <Input className='w-100' value={password_confirmation} onChange={e => setPasswordConfirmation(e.target.value)} type='password' name='password_confirmation' />
                            </InputGroup>
                            <div className='pt-2 w-100'>
                                <Button type='submit' block outline color='danger' className='w-100'>
                                    Sign Up
                                </Button>
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
