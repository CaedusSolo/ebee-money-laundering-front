# Digital Scholarship System

A web-based scholarship application system using **Spring Boot (Backend)** and **React + Tailwind (Frontend)** with an embedded **SQLite** database.

## Prerequisites
* **Java JDK 17+**
* **Node.js v18+ & npm**

## Installation and Setup
### React
```
cd sef/frontend
npm install
```

##  Quick Start

### 1. Start Backend (Spring Boot)
Runs on `http://localhost:8080`. The database (`scholarship.db`) is created automatically.

**Windows:**
```cmd
cd sef
.\mvnw.cmd spring-boot:run
```

### 2. Start Frontend (React)
Runs on http://localhost:5173
```
cd sef/frontend
npm run dev
```
