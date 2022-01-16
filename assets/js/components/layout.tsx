import * as React from 'react';
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/logout';

type LayoutProps = {
    className?: string;
}

type HeaderProps = {
    hasAuth?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, ...reset }) => {
    return (
        <div {...reset} className='main-container'>
            {children}
        </div>
    )
};

export const Header: React.FC<HeaderProps> = ({ hasAuth }) => {
    const logout = useLogout();
    const onLogout: React.MouseEventHandler<HTMLAnchorElement> = e => {
        e.preventDefault();
        logout.mutate();
    };

    return (
        <header>
            {hasAuth && (
                <div className='header-left'>
                    <Link to='/dashboard'>Home</Link>
                    <Link to='/blogs'>Blogs</Link>
                    <Link to='/chatrooms'>Chatroom</Link>
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
                    <a href="#" onClick={onLogout}>Logout</a>
                </div>
            )}
        </header>
    )
};
