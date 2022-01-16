import * as React from 'react';
import { Header, Layout } from '../components/layout';

export const BlogPage = () => {
    return (
        <Layout>
            <>
                <Header hasAuth />
                <main>
                    <h1>Blog</h1>
                </main>
            </>
        </Layout>
    )
};
