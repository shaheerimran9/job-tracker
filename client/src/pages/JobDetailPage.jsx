import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

const JobDetailPage = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [job, setJob] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

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

    useEffect(() => {
        fetchJob();
    }, [id]);

    const handleDelete = async () => {
        try {
            await api.delete(`/jobs/${id}`);
            setShowDeleteModal(false);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete job');
        }
    };

    const handleEdit = () => {
        navigate(`/jobs/${id}/edit`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (loading) return <p className="text-gray-500 text-center py-16">Loading...</p>;
    if (error) return <p className="text-red-600 text-center py-16">{error}</p>;
    if (!job) return <p className="text-gray-500 text-center py-16">No job found</p>;

    return (
        <div className="min-h-screen bg-gray-50 flex items-start justify-center py-12 px-4">

            <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-8 space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">{job.company}</h2>

                <div className="space-y-2">
                    <p className="text-gray-700"><span className="font-medium">Role:</span> {job.role}</p>
                    <p className="text-gray-700">
                        <span className="font-medium">Status:</span> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-sm font-medium ${
                            job.status.toLowerCase() === "applied" ? "bg-yellow-100 text-yellow-800" :
                            job.status.toLowerCase() === "interviewing" ? "bg-blue-100 text-blue-800" :
                            job.status.toLowerCase() === "offer" ? "bg-green-100 text-green-800" :
                            job.status.toLowerCase() === "rejected" ? "bg-red-100 text-red-800" :
                            "bg-gray-100 text-gray-800"
                        }`}>
                            {job.status}
                        </span>
                    </p>
                    <p className="text-gray-700"><span className="font-medium">Date Applied:</span> {formatDate(job.dateApplied)}</p>
                    <p className="text-gray-700"><span className="font-medium">Notes:</span> {job.notes || "No notes"}</p>
                </div>

                <div className="flex flex-wrap gap-4 mt-6">
                    <button
                        onClick={handleEdit}
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 cursor-pointer"
                    >
                        Edit Job Details
                    </button>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 cursor-pointer"
                    >
                        Delete Job
                    </button>
                </div>
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 space-y-4">
                        <h3 className="text-xl font-bold text-gray-900">Confirm Deletion</h3>
                        <p className="text-gray-700">Are you sure you want to delete this job?</p>
                        <div className="flex justify-end gap-4 mt-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobDetailPage;