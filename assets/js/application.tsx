import "../css/application.scss";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from "./pages/home";
import { NotFoundPage } from "./pages/404";
import { LoginPage } from "./pages/login";
import { SignUpPage } from "./pages/signup";
import { ChatroomsPage } from "./pages/chatrooms";
import { InternalErrorPage } from "./pages/500";
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const getCookie = (name: string): string => {
	let value = `; ${document.cookie}`;
	let parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
    return "";
}

const RequireAuth: React.FC<any> = ({ children }) => {
    const jwt = getCookie("jwt");
  
    return jwt !== ''
      ? children
      : <Navigate to="/login" replace />;
}

const App = () => {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
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
                    <Route path="/internal_server_error" element={<InternalErrorPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </BrowserRouter>
            <ReactQueryDevtools />
        </QueryClientProvider>
    )
}

ReactDOM.render(<App />, document.getElementById('app'));
