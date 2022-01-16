import * as React from 'react';
import { Header, Layout } from '../components/layout';

export const DashboardPage = () => {
    return (
        <Layout>
            <>
                <Header hasAuth />
                <main>
                    <h1>Dashboard</h1>
                </main>
            </>
        </Layout>
    )
};
