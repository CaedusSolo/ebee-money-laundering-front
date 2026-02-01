const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth/`;

const login = async (email, password) => {
  const response = await fetch(API_URL + "login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (response.ok) {
    if (data.token) {
      localStorage.setItem("user", JSON.stringify(data));
    }
    return data;
  } else {
    throw new Error(data.error || "Login failed");
  }
};

const logout = () => {
  localStorage.removeItem("user");
};

const registerStudent = async (studentData) => {
  const response = await fetch(API_URL + "register/student", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(studentData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Registration failed");
  }
  return data;
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const getAuthHeader = () => {
  const user = getCurrentUser();
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
};

export default {
  login,
  logout,
  registerStudent,
  getCurrentUser,
  getAuthHeader
};
