import Navbar from "../components/Navbar";
import { Link, Outlet } from "react-router-dom";

const tabs = [
  { label: "Manage Users", href: "/admin/users" },
  { label: "Manage Scholarships", href: "/admin/scholarship" },
  { label: "Manage Applications", href: "/admin/applications" },
  { label: "View Analytics", href: "/admin/analytics" },
];

function TabBar({ children }) {
  return (
    <div className="p-6 pt-24">
      {/* Tabs Navigation */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full p-2 flex items-center justify-between gap-2 mb-6">
        {tabs.map((tab) => {
          const isActive = false;
          return (
            <Link
              key={tab.href}
              to={tab.href}
              className={`flex-1 text-center py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white border-2 border-white"
                  : "bg-white text-blue-600 border-2 border-blue-600"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        {children}
      </div>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <TabBar>
        <Outlet />
      </TabBar>
    </div>
  );
}
