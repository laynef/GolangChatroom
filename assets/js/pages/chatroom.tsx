import * as React from 'react';
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { Card, CardBody, CardFooter, Form, Input } from 'reactstrap';
import { Header, Layout } from '../components/layout';
import { getCookie } from '../utils/auth';
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from 'react-toastify';
// @ts-ignore
import ScrollToBottom from 'react-scroll-to-bottom';


const createMessage = ({ username, text }: any) => ({
    text,
    User: { username },
})

export const ChatroomPage = () => {
    const url = "ws://" + window.location.host + window.location.pathname + "/ws";
    const { id } = useParams();
    const perPage = 15;

    const username = getCookie('username');
    const [text, setText] = React.useState('');
    const [roomName, setRoomName] = React.useState(null);
    const [lastPage, setLastPage] = React.useState(2);
    const [page, setPage] = React.useState(1);
    const [messages, setMessages] = React.useState([]);
    const [ws] = React.useState(new WebSocket(url));
    const loader = React.useRef(null);

    const fetchMessagesUrl = `/api/v1/threads/${id}?page=${page}&per_page=${perPage}`;

    const { isLoading, refetch } = useQuery('chatroom:' + id, async () => {
        if (page >= lastPage) return null;

        try {
            const res = await fetch(fetchMessagesUrl);
            const d: any = await res.json();

            if (!roomName) {
                setRoomName(d.name);
                toast(`Entered room: ${d.name}!`, { autoClose: 3000 });
            }

            if (d?.Messages?.data?.length > 0) {
                setMessages([...d.Messages.data, ...messages]);
                setPage(page + 1);
                setLastPage(d.Messages.last_page);
            }

            return null;
        } catch (error) {
            return error;
        }
    }, { retry: false, refetchOnReconnect: false });

    const { mutate }: any = useMutation('thread:' + id + ':message', async (body) => {
        try {
            const res = await fetch(`/api/v1/threads/${id}/messages`, {
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            });
            return await res.json();
        } catch (error) {
            return error;
        }
    }, {
        onSuccess: (data) => {
            console.log(data)
            const m = JSON.stringify(data);
            ws.send(m);
            setMessages([...messages, data]);
            setText('');
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

    React.useEffect(() => {
        ws.onopen = () => console.info('websocket connected!');

        ws.onmessage = (msg) => {
            const socket = msg.target as WebSocket;
            if (socket.url !== url) return socket.close();

            toast.dismiss();
            const d = JSON.parse(msg.data);

            if (d?.User?.username !== username) {
                toast.info(`${d?.User?.username}: ${d?.text}`, { autoClose: 3000 });
                setMessages([...messages, d]);
            }
        }

        ws.onclose = () => {
            console.info('websocket closed!');
            toast.dismiss();
        }

    }, [ws, setMessages, messages]);

    React.useEffect(() => {
        window.addEventListener('beforeunload', () => ws.close())
        return () => {
          window.removeEventListener('beforeunload', () => ws.close())
        }
      }, [ws])

    const sendMessage: React.FormEventHandler = (e) => {
        e.preventDefault();
        mutate({ text });
    }

    return (
        <Layout>
            <>
                <Header hasAuth />
                <main>
                    <h1>{roomName}</h1>
                    <Card className='w-75 shadow'>
                        <Form onSubmit={sendMessage} method='none' action={null}>
                            <CardBody className='d-flex flex-column'>
                                <ScrollToBottom id="scroll-container" behavior="auto" className='scroll-container'>
                                    <div ref={loader} />
                                    <ClipLoader color='aqua' loading={isLoading} />
                                    {Array.isArray(messages) && messages.length > 0 && messages.map((message: any, key: number) => (
                                        <p key={key}>{message?.User?.username}: {message?.text}</p>
                                    ))}
                                </ScrollToBottom>
                            </CardBody>
                            <CardFooter>
                                <Input placeholder='Enter message' value={text} onChange={e => setText(e.target.value)} className='w-100' />
                                <Input type='submit' className='btn btn-block btn-primary' value="Send" />
                            </CardFooter>
                        </Form>
                    </Card>
                </main>
                <ToastContainer pauseOnFocusLoss={false} />
            </>
        </Layout>
    )
};
