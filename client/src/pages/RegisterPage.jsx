import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const { user, loading, error, register } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (user) navigate('/dashboard');
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await register(name, email, password);
    };

    return (
        <div>
            <h2>Register Page</h2>
            <form onSubmit={handleSubmit}>
                <input type='text' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
                <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type='submit' disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p>
                Already have an account? <Link to='/login'>Login</Link>
            </p>
        </div>
    );
};

export default RegisterPage;