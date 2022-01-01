import * as React from 'react';
import { Header, Layout } from '../components/layout';
import { Typewriter } from 'react-simple-typewriter';

export const HomePage = () => {
    return (
        <Layout className='main-container'>
            <>
                <Header />
                <main className='homepage'>
                    <Typewriter
                        words={['Go Live Chatroom']}
                        loop={Infinity}
                        typeSpeed={70}
                        deleteSpeed={50}
                        delaySpeed={1000}
                    />
                </main>
            </>
        </Layout>
    )
};
