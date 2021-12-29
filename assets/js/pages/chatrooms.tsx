import * as React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { Button, Input, InputGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Header, Layout } from '../components/layout';


type Thread = {
    id: string;
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
                    <div className='w-75 card d-flex flex-column justify-content-center shadow p-3'>
                        {isLoading && <p>Loading...</p>}
                        {data && data.data.map((thread: Thread, key: number) => (
                            <Link to={`/chatrooms/${thread.id}`}>
                                <div className='card w-100'>
                                    Thread
                                </div>
                            </Link>
                        ))}
                        {data?.data && data.data.length === 0 && <p>No chatrooms available</p>}
                    </div>
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
                    </ModalBody>
                    <ModalFooter>
                    <Button
                        color="primary"
                        onClick={() => {}}
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
