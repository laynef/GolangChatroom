import "../css/application.scss";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const HomePage = () => <h1>Hello World!</h1>;
const NotFoundPage = () => <h1>404: Not Found!</h1>;

const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </BrowserRouter>
)

ReactDOM.render(<App />, document.getElementById('app'));
