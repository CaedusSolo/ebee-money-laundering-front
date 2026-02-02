export default function UserCard({ userId, name, email, accountType }) {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      {/* Left section with blue accent bar */}
      <div className="flex items-start gap-3">
        <div className="w-1 h-16 bg-blue-600 rounded-full" />
        <div>
          <h3 className="font-bold text-foreground">{userId}</h3>
          <p className="text-sm text-muted-foreground">Name: {name}</p>
          <p className="text-sm text-muted-foreground">Email: {email}</p>
        </div>
      </div>

      {/* Right section with actions */}
      <div className="flex items-center gap-4">
        {/* View button */}
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <img src="/icons/eye.png" alt="View" className="w-5 h-5" />
        </button>

        {/* Edit button */}
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          Edit
        </button>

        {/* Delete button */}
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          Delete
        </button>

        {/* Account Type */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            {accountType}
          </span>
        </div>
      </div>
    </div>
  );
}
