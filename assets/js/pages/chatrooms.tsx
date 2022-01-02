import * as React from 'react';
import { useMutation, useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, Input, InputGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Header, Layout } from '../components/layout';
import { ClipLoader } from "react-spinners";
//@ts-ignore
import ScrollToBottom from 'react-scroll-to-bottom';

type Thread = {
    id: string;
    name: string;
}

export const ChatroomsPage = () => {
    const perPage = 10;
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState('');
    const [lastPage, setLastPage] = React.useState(1);
    const [page, setPage] = React.useState(1);
    const [rooms, setRooms] = React.useState([]);
    const loader = React.useRef(null);

    const { isLoading, refetch } = useQuery('threads', async () => {
        if (page > lastPage) return null;

        try {
            const res = await fetch(`/api/v1/threads?page=${page}&per_page=${perPage}`);
            const d = await res.json();
            
            const next = d.data || [];

            setRooms([...rooms, ...next]);
            setLastPage(d.last_page);
            setPage(page + 1);

            return d;
        } catch (error) {
            return error;
        }
    });

    const { mutate, data: threadData }: any = useMutation('createThread', async (body) => {
        try {
            const res = await fetch("/api/v1/threads", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            return await res.json();
        } catch (error) {
            return error;
        }
    }, {
        onSuccess: (res) => {
            if (res.name) {
                setRooms([res, ...rooms]);
                setOpen(false);
            }
        },
        onSettled: () => {
            const div = document.getElementById('scroll-container');
            div.scroll(0,0);
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

    const createThread: React.FormEventHandler = (e) => { 
        e.preventDefault(); 
        mutate({ name });
    };

    return (
        <Layout>
            <>
                <Header hasAuth />
                <main>
                    <div className='d-flex w-75 align-items-center flex-row justify-content-between'>
                        <div />
                        <h1>Chatrooms</h1>
                        <div className='d-flex flex-row align-items-center justify-content-center' style={{ width: 50, height: 50 }}>
                            <Button  className='rounded-circle text-white d-flex flex-column align-items-center justify-content-center' style={{ width: 35, height: 35 }} color='info' onClick={() => setOpen(true)}>
                                &#43;
                            </Button>
                        </div>
                    </div>
                    <ScrollToBottom mode='top' behavior="smooth" className='w-75 card d-flex flex-column justify-content-center shadow p-3 '>
                        <div id="scroll-container" className='scroll-container'>
                            <ClipLoader color='aqua' loading={isLoading} />
                            {rooms.length > 0 && rooms.map((thread: Thread, key: number) => (
                                <Link className='text-dark text-decoration-none' key={key} to={`/chatrooms/${thread.id}`}>
                                    <Card className='w-100 chatroom-card'>
                                        <CardBody>
                                            {thread.name}
                                        </CardBody>
                                    </Card>
                                </Link>
                            ))}
                            {!isLoading && rooms.length === 0 && <p>No chatrooms available</p>}
                            <div ref={loader} />
                    </div>
                    </ScrollToBottom>
                </main>
                <Modal fade backdrop isOpen={open} toggle={() => setOpen(false)}>
                    <form onSubmit={createThread}>
                        <ModalHeader toggle={() => setOpen(false)}>
                            Create Chatroom
                        </ModalHeader>
                        <ModalBody>
                            <InputGroup className='d-flex flex-column w-100'>
                                <Label>Name</Label>
                                <Input placeholder='Enter name' className='w-100' onChange={e => setName(e.target.value)} type='text' name='name' />
                            </InputGroup>
                            {threadData?.code && threadData.code >= 400 && threadData.message ? (
                                <div className='column text-danger'>
                                    An error occurred: {threadData.message}
                                </div>
                            ) : null}
                        </ModalBody>
                        <ModalFooter>

                        <div>
                            <Input
                                className="btn btn-primary"
                                value="Create"
                                type='submit'
                            />
                        </div>
                        {' '}
                        <Button outline onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        </ModalFooter>
                    </form>
                </Modal>
            </>
        </Layout>
    )
};
