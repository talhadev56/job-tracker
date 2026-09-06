import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import {
  getApplicationsRequest,
  getStatsRequest,
  updateApplicationRequest,
} from "../api/applications.js";
import { STATUSES } from "../components/applications/statuses.js";
import BoardColumn from "../components/applications/BoardColumn.jsx";
import ApplicationModal from "../components/applications/ApplicationModal.jsx";
import StatCard from "../components/applications/StatCard.jsx";


const Dashboard = () => {
 
  const { user, logout } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [searchInput, setSearchInput] = useState(""); 
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [modalApplication, setModalApplication] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    const fetchApplications = async () => {
      try {
        const params = {};
        if (search) params.search = search;
        if (statusFilter) params.status = statusFilter;

        const { data } = await getApplicationsRequest(params);
        if (!ignore) setApplications(data);
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || "Couldn't load applications");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchApplications();
    return () => {
      ignore = true;
    };
  }, [search, statusFilter]);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const { data } = await getStatsRequest();
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't load stats");
    } finally {
      setStatsLoading(false);
    }
  };

  
  useEffect(() => {
    fetchStats();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    const previous = applications;
    setApplications((prev) =>
      prev.map((app) => (app._id === id ? { ...app, status: newStatus } : app))
    );

    try {
      await updateApplicationRequest(id, { status: newStatus });
      fetchStats();
    } catch (err) {
      setApplications(previous);
      setError(err.response?.data?.message || "Couldn't update status");
    }
  };

  const openCreateModal = () => {
    setModalApplication(null);
    setModalOpen(true);
  };

  const openEditModal = (application) => {
    setModalApplication(application);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalApplication(null);
  };

  const handleSaved = (savedApplication) => {
    setApplications((prev) => {
      const exists = prev.some((app) => app._id === savedApplication._id);
      return exists
        ? prev.map((app) => (app._id === savedApplication._id ? savedApplication : app))
        : [savedApplication, ...prev];
    });
    fetchStats();
    closeModal();
  };

  const handleDeleted = (id) => {
    setApplications((prev) => prev.filter((app) => app._id !== id));
    fetchStats();
    closeModal();
  };

  const escapeCsvField = (value) => {
    const str = value == null ? "" : String(value);
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };

  const handleExportCsv = () => {
    const headers = [
      "Company",
      "Role",
      "Status",
      "Date Applied",
      "Location",
      "Salary",
      "Job Link",
      "Notes",
    ];

    const rows = applications.map((app) => [
      app.company,
      app.role,
      app.status,
      app.dateApplied ? new Date(app.dateApplied).toLocaleDateString("en-US") : "",
      app.location,
      app.salary,
      app.jobLink,
      app.notes,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsvField).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `applications-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome{user?.name ? `, ${user.name}` : ""}
        </h1>
        <div className="flex items-center gap-3">
          
          <button
            onClick={handleExportCsv}
            disabled={applications.length === 0}
            className="text-sm text-slate-600 hover:text-slate-900 border border-slate-300 rounded px-3 py-2 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export CSV
          </button>
          <button
            onClick={openCreateModal}
            className="text-sm bg-slate-900 text-white font-medium rounded px-4 py-2 hover:bg-slate-800"
          >
            Add Application
          </button>
          <button
            onClick={logout}
            className="text-sm text-slate-600 hover:text-slate-900 border border-slate-300 rounded px-3 py-1.5 bg-white"
          >
            Log out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total" value={stats?.total ?? 0} loading={statsLoading} />
        <StatCard label="Interviews" value={stats?.interview ?? 0} loading={statsLoading} />
        <StatCard label="Offers" value={stats?.offer ?? 0} loading={statsLoading} />
        <StatCard
          label="Response Rate"
          value={`${stats?.responseRate ?? 0}%`}
          loading={statsLoading}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search company or role..."
          className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex flex-col md:grid md:grid-cols-4 gap-4">
        {STATUSES.map(({ value, label }) => (
          <BoardColumn
            key={value}
            status={value}
            label={label}
            loading={loading}
            applications={applications.filter((app) => app.status === value)}
            onStatusChange={handleStatusChange}
            onCardClick={openEditModal}
          />
        ))}
      </div>

      {modalOpen && (
        <ApplicationModal
          application={modalApplication}
          onClose={closeModal}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
};

export default Dashboard;
