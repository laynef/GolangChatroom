import * as React from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
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

    return (
        <Layout>
            <>
                <Header hasAuth />
                <main>
                    <h1>{data?.name}</h1>
                    {isLoading && <p>Loading...</p>}
                </main>
            </>
        </Layout>
    )
};
