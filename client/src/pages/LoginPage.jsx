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
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 text-center">Login</h2>

                {error && (
                    <p className="text-red-600 text-center">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                            required
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 cursor-pointer"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>
                <p className="text-center text-gray-600">
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;