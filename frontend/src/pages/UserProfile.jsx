import Eye from "../assets/eye.svg";
import File from "../assets/file-text.svg";

function ApplicationCard({ title, status, submittedDate }) {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-start gap-3">
        <div className="w-1 h-12 bg-blue-600 rounded-full" />
        <div>
          <h4 className="font-bold text-foreground">{title}</h4>
          <p className="text-sm text-muted-foreground">Status: {status}</p>
          <p className="text-sm text-muted-foreground">
            Submitted: {submittedDate}
          </p>
        </div>
      </div>
      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
        <img src={Eye} alt="View" className="w-5 h-5" />
      </button>
    </div>
  );
}

export default function UserProfile() {
  const user = {
    username: "IZZMINHAL",
    role: "Student",
    email: "jimin@student.fyj.edu.my",
    fullName: "Izzminhal Akmal Bin Norhisyam",
    id: "242UC240JF",
    password: "••••••••••",
    title: "Student",
    avatar: "/images/avatar.jpg",
  };

  const applications = [
    {
      title: "Merit's Scholarship",
      status: "Under Review",
      submittedDate: "DD/MM/YYYY",
    },
    {
      title: "President's Scholarship",
      status: "Accepted",
      submittedDate: "DD/MM/YYYY",
    },
    {
      title: "High Achiever's Scholarship",
      status: "Submitted",
      submittedDate: "DD/MM/YYYY",
    },
  ];

  return (
    <div className="space-y-6">
      {/* User Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
            <img
              src={user.avatar || "/placeholder.svg"}
              alt={user.username}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {user.username}
            </h2>
            <p className="text-sm text-muted-foreground">{user.role}</p>
            <p className="text-sm text-blue-600">{user.email}</p>
          </div>
        </div>
        <button className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
          Edit
        </button>
      </div>

      {/* User Details Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-foreground w-1/3">
                Full Name
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {user.fullName}
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-foreground">
                ID
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {user.id}
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-foreground">
                Email
              </td>
              <td className="px-4 py-3 text-sm text-blue-600">{user.email}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-foreground">
                Password
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {user.password}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-foreground">
                Title
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {user.title}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Application Status Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <img src={File} alt="Applications" className="w-5 h-5" />
          <h3 className="text-lg font-bold text-foreground">
            Application Status
          </h3>
        </div>
        <div className="space-y-3">
          {applications.map((app) => (
            <ApplicationCard
              key={app.title}
              title={app.title}
              status={app.status}
              submittedDate={app.submittedDate}
            />
          ))}
        </div>
      </div>

      {/* Delete Account Button */}
      <div className="flex justify-end">
        <button className="border-2 border-red-500 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );
}
