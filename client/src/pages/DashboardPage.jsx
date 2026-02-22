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
  const [filter, setFilter] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/jobs");
      setJobs(response.data.jobs);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
      : "-";

  const summary = jobs.reduce((acc, job) => {
    const key = job.status;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const statusConfig = {
    Applied: {
      gradient: "from-yellow-700 to-yellow-500",
      icon: "📄",
      badge: "bg-yellow-100 text-yellow-800",
    },
    Interviewing: {
      gradient: "from-blue-700 to-blue-500",
      icon: "⏱️",
      badge: "bg-blue-100 text-blue-800",
    },
    Offer: {
      gradient: "from-green-700 to-green-500",
      icon: "✅",
      badge: "bg-green-100 text-green-800",
    },
    Rejected: {
      gradient: "from-red-700 to-red-500",
      icon: "❌",
      badge: "bg-red-100 text-red-800",
    },
  };

  const displayedJobs = filter ? jobs.filter((job) => job.status === filter) : jobs;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">

      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome, <span className="font-medium">{user.name}</span>
          </p>
        </div>
        <button
          onClick={logout}
          className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-0.5 duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 cursor-pointer"
        >
          Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
        {["Applied", "Interviewing", "Offer", "Rejected"].map((status) => (
          <div
            key={status}
            onClick={() =>
              setFilter(filter === status ? null : status)
            }
            className={`rounded-xl p-6 flex flex-col justify-center shadow-lg transform transition cursor-pointer bg-gradient-to-br ${statusConfig[status].gradient} ${filter === status ? "ring-4 ring-white/40 scale-105" : "hover:scale-105 hover:opacity-90"
              }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">{statusConfig[status].icon}</span>
              <p className="text-sm font-medium text-white uppercase tracking-wide">
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </p>
            </div>
            <div className="mt-4">
              <p className="text-4xl font-bold text-white">{summary[status] || 0}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto flex justify-end mb-12">
        <button
          onClick={() => navigate("/jobs/create")}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 cursor-pointer"
        >
          + Add Job
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        {loading && <p className="text-gray-500 text-center py-8">Loading jobs...</p>}
        {error && <p className="text-red-600 text-center py-8">{error}</p>}
        {!loading && displayedJobs.length === 0 && (
          <p className="text-gray-500 text-center py-8">No jobs to show.</p>
        )}

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {displayedJobs.map((job) => (
            <div
              key={job._id}
              onClick={() => navigate(`/jobs/${job._id}`)}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1 cursor-pointer p-5 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{job.company}</h2>
                <p className="text-gray-600 mt-1">{job.role}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[job.status]?.badge || "bg-gray-100 text-gray-800"}`}
                >
                  {job.status}
                </span>
                <span className="text-gray-500 text-sm">
                  {formatDate(job.dateApplied)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;