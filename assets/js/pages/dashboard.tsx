import * as React from 'react';
import { useQuery } from 'react-query';
import { Header, Layout } from '../components/layout';

export const DashboardPage = () => {
    const { data, isLoading } = useQuery('threads', async () => {
        try {
            const res = await fetch("/api/v1/threads");
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
                    <h1>Dashboard</h1>
                    {isLoading && <div>Loading...</div>}
                </main>
            </>
        </Layout>
    )
};
