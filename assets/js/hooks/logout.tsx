import * as React from 'react';
import { useMutation } from 'react-query';

export const useLogout = () => useMutation(async () => {
    await fetch('/api/v1/auth/logout', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    window.location.href = "/";
});
