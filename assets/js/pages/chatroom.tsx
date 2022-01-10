import * as React from 'react';
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { Header, Layout } from '../components/layout';
import { getCookie } from '../utils/auth';
import { ToastContainer, toast } from 'react-toastify';
import { ChatBox } from '../components/chatbox';


const createMessage = ({ username, text, id }: any) => ({
    id,
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
    const [messageIds, setMessageIds]: any = React.useState({});
    const [ws] = React.useState(new WebSocket(url));

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

            let newData = d?.Messages?.data || [];
            if (newData.length > 0) {
                newData = newData.filter((ele: any) => !messageIds[ele.id]);
                setMessages([...newData, ...messages]);
                setMessageIds({ ...messageIds, ...newData.reduce((acc: any, ele: any) => ({ ...acc, [ele.id]: true }), {}) });
                setPage(page + 1);
                setLastPage(d.Messages.last_page);
            }

            return null;
        } catch (error) {
            return error;
        }
    }, { retry: false, refetchOnReconnect: false });

    const { mutateAsync }: any = useMutation('thread:' + id + ':message', async (body) => {
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
        onSuccess: (d) => {
            setMessages([...messages, d]);
            setMessageIds({ ...messageIds, [d.id]: true });
            setText('');
            return d;
        },
        onSettled: d => d
    });

    React.useEffect(() => {
        ws.onopen = () => console.info('websocket connected!');

        ws.onmessage = (msg) => {
            const socket = msg.target as WebSocket;
            if (socket.url !== url) return socket.close();

            toast.dismiss();
            const d = JSON.parse(msg.data);

            if (!messageIds[d.id]) {
                toast.info(`${d?.User?.username}: ${d?.text}`, { autoClose: 3000 });
                setMessages([...messages, d]);
                setMessageIds({ ...messageIds, [d.id]: true });
            }
        }

        ws.onclose = () => {
            console.info('websocket closed!');
            toast.dismiss();
        }

    }, [ws, setMessages, messages, setMessageIds, messageIds]);

    React.useEffect(() => {
        window.addEventListener('beforeunload', () => ws.close())
        return () => {
          window.removeEventListener('beforeunload', () => ws.close())
        }
      }, [ws])

    const sendMessage: React.FormEventHandler = async (e) => {
        e.preventDefault();
        const d = await mutateAsync({ text });
        const m = JSON.stringify(createMessage({ username, text, id: d.id }));
        ws.send(m);
    }

    return (
        <Layout>
            <>
                <Header hasAuth />
                <main>
                    <h1>{roomName}</h1>
                    <ChatBox
                        refetch={refetch}
                        sendMessage={sendMessage}
                        isLoading={isLoading}
                        text={text}
                        setText={(e: any) => setText(e.target.value)}
                    >
                        {messages.length > 0 && messages.map((message: any, key: number) => (
                            <div className={`w-100 d-flex flex-row justify-content-${
                                message?.User?.username === username ? 'end' : 'start'
                            }`} key={key}>
                                <div className={`d-flex flex-column align-items-${
                                message?.User?.username === username ? 'end' : 'start'
                            }`}>
                                    {message?.User?.username !== username && <span style={{ fontSize: 12, color: 'grey' }}>{message?.User?.username}</span>}
                                    <p className={
                                        message?.User?.username === username ? 'send' : 'receive'
                                    }>{message?.text}</p>
                                </div>
                            </div>
                        ))}
                    </ChatBox>
                </main>
                <ToastContainer pauseOnFocusLoss={false} />
            </>
        </Layout>
    )
};
