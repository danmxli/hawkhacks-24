async function authFetch(endpoint: string, options?: any): Promise<Response> {

    const headers = {
        'Content-Type': 'application/json',
    };

    const fetchOptions: RequestInit = {
        credentials: 'include',
        ...options,
        headers: {
            ...options?.headers,
            ...headers,
        },
    };

    const response = await fetch(`http://localhost:3000/${endpoint}`, fetchOptions);

    if (!response.ok) {
        throw new Error(`${fetchOptions.method} to ${endpoint} Request failed`);
    }

    return response;
}

export default authFetch;