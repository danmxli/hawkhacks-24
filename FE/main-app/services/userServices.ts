import authFetch from "@/utils/authFetch";

export const loginUserWithGoogle = async () => {
    try {
        const response = await authFetch('auth/google', {
            method: 'POST',
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error:', error);
    }
}

export const getUserInfo = async () => {
    try {
        const response = await authFetch('users/', {
            method: 'GET',
        });

        const result = await response.json();
        console.log(result)
        return result;
    } catch (error) {
        console.error('Error:', error);
    }
}
