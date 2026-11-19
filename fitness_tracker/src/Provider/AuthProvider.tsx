import axios from "axios";
import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";
import type { User } from "../Models/User";


interface RefreshResponse {
    accessToken: string;
    user: User;
}

interface AuthContextType {
    status: 'loading' | 'authenticated' | 'unauthenticated';
    accessToken: string | null;
    user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }  

    return context;
}

// Owns the session state and provides it to the rest of the app
export const AuthProvider = ({children} : {children: React.ReactNode}) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

    useEffect(() => {
        // Restore the session from the refresh cookie on app startup.
        const restoreSession = async () => {
            
            // TODO: Implement conditional logic here so we don't refresh token if we already have one?
            try {
                const response = await axios.post<RefreshResponse>('/auth/refresh', null, {
                    withCredentials: true
                });
                setToken(response.data.accessToken);
                setUser(response.data.user);
                setStatus('authenticated');
            }
            catch {
                setToken(null);
                setUser(null);
                setStatus('unauthenticated');
            }
        };

        void restoreSession();
    }, []);

    // Return child component with our status, token and user fields
    return (
        <AuthContext.Provider value={{ status, accessToken: token, user }}>
            {children}
        </AuthContext.Provider>
    )
}