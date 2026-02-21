import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [jobs, setJobs] = useState([]);

    const fetchJobs = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get('/jobs');
            setJobs(response.data.jobs);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch jobs');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchJobs();
    }, []);

    return (
        <>
            <h2>Dashboard</h2>
            <p>Welcome, {user.name}</p>
            <button onClick={logout}>Logout</button>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && jobs.length === 0 && <p>No jobs yet.</p>}
            <div>
                {jobs.map((job) => {
                    return (
                        <h1
                            key={job._id}
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate(`/jobs/${job._id}`)}
                        >
                            {job.company}
                        </h1>
                    )
                })}
            </div>
            <button onClick={() => navigate('/jobs/create')}>Add job</button>
        </>
    );
}

export default DashboardPage;