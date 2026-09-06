const StatCard = ({ label, value, loading }) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">
        {loading ? (
          <span className="inline-block h-7 w-12 bg-slate-100 rounded animate-pulse" />
        ) : (
          value
        )}
      </p>
    </div>
  );
};

export default StatCard;
