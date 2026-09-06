import ApplicationCard from "./ApplicationCard.jsx";
import SkeletonCard from "./SkeletonCard.jsx";

const EMPTY_COPY = {
  applied: "No applications yet. Add one to get started.",
  interview: "Nothing in interview stage yet.",
  offer: "No offers yet — keep going.",
  rejected: "No rejections here.",
};

const BoardColumn = ({ status, label, applications, loading, onStatusChange, onCardClick }) => {
  return (
    <div className="bg-slate-100 rounded-lg p-3 flex flex-col min-h-[200px]">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">{label}</h2>
        <span className="text-xs font-medium bg-white text-slate-500 rounded-full px-2 py-0.5">
          {loading ? "–" : applications.length}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : applications.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6 px-2">{EMPTY_COPY[status]}</p>
        ) : (
          applications.map((app) => (
            <ApplicationCard
              key={app._id}
              application={app}
              onStatusChange={onStatusChange}
              onClick={() => onCardClick(app)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default BoardColumn;
