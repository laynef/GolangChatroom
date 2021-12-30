import "../css/application.scss";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from "./pages/home";
import { NotFoundPage } from "./pages/404";
import { LoginPage } from "./pages/login";
import { SignUpPage } from "./pages/signup";
import { ChatroomsPage } from "./pages/chatrooms";
import { InternalErrorPage } from "./pages/500";
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ChatroomPage } from "./pages/chatroom";
import { RequireAuth } from "./utils/auth";
import { IoProvider } from 'socket.io-react-hook';


const App = () => {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <IoProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route path="/chatrooms" element={
                            <RequireAuth>
                                <ChatroomsPage />
                            </RequireAuth>
                        } />
                        <Route path="/chatrooms/:id" element={
                            <RequireAuth>
                                <ChatroomPage />
                            </RequireAuth>
                        } />
                        <Route path="/internal_server_error" element={<InternalErrorPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </BrowserRouter>
                <ReactQueryDevtools />
            </IoProvider>
        </QueryClientProvider>
    )
}

ReactDOM.render(<App />, document.getElementById('app'));
