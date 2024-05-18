export const loginUserWithGoogle = async () => {
    try {
        const response = await fetch('http://localhost:3000/auth/google', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error:', error);
    }
}

export const getUserInfo = async () => {
    try {
        const response = await fetch('http://localhost:3000/users/', {
            method: 'GET',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result)
        return result;
    } catch (error) {
        console.error('Error:', error);
    }
}