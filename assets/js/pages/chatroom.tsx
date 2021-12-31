import * as React from 'react';
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { Button, Card, CardBody, CardFooter, Input } from 'reactstrap';
import { Header, Layout } from '../components/layout';
import { getCookie } from '../utils/auth';


const createMessage = ({ username, text }: any) => ({
    text,
    User: { username },
})

export const ChatroomPage = () => {
    const { id } = useParams();
    const perPage = 10;

    const username = getCookie('username');
    const [text, setText] = React.useState('');
    const [name, setName] = React.useState('');
    const [lastPage, setLastPage] = React.useState(1);
    const [page, setPage] = React.useState(1);
    const [messages, setMessages] = React.useState([]);

    const url = "ws://" + window.location.host + window.location.pathname + "/ws";
    const ws = new WebSocket(url);
    const fetchMessagesUrl = `/api/v1/threads/${id}?page=${page}&per_page=${perPage}`;

    const { isLoading } = useQuery('chatroom:' + id, async () => {
        if (page > lastPage) return null;

        try {
            const res = await fetch(fetchMessagesUrl);
            const d: any = await res.json();
            setName(d.name);
            if (d?.Messages?.data?.length && page <= d.Messages.last_page) {
                setMessages([...d.Messages.data, ...messages]);
                setPage(page + 1);
                setLastPage(d.Messages.last_page);
            }
            return d;
        } catch (error) {
            return error;
        }
    }, { retry: false });

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
                        <CardBody className='d-flex flex-column scroll-container'>
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
