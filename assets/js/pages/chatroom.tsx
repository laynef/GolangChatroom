import * as React from 'react';
import { Header, Layout } from '../components/layout';

export const ChatroomPage = () => {
    return (
        <Layout>
            <>
                <Header hasAuth />
                <main>
                    <h1>Hello World!</h1>
                </main>
            </>
        </Layout>
    )
};
