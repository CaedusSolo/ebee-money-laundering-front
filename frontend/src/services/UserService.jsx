import axios from "axios";

class UserService {
  constructor(
    jwtToken,
    baseUrl = `${import.meta.env.VITE_API_BASE_URL}/api/users`,
  ) {
    this.api = axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
    });
  }

  async getAllUsers() {
    const response = await this.api.get("");
    return response.data;
  }

  async createUser(userData) {
    const response = await this.api.post("", userData);
    return response.data;
  }

  async updateUser(userId, userData) {
    const response = await this.api.put(`/${userId}`, userData);
    return response.data;
  }

  async deleteUser(userId) {
    const response = await this.api.delete(`/${userId}`);
    return response.data;
  }
}

export default UserService;
