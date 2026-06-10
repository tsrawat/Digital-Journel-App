import React, { createContext, useState, useEffect } from 'react';
import API from '../api';

// 1. Context Create karne
export const AuthContext = createContext();

// 2. Provider Component banvane
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Website refresh jhalyavar check karne ki user adhi pasun login ahe ka
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // LOGIN FUNCTION
    const loginUser = async (email, password) => {
        try {
            const res = await API.post('/auth/login', { email, password });
            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                setUser(res.data.user);
                return { success: true };
            }
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || "Login failed!" 
            };
        }
    };

    // SIGNUP FUNCTION (FIXED LOGIC)
    const signupUser = async (name, email, password) => {
        try {
            const res = await API.post('/auth/signup', { name, email, password });
            if (res.data.success) {
                // 1. Token save karne
                localStorage.setItem('token', res.data.token);
                
                // 2. User cha data object banvun save karne
                const newUser = { name, email };
                localStorage.setItem('user', JSON.stringify(newUser));
                
                // 3. Global state update karne
                setUser(newUser);
                return { success: true };
            }
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || "Signup failed!" 
            };
        }
    };

    // LOGOUT FUNCTION
    const logoutUser = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, signupUser, logoutUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};