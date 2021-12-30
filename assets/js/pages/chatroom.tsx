import * as React from 'react';
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { Button, Card, CardBody, CardFooter, Input } from 'reactstrap';
import { Header, Layout } from '../components/layout';
import * as io from 'socket.io-client';


const createMessage = ({ username, text }: any) => ({
    text,
    User: { username },
})

export const ChatroomPage = () => {
    const { id } = useParams();

    const [text, setText] = React.useState('');
    const [name, setName] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [messages, setMessages] = React.useState([]);

    const url = "ws://" + window.location.host + window.location.pathname + "/ws";
    const ws = new WebSocket(url);

    const { isLoading } = useQuery('chatroom:' + id, async () => {
        try {
            const res = await fetch(`/api/v1/threads/${id}`);
            const d: any = res.json();
            setName(d.name);
            setUsername(d?.User?.username);
            setMessages(d?.Messages?.data || []);
            return d;
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

    const sendMessage = () => {
        mutate({ text });
        const m = createMessage({ text, username });
        ws.send(JSON.stringify(m));
        setText('');
    }

    ws.onmessage = (msg) => setMessages([...messages, JSON.parse(msg.data)]);

    return (
        <Layout>
            <>
                <Header hasAuth />
                <main>
                    <h1>{name}</h1>
                    <Card className='w-75 shadow'>
                        <CardBody className='d-flex flex-column'>
                            {Array.isArray(messages) && messages.length > 0 && messages.map((message: any, key: number) => (
                                <div key={key} className='w-100'>
                                    <p>{message?.User?.username}: {message?.text}</p>
                                </div>
                            ))}
                        </CardBody>
                        <CardFooter>
                            <Input placeholder='Enter message' value={text} onChange={e => setText(e.target.value)} className='w-100' />
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
