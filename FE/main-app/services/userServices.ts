import authFetch from '../utils/authFetch';

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

export const logoutUser = async () => {
    try {
        await authFetch('auth/logout', {
            method: 'GET',
        });
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

export const getEmailPdf = async (fileName: string) => {
    try {
        const response = await authFetch(`emails/get-email-pdf/${fileName}`);
        return response
    } catch (error) {
        console.error('Error:', error);
    }
}

export const syncUserEmail = async () => {
    try {
        const response = await authFetch('users/sync-email');
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error:', error);
    }
}

export const sendEmail = async (fileName: string) => {
    try {
        const response = await authFetch(`emails/send-email/${fileName}`);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error:', error);
    }
}

export const exportToCSV = async () => {
    try {
        const response = await authFetch('emails/export-to-csv');
        return response;
    } catch (error) {
        console.error('Error:', error);
    }
}
