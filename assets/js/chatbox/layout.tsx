import * as React from 'react';
import { Card, CardBody, CardFooter, Form, Input } from 'reactstrap';
import { ClipLoader } from "react-spinners";
// @ts-ignore
import ScrollToBottom from 'react-scroll-to-bottom';

export const ChatBoxLayout = ({
    children,
    sendMessage,
    isLoading,
    text,
    setText,
    refetch,
}: any) => {
    const loader = React.useRef(null);

    const handleObserver = React.useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
            refetch();
        }
    }, []);

    React.useEffect(() => {
        const option = {
            root: null as any,
            rootMargin: "20px",
            threshold: 0
        };
        const observer = new IntersectionObserver(handleObserver, option);
        if (loader.current) observer.observe(loader.current);
    }, [handleObserver]);

    return (
        <Card className='w-75 shadow chat-body'>
            <Form className='w-100' onSubmit={sendMessage} method='none' action={null}>
                <CardBody className='d-flex flex-column w-100'>
                    <ScrollToBottom id="scroll-container" behavior="auto" scrollViewClassName='no-x-overflow' className='scroll-container'>
                        <div ref={loader} />
                        <ClipLoader color='aqua' loading={isLoading} />
                        {children}
                    </ScrollToBottom>
                </CardBody>
                <CardFooter>
                    <Input placeholder='Enter message' value={text} onChange={setText} className='w-100' />
                    <Input type='submit' hidden className='btn btn-block btn-primary' value="Send" />
                </CardFooter>
            </Form>
        </Card>
    )
};
