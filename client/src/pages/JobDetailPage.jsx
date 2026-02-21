import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const JobDetailPage = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [job, setJob] = useState(null);

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

    useEffect(() => {
        fetchJob();
    }, []);

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
        </>
    );
}

export default JobDetailPage;