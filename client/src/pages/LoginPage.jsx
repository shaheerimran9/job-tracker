import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const { user, loading, error, login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (user) navigate('/dashboard');
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <div>
            <h2>Login Page</h2>
            <form onSubmit={handleSubmit}>
                <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type='password' placeholder='Email' value={password} onChange={(e) => setPassword(e.target.value)} />;
                <button type='submit' disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p>
                Don't have an account? <Link to='/register'>Register</Link>
            </p>
        </div>
    );
};

export default LoginPage;