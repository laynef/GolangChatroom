import * as React from 'react';
import { QueryClient, useMutation } from 'react-query';

type RequestBody = {
    email: string;
    password: string;
}

type ErrorResponse = {
    message: string;
    code: number;
}

export const useLogin = (queryClient: QueryClient) => useMutation((body: RequestBody) => {
    return fetch('/api/v1/auth/login', {
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
        console.log(data)
        queryClient.setQueryData('auth', data);
        window.location.href = '/dashboard';
    },
});
