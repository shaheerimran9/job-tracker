import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

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
    };

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

    if (fetching) return <p className="text-gray-500 text-center py-16">Loading job...</p>;
    if (error) return <p className="text-red-600 text-center py-16">{error}</p>;
    if (!job) return <p className="text-gray-500 text-center py-16">No job found</p>;

    return (
        <div className="min-h-screen bg-gray-50 flex items-start justify-center py-12 px-4">
            <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-8 space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Company</label>
                        <input
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                            placeholder="Company Name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Role</label>
                        <input
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                            placeholder="Role / Position"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                            required
                        >
                            <option value="Applied">Applied</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Offer">Offer</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Additional Notes"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                            rows={4}
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 cursor-pointer"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Update Job Details'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobFormPage;