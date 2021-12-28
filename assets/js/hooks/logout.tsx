import * as React from 'react';
import { useMutation } from 'react-query';

export const useLogout = () => useMutation(async () => {
    const res = await fetch('/api/v1/auth/logout', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    return res.json();
}, {
    onSuccess: () => { window.location.href = "/" },
});
