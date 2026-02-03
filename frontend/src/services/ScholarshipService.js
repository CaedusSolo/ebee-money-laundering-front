import axios from "axios";

/**
 * ScholarshipService
 *
 * Handles all scholarship-related API communication.
 * Automatically attaches the provided JWT token to every request
 * via an Axios instance scoped to the given base URL.
 */
class ScholarshipService {
  /**
   * @param {string} token   – A valid JWT bearer token.
   * @param {string} baseURL – The root URL of the scholarship API
   *                            (e.g. "https://api.example.com/scholarships").
   */
  constructor(
    token,
    baseURL = `${import.meta.env.VITE_API_BASE_URL}/api/scholarships`,
  ) {
    if (!token) {
      throw new Error("ScholarshipService requires a JWT token.");
    }
    if (!baseURL) {
      throw new Error("ScholarshipService requires a base URL.");
    }

    this.api = axios.create({
      baseURL: baseURL.replace(/\/+$/, ""), // strip trailing slashes
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // ── Response interceptor: normalise errors across the board ──
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        const message =
          error.response?.data?.message || error.message || "Unknown error";

        if (status === 401) {
          throw new Error("Unauthorised – token may be expired or invalid.");
        }
        if (status === 403) {
          throw new Error("Forbidden – insufficient permissions.");
        }
        if (status === 404) {
          throw new Error("Resource not found.");
        }

        throw new Error(message);
      },
    );
  }

  // ─────────────────────────────────────────────
  //  LIST & SEARCH
  // ─────────────────────────────────────────────

  /**
   * Retrieve a paginated list of scholarships.
   * @returns {Promise<object>}  { data, total, page, limit }
   */
  async getScholarships() {
    const { data } = await this.api.get("/");
    return data;
  }

  /**
   * Retrieve a single scholarship by its ID.
   * @param {string|number} id
   * @returns {Promise<object>}
   */
  async getScholarshipById(id) {
    if (!id) throw new Error("Scholarship ID is required.");
    const { data } = await this.api.get(`/${id}`);
    return data;
  }

  // ─────────────────────────────────────────────
  //  CREATE
  // ─────────────────────────────────────────────

  /**
   * Create a new scholarship.
   * @param {object} payload
   * @returns {Promise<object>}  The created scholarship object.
   */
  async createScholarship(payload) {
    const { data } = await this.api.post("/", payload);
    return data;
  }

  // ─────────────────────────────────────────────
  //  UPDATE
  // ─────────────────────────────────────────────

  /**
   * Fully replace a scholarship (PUT).
   * @param {string|number} id
   * @param {object}        payload – Complete scholarship object.
   * @returns {Promise<object>}
   */
  async updateScholarship(id, payload) {
    if (!id) throw new Error("Scholarship ID is required.");
    if (!payload || typeof payload !== "object") {
      throw new Error("Payload is required.");
    }

    const { data } = await this.api.put(`/${id}`, payload);
    return data;
  }

  // ─────────────────────────────────────────────
  //  DELETE
  // ─────────────────────────────────────────────

  /**
   * Delete a scholarship by ID.
   * @param {string|number} id
   * @returns {Promise<void>}
   */
  async deleteScholarship(id) {
    if (!id) throw new Error("Scholarship ID is required.");
    await this.api.delete(`/${id}`);
  }

  // ─────────────────────────────────────────────
  //  APPLICATIONS (nested resource)
  // ─────────────────────────────────────────────

  /**
   * List all applications for a given scholarship.
   * @param {string|number} scholarshipId
   * @param {object}  [params]
   * @param {number}  [params.page=1]
   * @param {number}  [params.limit=20]
   * @param {string}  [params.status]    – e.g. "pending" | "approved" | "rejected".
   * @returns {Promise<object>}
   */
  //   async getApplications(scholarshipId, { page = 1, limit = 20, status } = {}) {
  //     if (!scholarshipId) throw new Error("Scholarship ID is required.");
  //
  //     const params = { page, limit };
  //     if (status) params.status = status;
  //
  //     const { data } = await this.api.get(`/${scholarshipId}/applications`, {
  //       params,
  //     });
  //     return data;
  //   }
  //
  //   /**
  //    * Submit a new application for a scholarship.
  //    * @param {string|number} scholarshipId
  //    * @param {object}        payload
  //    * @param {string}        payload.applicantName
  //    * @param {string}        payload.email
  //    * @param {string}        [payload.essay]
  //    * @returns {Promise<object>}  The created application object.
  //    */
  //   async submitApplication(scholarshipId, { applicantName, email, essay } = {}) {
  //     if (!scholarshipId) throw new Error("Scholarship ID is required.");
  //     if (!applicantName) throw new Error("Applicant name is required.");
  //     if (!email) throw new Error("Email is required.");
  //
  //     const payload = { applicantName, email };
  //     if (essay) payload.essay = essay;
  //
  //     const { data } = await this.api.post(
  //       `/${scholarshipId}/applications`,
  //       payload,
  //     );
  //     return data;
  //   }
  //
  //   /**
  //    * Update the status of an application (e.g. approve / reject).
  //    * @param {string|number} scholarshipId
  //    * @param {string|number} applicationId
  //    * @param {object}        updates       – e.g. { status: "approved" }
  //    * @returns {Promise<object>}
  //    */
  //   async updateApplicationStatus(scholarshipId, applicationId, updates) {
  //     if (!scholarshipId) throw new Error("Scholarship ID is required.");
  //     if (!applicationId) throw new Error("Application ID is required.");
  //
  //     const { data } = await this.api.patch(
  //       `/${scholarshipId}/applications/${applicationId}`,
  //       updates,
  //     );
  //     return data;
  //   }
}

export default ScholarshipService;
