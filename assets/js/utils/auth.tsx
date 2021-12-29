import * as React from 'react';
import { Navigate } from 'react-router-dom';


export const getCookie = (name: string): string => {
	let value = `; ${document.cookie}`;
	let parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
    return "";
}

export const RequireAuth: React.FC<any> = ({ children }) => {
    const jwt = getCookie("jwt");
  
    return jwt !== ''
      ? children
      : <Navigate to="/login" replace />;
}