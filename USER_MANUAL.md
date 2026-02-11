# Digital Scholarship System

A web-based scholarship application system using **Spring Boot (Backend)** and **React + Tailwind (Frontend)** with an embedded **SQLite** database.

## Prerequisites
* **Java JDK 17+**
* **Node.js v18+ & npm**

## Installation and Setup
### React
```
cd frontend
npm install
```

##  Quick Start

### 1. Start Backend (Spring Boot)
Runs on `http://localhost:8080`. The database (`scholarship.db`) is created automatically.

In project root, run:

**Windows:**
```cmd
.\mvnw.cmd spring-boot:run
```

**Mac/Linux:**
```bash
./mvnw spring-boot:run
```

### 2. Start Frontend (React)
Runs on `http://localhost:5173`
```
cd frontend
npm run dev
```


# User Guide

## 1. Getting Started

### Accessing the System
1. Open your web browser.
2. Navigate to the application URL (e.g., `http://localhost:5173` for development).
3. You will be directed to the **Login** page if not already authenticated.

### Creating an Account (Students Only)
If you are a new student:
1. Click the **Sign Up** link on the Login page.
2. Fill in the registration form with:
   * **Full Name:** Your complete name.
   * **Email:** Your institutional email (must be unique).
   * **Student ID:** Your official student identification number.
   * **Password:** A secure password (minimum 8 characters, including 1 uppercase letter, 1 symbol, and 1 number).
3. Click **Register**.
4. Return to the Login page and log in with your new credentials.

### Login to the System
1. Enter your **Email address**.
2. Enter your **Password**.
3. Click **Login**.
4. You will be redirected to your role-specific dashboard.

---

## 2. User Roles & Workflows

### A. STUDENT WORKFLOW
**Dashboard Overview:**
* View all available scholarships.
* Check the status of submitted applications.
* View scholarship details and requirements.
* Edit profile.

**Key Features:**
* **Browse Scholarships:** View all active scholarships, including amounts, deadlines, and descriptions.
* **Apply for Scholarship:** Click on a scholarship to view full details and use the **Apply Now** button to fill out and submit the form.
* **Track Applications:** Monitor status changes (**PENDING REVIEW**, **APPROVED**, **REJECTED**).
* **View Evaluation Results:** Receive email notifications on status changes.

### B. SCHOLARSHIP COMMITTEE WORKFLOW
**Dashboard Overview:**
* Access pending applications for review.
* View lists of assigned applications.

**Evaluation Modal:**
* View application details and download attached documents.
* Submit scores and provide comments.

**Key Features:**
* **Access Evaluation Queue:** View applications assigned to you by scholarship type. Tracks status as **PENDING** or **COMPLETED**.
* **Evaluate an Application:** 1. Click **Evaluate** on a pending application.
  2. Assess based on: **Academic excellence**, **Co-curricular involvement**, and **Leadership quality**.
  3. Assign scores for each rubric.
  4. Add feedback and click **Submit Evaluation**.
* **View Evaluation History:** Access previously submitted evaluations.

### C. REVIEWER WORKFLOW
**Dashboard Overview:**
* View all applications under assigned scholarship types.
* Monitor evaluated applications.
* Approve or reject applications.
* View scholarship data analytics.

**Key Features:**
* **Evaluate Applications:** Review rubrics (Academic, Cocurricular, Leadership) and full applicant details/documents.
* **Final Decisions:** Use the analytics and committee scores to finalize the application status.

### D. ADMIN WORKFLOW
**Dashboard Overview:**
* Manage all system users and roles.
* Create, update, or delete scholarship listings.
* View analytics on scholarship data and application details for all types.

**Key Features:**
* **Manage Users:** Filter users by role (**Student**, **Reviewer**, **Committee Member**, **Admin**).
* **Create New User:** Enter name, email, and role to generate credentials.
* **Edit/Delete:** Modify user information, change roles, or remove accounts/scholarships/applications from the system.

---

## 3. Step-by-Step Instructions

### Scenario 1: Student Applying for a Scholarship
1. Login with student credentials and navigate to the **Student Dashboard**.
2. Browse the scholarship list and click one to view details.
3. Review eligibility and click **Apply Now**.
4. Fill in the form: Personal details, Family income, and Achievements.
5. Upload required documents and click **Submit Application**.
6. Track status on your applications page: 
   > **Status Flow:** PENDING → Under Review → APPROVED/REJECTED

### Scenario 2: Committee Member Evaluating an Application
1. Login and navigate to the **Committee Member Dashboard**.
2. Click **Evaluate** on an application in your review queue.
3. Review student profile and supporting documents.
4. Enter scores (0-20) for each criteria and write feedback.
5. Click **Submit Evaluation**. The application will move to the Reviewer stage once all committee members finish.

### Scenario 3: Reviewer Approving an Application
1. Login and navigate to the **Reviewer Dashboard**.
2. Go to **Review Applications** to see evaluated apps and their scores.
3. Review the evaluation summary.
4. **Make final decision:** Click **Approve** or **Reject**.
5. Add optional comments and click **Submit Decision**. 
6. View how this affects the scholarship data in the **Analytics** section.

### Scenario 4: Administrator Creating a New User
1. Login with admin credentials and navigate to **Manage Users**.
2. Click **Create New User**.
3. Fill in the **Full Name**, **Email**, **Password**, and **Role**.
4. Save to create the account.

---

## 4. Common Tasks

### How to Reset Your Password
1. Click **Forgot Password** on the Login page.
2. Enter your email address.
3. Enter and confirm your new password.
4. Click **Reset Password**.

### How to Update Your Profile
1. Click your **Profile Icon** (top right).
2. Click **Edit Profile**.
3. Update your **Name** or **Email**.
4. Click **Save Changes**.

### How to Logout
1. Click **Logout** in the top right corner.
2. You will be redirected back to the **Login** page.
