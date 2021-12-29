import * as React from 'react';
import { useMutation, useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { Button, Card, Input, InputGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Header, Layout } from '../components/layout';


type Thread = {
    id: string;
    name: string;
}

export const ChatroomsPage = () => {
    const { data, isLoading, refetch } = useQuery('threads', async () => {
        try {
            const res = await fetch("/api/v1/threads");
            return res.json();
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
            return res.json();
        } catch (error) {
            return error;
        }
    }, {
        onSuccess: (res) => {
            if (res.name) {
                setOpen(false);
                refetch();
            }
        }
    });
    
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState('');

    return (
        <Layout>
            <>
                <Header hasAuth />
                <main>
                    <div className='d-flex w-75 align-items-center flex-row justify-content-between'>
                        <div />
                        <h1>Chatrooms</h1>
                        <Button outline color='primary' onClick={() => setOpen(true)} className='rounded-circle'>
                            +
                        </Button>
                    </div>
                    <Card className='w-75 d-flex flex-column justify-content-center shadow p-3'>
                        {isLoading && <p>Loading...</p>}
                        {Array.isArray(data?.data) && data?.data.length > 0 && data.data.map((thread: Thread, key: number) => (
                            <Link key={key} to={`/chatrooms/${thread.id}`}>
                                <div className='card w-100'>
                                    {thread.name}
                                </div>
                            </Link>
                        ))}
                        {Array.isArray(data?.data) && data.data.length === 0 && <p>No chatrooms available</p>}
                    </Card>
                </main>
                <Modal fade backdrop isOpen={open} toggle={() => setOpen(false)}>
                    <ModalHeader toggle={() => setOpen(false)}>
                        Create Chatroom
                    </ModalHeader>
                    <ModalBody>
                        <InputGroup className='d-flex flex-column w-100'>
                            <Label>Name</Label>
                            <Input className='w-100' onChange={e => setName(e.target.value)} type='text' name='name' />
                        </InputGroup>
                        {threadData?.code && threadData.code >= 400 && threadData.message ? (
                            <div className='column text-danger'>
                                An error occurred: {threadData.message}
                            </div>
                        ) : null}
                    </ModalBody>
                    <ModalFooter>
                    <Button
                        color="primary"
                        onClick={() => mutate({ name })}
                    >
                        Create
                    </Button>
                    {' '}
                    <Button outline onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    </ModalFooter>
                </Modal>
            </>
        </Layout>
    )
};
