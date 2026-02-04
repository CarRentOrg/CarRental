import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios, { AxiosInstance } from 'axios';

import { User } from '@/types';

interface AppContextType {
    showLogin: boolean;
    setShowLogin: (show: boolean) => void;
    user: User | null;
    setUser: (user: User | null) => void;
    token: string | null;
    setToken: (token: string | null) => void;
    isOwner: boolean;
    setIsOwner: (isOwner: boolean) => void;
    logout: () => void;
    axios: AxiosInstance;
    navigate: (path: string) => void;
    isLoading: boolean;
}

import { api } from '@/lib/api';

const AuthContext = createContext<AppContextType | undefined>(undefined);

const apiAxios = axios.create({
    baseURL: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace('/api', ''),
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [showLogin, setShowLogin] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isOwner, setIsOwner] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
        } else {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    setIsLoading(true);
                    // Update axios headers (if still using axios elsewhere)
                    apiAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    localStorage.setItem('token', token);

                    // Fetch user data using our new api utility
                    const userData = await api.auth.getMe();
                    if (userData && userData.user) {
                        setUser(userData.user);
                        setIsOwner(userData.user.role === 'owner' || userData.user.role === 'admin');
                    }
                } catch (error) {
                    console.error("Failed to load user", error);
                    logout();
                } finally {
                    setIsLoading(false);
                }
            } else {
                delete apiAxios.defaults.headers.common['Authorization'];
                localStorage.removeItem('token');
                setUser(null);
                setIsOwner(false);
                setIsLoading(false);
            }
        };

        if (token || !localStorage.getItem('token')) {
            loadUser();
        }
    }, [token]);

    const logout = () => {
        setToken(null);
        setUser(null);
        setIsOwner(false);
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    const navigate = (path: string) => {
        window.location.href = path; // Simple navigation as fallback
    };

    return (
        <AuthContext.Provider
            value={{
                showLogin,
                setShowLogin,
                user,
                setUser,
                token,
                setToken,
                isOwner,
                setIsOwner,
                logout,
                axios: apiAxios,
                navigate,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
