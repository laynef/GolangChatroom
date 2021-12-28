import * as React from 'react';
import { Header, Layout } from '../components/layout';

export const HomePage = () => {
    return (
        <Layout>
            <>
                <Header />
                <main>
                    <h1>Hello World!</h1>
                </main>
            </>
        </Layout>
    )
};
