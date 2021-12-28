import "../css/application.scss";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from "./pages/home";
import { NotFoundPage } from "./pages/404";
import { LoginPage } from "./pages/login";
import { SignUpPage } from "./pages/signup";
import { DashboardPage } from "./pages/dashboard";
import { InternalErrorPage } from "./pages/500";
import { QueryClient, QueryClientProvider } from 'react-query'
 
const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/internal_server_error" element={<InternalErrorPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    </QueryClientProvider>
)

ReactDOM.render(<App />, document.getElementById('app'));
