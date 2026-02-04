import { Link } from "react-router-dom";
import Eye from "../assets/eye.svg";

export default function ApplicationCard({
  user: { applicationID: id, name, createdAt, submittedAt, status },
}) {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      {/* Left section with blue accent bar */}
      <div className="flex items-start gap-3">
        <div className="w-1 h-16 bg-blue-600 rounded-full" />
        <div>
          <p className="text-base font-bold text-muted-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">
            <strong>Created at:</strong> {createdAt}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Submitted at:</strong> {submittedAt}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Status:</strong> {status}
          </p>
        </div>
      </div>

      {/* Right section with actions */}
      <div className="flex items-center gap-4">
        {/* View button */}
        <Link
          className="block p-2 hover:bg-gray-100 rounded-full transition-colors"
          to={`/admin/applications/${id}`}
        >
          <img src={Eye} alt="View" className="w-5 h-5" />
        </Link>
        {/* Delete button */}
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          Delete
        </button>
      </div>
    </div>
  );
}
