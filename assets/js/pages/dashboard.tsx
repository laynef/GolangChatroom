import * as React from 'react';
import { useQuery } from 'react-query';
import { Header, Layout } from '../components/layout';


type Thread = {

}

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
                    <div className='d-flex w-75 align-items-center flex-row justify-content-between'>
                        <div />
                        <h1>Dashboard</h1>
                        <button className='rounded-circle btn btn-outline-primary'>
                            +
                        </button>
                    </div>
                    <div className='w-75 card d-flex flex-column justify-content-center shadow p-3'>
                        {isLoading && <p>Loading...</p>}
                        {data && data.data.map((thread: Thread, key: number) => (
                            <div key={key}>
                                Thread
                            </div>
                        ))}
                        {data?.data && data.data.length === 0 && <p>No threads available</p>}
                    </div>
                </main>
            </>
        </Layout>
    )
};
