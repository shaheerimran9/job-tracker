import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from '../api/axios';

const JobFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [fetching, setFetching] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [job, setJob] = useState(null);

    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('');
    const [notes, setNotes] = useState('');

    const fetchJob = async () => {
        setFetching(true);
        setError(null);

        try {
            const response = await api.get(`/jobs/${id}`);
            setJob(response.data.job);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch job');
        } finally {
            setFetching(false);
        }
    }

    useEffect(() => {
        if (!id) {
            navigate('/dashboard', { replace: true });
            return;
        }

        fetchJob();
    }, [id, navigate]);

    useEffect(() => {
        if (job) {
            setCompany(job.company);
            setRole(job.role);
            setStatus(job.status);
            setNotes(job.notes);
        }
    }, [job]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await api.patch(`/jobs/${id}`, { company, role, status, notes });
            navigate(`/jobs/${id}`, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update job');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <p>Loading job...</p>
    if (error) return <p style={{ color: 'red' }}>{error}</p>
    if (!job) return <p>No job found</p>


    return (
        <>
            <h1>Job Form Page</h1>
            <form onSubmit={handleSubmit}>
                <input type='text' value={company} onChange={(e) => setCompany(e.target.value)} />
                <input type='text' value={role} onChange={(e) => setRole(e.target.value)} />
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value='Applied'>Applied</option>
                    <option value='Interviewing'>Interviewing</option>
                    <option value='Offer'>Offer</option>
                    <option value='Rejected'>Rejected</option>
                </select>
                <input type='text' value={notes} placeholder="Notes" onChange={(e) => setNotes(e.target.value)} />
                <button type='submit' style={{ background: 'blue', color: 'white', cursor: 'pointer' }}>
                    {loading ? 'Saving...' : 'Update Job Details'}
                </button>
            </form>
        </>
    );
}

export default JobFormPage;