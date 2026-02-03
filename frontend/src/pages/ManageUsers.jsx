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
          to="/admin/users/edit"
        >
          Add New User
        </Link>
      </div>

      {/* User List */}
      <div className="flex flex-col gap-4">
        {userData.map((user) => (
          <UserCard user={user} key={user.id} />
        ))}
      </div>
    </div>
  );
}
