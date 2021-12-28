import * as React from 'react';
import { Header, Layout } from '../components/layout';

export const NotFoundPage = () => {
    return (
        <Layout>
            <>
                <Header />
                <main>
                    <h1>404: Not Found!</h1>
                </main>
            </>
        </Layout>
    )
};
