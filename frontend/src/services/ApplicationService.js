/**
 * ApplicationService
 * Handles all scholarship application operations against a backend API.
 * Every request attaches the provided JWT token as a Bearer credential.
 */

import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

export default class ApplicationService {
  /**
   * @param {string} token - A valid JWT token for authorising requests.
   */
  constructor(token) {
    if (!token) {
      throw new Error(
        "A valid JWT token is required to initialise ApplicationService.",
      );
    }

    // Dedicated axios instance scoped to this service
    this.axios = axios.create({
      baseURL: BASE_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Response interceptor — normalises errors into a consistent shape
    this.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const res = error.response;
        const message =
          res?.data?.message ||
          res?.data?.error ||
          error.message ||
          "Unknown error";
        const appError = new Error(message);
        appError.statusCode = res?.status;
        appError.response = res?.data;
        return Promise.reject(appError);
      },
    );
  }

  // ─── token management ───────────────────────────────────────────────────────

  /**
   * Replace the current JWT with a new one (e.g. after a token refresh).
   * @param {string} newToken
   */
  setToken(newToken) {
    if (!newToken) throw new Error("Token cannot be empty.");
    this.axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  }

  // ─── CRUD operations ────────────────────────────────────────────────────────

  /**
   * Retrieve all scholarship applications.
   * Supports optional query-string filters.
   *
   * @returns {Promise<Array<Object>>}     List of application objects
   */
  async getApplications() {
    const { data } = await this.axios.get("/applications");
    return data;
  }

  /**
   * Retrieve applications for a specific scholarship.
   *
   * @param {string|number} scholarshipId
   * @returns {Promise<Array<Object>>} List of application objects
   */
  async getApplicationsByScholarship(scholarshipId) {
    if (!scholarshipId) throw new Error("scholarshipId is required.");
    const { data } = await this.axios.get(
      `/applications/scholarship/${scholarshipId}`
    );
    return data;
  }

  /**
   * Retrieve application summaries for a specific scholarship.
   * Returns only: applicationId, studentName, createdAt, submittedAt, status
   *
   * @param {string|number} scholarshipId
   * @returns {Promise<Array<Object>>} List of application summary objects
   */
  async getApplicationSummariesByScholarship(scholarshipId) {
    if (!scholarshipId) throw new Error("scholarshipId is required.");
    const { data } = await this.axios.get(
      `/applications/scholarship/${scholarshipId}/summaries`
    );
    return data;
  }

  /**
   * Retrieve a single application by its ID.
   *
   * @param {string} applicationId
   * @returns {Promise<Object>} The application object
   */
  async getApplicationById(applicationId) {
    if (!applicationId) throw new Error("applicationId is required.");
    const { data } = await this.axios.get(`/applications/${applicationId}`);
    return data;
  }

  /**
   * Create (submit) a new scholarship application.
   *
   * @param {Object} applicationData
   * @param {string} applicationData.scholarshipId  - Target scholarship ID
   * @param {string} applicationData.applicantName  - Full name of the applicant
   * @param {string} applicationData.email          - Contact email
   * @param {string} [applicationData.phone]        - Optional phone number
   * @param {string} [applicationData.essay]        - Optional essay / personal statement
   * @param {Object} [applicationData.documents]    - Optional attached document metadata
   * @returns {Promise<Object>} The newly created application object
   */
  async createApplication(applicationData) {
    if (!applicationData?.scholarshipId) {
      throw new Error("scholarshipId is required in the application data.");
    }
    if (!applicationData?.applicantName) {
      throw new Error("applicantName is required in the application data.");
    }
    if (!applicationData?.email) {
      throw new Error("email is required in the application data.");
    }
    return (await this.axios.post("/applications", applicationData)).data;
  }

  /**
   * Fully replace an existing application (PUT).
   *
   * @param {string} applicationId
   * @param {Object} applicationData - Complete updated application payload
   * @returns {Promise<Object>}      The updated application object
   */
  async updateApplication(applicationId, applicationData) {
    if (!applicationId) throw new Error("applicationId is required.");
    if (!applicationData) throw new Error("applicationData is required.");
    return (
      await this.axios.put(`/applications/${applicationId}`, applicationData)
    ).data;
  }

  /**
   * Partially update an existing application (PATCH).
   *
   * @param {string} applicationId
   * @param {Object} updates - Only the fields that should change
   * @returns {Promise<Object>} The patched application object
   */
  async patchApplication(applicationId, updates) {
    if (!applicationId) throw new Error("applicationId is required.");
    if (!updates || Object.keys(updates).length === 0) {
      throw new Error("At least one field to update is required.");
    }
    return (await this.axios.patch(`/applications/${applicationId}`, updates))
      .data;
  }

  /**
   * Delete an application by its ID.
   *
   * @param {string} applicationId
   * @returns {Promise<null>} Resolves to null on success (204)
   */
  async deleteApplication(applicationId) {
    if (!applicationId) throw new Error("applicationId is required.");
    return (await this.axios.delete(`/applications/${applicationId}`)).data;
  }

  // ─── status transitions ─────────────────────────────────────────────────────

  /**
   * Update the status of an application (approve / reject / set to pending, etc.).
   *
   * @param {string} applicationId
   * @param {"pending"|"approved"|"rejected"|"under_review"} status
   * @param {string} [reason] - Optional reason (e.g. rejection reason)
   * @returns {Promise<Object>} The updated application object
   */
  async updateStatus(applicationId, status, reason = null) {
    if (!applicationId) throw new Error("applicationId is required.");
    if (!status) throw new Error("status is required.");

    const payload = { status };
    if (reason) payload.reason = reason;

    return (
      await this.axios.patch(`/applications/${applicationId}/status`, payload)
    ).data;
  }
}
