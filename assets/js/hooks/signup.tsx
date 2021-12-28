import * as React from 'react';
import { QueryClient, useMutation } from 'react-query';

type RequestBody = {
    email: string;
    username: string;
    password: string;
    password_confirmation: string;
}

type ErrorResponse = {
    message: string;
    code: number;
}

export const useSignUp = (queryClient: QueryClient) => useMutation((body: RequestBody) => {
    return fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    })
    .then(res => res.json())
    .catch((err: ErrorResponse) => err)
}, {
    onError: (error: ErrorResponse) => {
        console.error(error);
    },
    onSuccess: (data) => {
        queryClient.setQueryData('auth', data);
        window.location.href = '/dashboard';
    },
});
