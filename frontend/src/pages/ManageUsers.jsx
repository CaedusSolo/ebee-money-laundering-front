import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import UserCard from "../components/UserCard";
import UserService from "../services/UserService";
import { useAuth } from "../context/AuthContext";

import File from "../assets/file-text.svg";

export default function ManageUsers() {
  const { currentUser } = useAuth();
  const userService = new UserService(currentUser?.token);
  const [userData, setUserData] = useState([]);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await userService.getAllUsers();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const filteredUsers = userData.filter((user) => {
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <img src={File} alt="List" className="w-6 h-6" />
            <h1 className="text-xl font-bold text-foreground">
              List of Accounts
            </h1>
          </div>
          <Link
            className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-fit"
            to="/admin/users/edit"
          >
            Add New User
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name..."
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ALL">All Roles</option>
            <option value="STUDENT">Students</option>
            <option value="COMMITTEE">Committee</option>
            <option value="REVIEWER">Reviewer</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>

      {/* User List */}
      <div className="flex flex-col gap-4">
        {filteredUsers.map((user) => (
          <UserCard user={user} key={user.id} />
        ))}
      </div>
    </div>
  );
}
