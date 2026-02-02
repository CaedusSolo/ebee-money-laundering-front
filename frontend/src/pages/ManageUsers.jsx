import UserCard from "../components/UserCard";
import { Link } from "react-router-dom";

import File from "../assets/file-text.svg";

const users = [
  {
    userId: "USER_ID1",
    name: "FIRSTNAME LASTNAME",
    email: "email@fyj.edu.my",
    accountType: "STUDENT",
  },
  {
    userId: "USER_ID2",
    name: "FIRSTNAME LASTNAME",
    email: "email@fyj.edu.my",
    accountType: "STUDENT",
  },
  {
    userId: "USER_ID3",
    name: "FIRSTNAME LASTNAME",
    email: "email@fyj.edu.my",
    accountType: "STUDENT",
  },
];

export default function ManageUsers() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img src={File} alt="List" className="w-6 h-6" />
          <h1 className="text-xl font-bold text-foreground">
            List of Accounts
          </h1>
        </div>
        <Link
          className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          to="/admin/users/create"
        >
          Add New User
        </Link>
      </div>

      {/* User List */}
      <div className="flex flex-col gap-4">
        {users.map((user) => (
          <UserCard
            key={user.userId}
            userId={user.userId}
            name={user.name}
            email={user.email}
            accountType={user.accountType}
          />
        ))}
      </div>
    </div>
  );
}
