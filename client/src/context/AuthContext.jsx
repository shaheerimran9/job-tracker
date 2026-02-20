import { useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const register = async (name, email, password) => {
        setLoading(true)
        setError(null);

        try {
            const response = await api.post('/auth/register', { name, email, password });
            setUser(response.data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/auth/login', { email, password });
            setUser(response.data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.log('Failed to logout.');
        } finally {
            setUser(null);
            navigate('/login');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);