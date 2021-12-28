import * as React from 'react';
import { Link } from 'react-router-dom';

type LayoutProps = {
}

type HeaderProps = {
    hasAuth?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className='container'>
            {children}
        </div>
    )
};

export const Header: React.FC<HeaderProps> = ({ hasAuth }) => {
    return (
        <header>
            {hasAuth && (
                <div className='header-left'>
                    <Link to='/dashboard'>Home</Link>
                </div>
            )}
            {!hasAuth && (
                <div className='header-left'>
                    <Link to='/'>Home</Link>
                </div>
            )}
            {!hasAuth && (
                <div className='header-right'>
                    <Link to='/login'>Login</Link>
                    <Link to='/signup'>Sign Up</Link>
                </div>
            )}
            {hasAuth && (
                <div className='header-right'>
                    <Link to='/'>Logout</Link>
                </div>
            )}
        </header>
    )
};
