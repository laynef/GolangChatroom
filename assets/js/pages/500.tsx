import * as React from 'react';
import { Header, Layout } from '../components/layout';

export const InternalErrorPage = () => {
    return (
        <Layout>
            <>
                <Header />
                <main>
                    <h1>500: We are experiencing technical issues!</h1>
                </main>
            </>
        </Layout>
    )
};
