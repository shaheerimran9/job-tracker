import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CreateJobPage = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('Applied');
    const [notes, setNotes] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await api.post('/jobs', { company, role, status, notes });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h1>Create Job Page</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type='text' value={company} placeholder='Company' onChange={(e) => setCompany(e.target.value)} required disabled={loading} />
                <input type='text' value={role} placeholder='Role' onChange={(e) => setRole(e.target.value)} required disabled={loading} />
                <select value={status} placeholder='Status' onChange={(e) => setStatus(e.target.value)} disabled={loading}>
                    <option value='Applied'>Applied</option>
                    <option value='Interviewing'>Interviewing</option>
                    <option value='Offer'>Offer</option>
                    <option value='Rejected'>Rejected</option>
                </select>
                <input type='text' value={notes} placeholder="Notes" onChange={(e) => setNotes(e.target.value)} disabled={loading} />
                <button type='submit' style={{ background: 'green', color: 'white', cursor: 'pointer' }}>
                    {loading ? 'Adding job...' : 'Create job'}
                </button>
            </form>
        </>
    );
}

export default CreateJobPage;