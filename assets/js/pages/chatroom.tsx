import * as React from 'react';
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { Card, CardBody, CardFooter, Form, Input } from 'reactstrap';
import { Header, Layout } from '../components/layout';
import { getCookie } from '../utils/auth';
// @ts-ignore
import ScrollToBottom from 'react-scroll-to-bottom';


const createMessage = ({ username, text }: any) => ({
    text,
    User: { username },
})

export const ChatroomPage = () => {
    const { id } = useParams();
    const perPage = 20;

    const username = getCookie('username');
    const [text, setText] = React.useState('');
    const [name, setName] = React.useState('');
    const [lastPage, setLastPage] = React.useState(1);
    const [page, setPage] = React.useState(1);
    const [messages, setMessages] = React.useState([]);
    const loader = React.useRef(null);

    const url = "ws://" + window.location.host + window.location.pathname + "/ws";
    const ws = new WebSocket(url);
    const fetchMessagesUrl = `/api/v1/threads/${id}?page=${page}&per_page=${perPage}`;

    const { isLoading, refetch } = useQuery('chatroom:' + id, async () => {
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

    const handleObserver = React.useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
            refetch();
        }
    }, []);

    React.useEffect(() => {
        const option = {
            root: null as any,
            rootMargin: "20px",
            threshold: 0
        };
        const observer = new IntersectionObserver(handleObserver, option);
        if (loader.current) observer.observe(loader.current);
    }, [handleObserver]);

    const sendMessage = () => {
        mutate({ text });
        const m = createMessage({ text, username });
        ws.send(JSON.stringify(m));
        setText('');
    }

    ws.onmessage = (msg) => {
        setMessages([...messages, JSON.parse(msg.data)]);
    }

    return (
        <Layout>
            <>
                <Header hasAuth />
                <main>
                    <h1>{name}</h1>
                    <Card className='w-75 shadow'>
                        <Form onSubmit={sendMessage} method='none' action={null}>
                            <CardBody className='d-flex flex-column'>
                                <ScrollToBottom id="scroll-container" behavior="auto" className='scroll-container'>
                                    <div ref={loader} />
                                    {Array.isArray(messages) && messages.length > 0 && messages.map((message: any, key: number) => (
                                        <div key={key} className='w-100'>
                                            <p>{message?.User?.username}: {message?.text}</p>
                                        </div>
                                    ))}
                                </ScrollToBottom>
                            </CardBody>
                            <CardFooter>
                                <Input placeholder='Enter message' value={text} onChange={e => setText(e.target.value)} className='w-100' />
                                <Input type='submit' className='btn btn-block btn-primary' value="Send" />
                            </CardFooter>
                        </Form>
                    </Card>
                    {isLoading && <p>Loading...</p>}
                </main>
            </>
        </Layout>
    )
};
