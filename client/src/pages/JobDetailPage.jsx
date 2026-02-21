import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

const JobDetailPage = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [job, setJob] = useState(null);

    const navigate = useNavigate();

    const fetchJob = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get(`/jobs/${id}`);
            setJob(response.data.job);
        } catch (err) {
            setError(err.response?.data?.message || `Failed to fetch job with id: ${id}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this job?');
        if (!confirmDelete) return;

        try {
            await api.delete(`/jobs/${id}`);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete job');
        }
    };

    const handleEdit = () => {
        navigate(`/jobs/${id}/edit`)
    }

    useEffect(() => {
        fetchJob();
    }, [id]);

    if (loading) return <p>Loading...</p>
    if (error) return <p style={{ color: 'red' }}>{error}</p>
    if (!job) return <p>No job found</p>

    return (
        <>
            <h2>Job Detail Page</h2>
            <p>Company: {job.company}</p>
            <p>Role: {job.role}</p>
            <p>Status: {job.status}</p>
            <p>Date Applied: {new Date(job.dateApplied).toLocaleDateString()}</p>
            <p>Notes: {job.notes || 'No notes'}</p>
            <button onClick={handleEdit} style={{ background: 'blue', color: 'white', cursor: 'pointer' }}>Edit Job Details</button>
            <button onClick={handleDelete} style={{ background: 'red', color: 'white', cursor: 'pointer' }}>Delete Job</button>
        </>
    );
}

export default JobDetailPage;