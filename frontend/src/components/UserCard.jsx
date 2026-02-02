import { Link } from "react-router-dom";
import Eye from "../assets/eye.svg";

export default function UserCard({ user: { id, name, email, role } }) {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      {/* Left section with blue accent bar */}
      <div className="flex items-start gap-3">
        <div className="w-1 h-16 bg-blue-600 rounded-full" />
        <div>
          <p className="text-base font-bold text-muted-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">
            <strong>Email:</strong> {email}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Role:</strong> {role}
          </p>
        </div>
      </div>

      {/* Right section with actions */}
      <div className="flex items-center gap-4">
        {/* View button */}
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <img src={Eye} alt="View" className="w-5 h-5" />
        </button>

        {/* Edit button */}
        <Link
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          to={`/admin/users/edit/${id}`}
        >
          Edit
        </Link>

        {/* Delete button */}
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          Delete
        </button>
      </div>
    </div>
  );
}
