import * as React from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { Header, Layout } from '../components/layout';


const Container: React.FC = ({ children }) => (
    <Layout>
        <>
            <Header hasAuth />
            <main>
                {children}
            </main>
        </>
    </Layout>
)

export const BlogPage = () => {
    const { id } = useParams();
    const { isLoading, data } = useQuery(`blogs:${id}`, async () => {
        try {
            const res = await fetch(`/api/v1/blogs/${id}`);
            return await res.json();
        } catch (error) {
            return error;
        }
    }, { retry: false });

    if (isLoading) {
        <Container>
            <ClipLoader color='#dc3545' loading={isLoading} />
        </Container>
    }

    return (
        <Container>
            <h1>{data?.title}</h1>
            <Card className='w-75 card shadow'>
                <CardHeader>
                    <img className='w-100' src={data?.image_url} alt="" />
                </CardHeader>
                <CardBody>
                    <div id='scroll-container' className='scroll-container d-flex flex-column' dangerouslySetInnerHTML={{ __html: data?.text || '' }} />
                </CardBody>
            </Card>
        </Container>
    )
};
