import * as React from 'react';
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { Button, Card, CardBody, CardFooter, Input } from 'reactstrap';
import { Header, Layout } from '../components/layout';

export const ChatroomPage = () => {
    const { id } = useParams();
    const { data, isLoading } = useQuery('chatroom:' + id, async () => {
        try {
            const res = await fetch(`/api/v1/threads/${id}`);
            return res.json();
        } catch (error) {
            return error;
        }
    });

    const { mutate }: any = useMutation('thread:' + id + ':message', async (body) => {
        try {
            const res = await fetch(`/api/v1/threads/${id}/messages`, {
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            });
            return res.json();
        } catch (error) {
            return error;
        }
    });

    const [text, setText] = React.useState('');

    const sendMessage = () => {
        mutate({ text });
        setText('');
    };

    return (
        <Layout>
            <>
                <Header hasAuth />
                <main>
                    <h1>{data?.name}</h1>
                    <Card className='w-75 shadow'>
                        <CardBody className='d-flex flex-column'>
                            {Array.isArray(data?.Messages?.data) && data?.Messages?.data?.length > 0 && data.Messages.data.map((message: any, key: number) => (
                                <div key={key} className='w-100'>
                                    <p>{message?.User?.username}: {message?.text}</p>
                                </div>
                            ))}
                        </CardBody>
                        <CardFooter>
                            <Input value={text} onChange={e => setText(e.target.value)} className='w-100' />
                            <Button onClick={sendMessage} block color='primary'>
                                Submit
                            </Button>
                        </CardFooter>
                    </Card>
                    {isLoading && <p>Loading...</p>}
                </main>
            </>
        </Layout>
    )
};
