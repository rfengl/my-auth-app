import { callSignIn, callSignUp, getProfile, UserData } from '@/hooks/use-oauth-api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    user: UserData;
    isLoading: boolean;
    login: (loginID: string, password: string, callback: (error?: string) => void) => void;
    logout: () => void;
    signup: (userData: any, callback: (error?: string) => void) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<any>(null);
    // 1. Load user from storage on app startup
    useEffect(() => {
        setIsLoading(true)
        getProfile()
            .then(({ user }) => {
                setUser(user)
                setIsLoading(false)
            })
    }, []);

    // 2. Persist user on Login
    const login = useCallback(async (loginID: string, password: string, callback: (error?: string) => void) => {
        callSignIn(loginID, password)
            .then(async ({ isSuccess, token, error }: any) => {
                if (isSuccess) {
                    await AsyncStorage.setItem('user_token', token)
                    getProfile()
                        .then(({ user }) => {
                            setUser(user)
                            callback()
                        })
                } else {
                    callback(error)
                }
            })
    }, []);

    // 3. Persist user on Signup (same logic as login)
    const signup = useCallback(async (newUserData: any, callback: (error?: string) => void) => {
        callSignUp(newUserData)
            .then(({ isSuccess, error }: any) => {
                if (isSuccess)
                    callback()
                else
                    callback(error)
            })
    }, []);

    // 4. Remove user on Logout
    const logout = useCallback(async () => {
        await AsyncStorage.removeItem('user_token');
        getProfile()
            .then(({ user }) => {
                setUser(user)
            })
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, signup }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};