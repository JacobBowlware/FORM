import axios from 'axios';

// Server URL
const SERVER_URL = process.env.REACT_APP_API_URL;

export const authUser = async () => {
    try {
        const response = await axios.get(`${SERVER_URL}/auth/user`, {
            withCredentials: true
        });
        return response.data;
    }
    catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}

// Attempt to refresh users token using their refresh cookie. Returns the new access token and user data if successful, or null if not.
export const refreshUserToken = async () => {
    try {
        const response = await axios.post(`${SERVER_URL}/auth/refresh`, null, {
            withCredentials: true
        });
        return response.data;
    }
    catch (error) {
        console.error('Error refreshing token:', error);
        return null;
     }
}