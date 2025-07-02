"use client";

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import api from '../constants/api';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

interface IDecodedUser {
    sub: string;
    name: string; 
    role: 'admin' | 'manager' | 'employee';
}

interface AuthContextData {
    signed: boolean;
    user: IDecodedUser | null;
    loading: boolean;
    signIn(credentials: any): Promise<{ firstAccess: boolean; role: string; }>;
    signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<IDecodedUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get('auth_token');
        if (token) {
            try {
                api.defaults.headers.Authorization = `Bearer ${token}`;
                const decodedUser = jwtDecode<IDecodedUser>(token);
                setUser(decodedUser);
            } catch (error) {
                console.error("Token inválido no cookie, limpando:", error);
                signOut();
            }
        }
        setLoading(false);
    }, []);

    async function signIn(credentials: any): Promise<{ firstAccess: boolean; role: string; }> {
        try {
            const response = await api.post('/auth/login', credentials);
            const { token: newToken, firstAccess } = response.data;
            
            const decodedUser = jwtDecode<IDecodedUser>(newToken);
            
            api.defaults.headers.Authorization = `Bearer ${newToken}`;
            Cookies.set('auth_token', newToken, { expires: 1/3, path: '/' });
            localStorage.setItem("role", decodedUser.role);
            localStorage.setItem("Token", newToken)
            
            setUser(decodedUser);

            return { firstAccess, role: decodedUser.role };

        } catch (error) {
            console.error("Falha no login", error);
            throw error;
        }
    }

    function signOut() {
        setUser(null);
        Cookies.remove('auth_token');
        localStorage.clear();
        delete api.defaults.headers.Authorization;
    }

    return (
        // 3. O 'user' completo agora está disponível para toda a aplicação
        <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    return context;
}