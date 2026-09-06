const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm animate-pulse">
      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-slate-200 rounded w-1/2 mb-3" />
      <div className="h-3 bg-slate-100 rounded w-2/5 mb-1" />
      <div className="h-3 bg-slate-100 rounded w-1/3 mb-3" />
      <div className="h-8 bg-slate-100 rounded" />
    </div>
  );
};

export default SkeletonCard;
