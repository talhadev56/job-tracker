import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <p className=" font-semibold text-slate-400 mb-6">404  This page doesn't exist.</p>
      <Link to="/" className="text-slate-900 font-medium hover:underline">
        Go home
      </Link>
    </div>
  );
};

export default NotFound;
