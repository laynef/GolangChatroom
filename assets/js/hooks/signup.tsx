import * as React from 'react';
import { useMutation } from 'react-query';

type RequestBody = {
    email: string;
    username: string;
    password: string;
    password_confirmation: string;
}

export const useSignUp = () => useMutation(async (body: RequestBody) => {
    const res = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });
    return res.json();
}, {
    onSuccess: () => { window.location.href = "/dashboard" },
});
