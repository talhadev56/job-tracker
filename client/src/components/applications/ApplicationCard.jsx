import { STATUSES } from "./statuses.js";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const ApplicationCard = ({ application, onStatusChange, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm cursor-pointer hover:border-slate-300 hover:shadow transition"
    >
      <h3 className="font-medium text-slate-900 truncate">{application.company}</h3>
      <p className="text-sm text-slate-600 truncate">{application.role}</p>

      <div className="mt-2 text-xs text-slate-400 space-y-0.5">
        <p>{formatDate(application.dateApplied)}</p>
        {application.location && <p className="truncate">{application.location}</p>}
      </div>

      <select
        value={application.status}
        onChange={(e) => onStatusChange(application._id, e.target.value)}
        onClick={(e) => e.stopPropagation()}
        className="mt-3 w-full text-sm border border-slate-300 rounded px-2 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900"
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ApplicationCard;
