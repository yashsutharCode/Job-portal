# AI-Powered Job Portal 💼 🤖

A professional, full-stack MERN application designed to bridge the gap between job seekers and recruiters with high-speed **Artificial Intelligence**. This platform features a clean UI and a high-performance backend that goes beyond standard job boards by offering real-time AI resume coaching.

🚀 **Live Demo:** [https://job-find-8.onrender.com](https://job-find-8.onrender.com)

---

## 🛠️ Tech Stack

### **Frontend**
* **React.js & Vite** – Lightning-fast frontend development.
* **Redux Toolkit** – Centralized state management for Auth, Jobs, and AI data.
* **Tailwind CSS & Shadcn UI** – Modern, accessible, and responsive design components.
* **Framer Motion** – High-quality UI transitions and animations.

### **Backend & AI Intelligence**
* **Groq Cloud API** – High-speed LLM integration for **AI Resume Analysis**.
* **Node.js & Express.js** – Robust and scalable server-side architecture.
* **MongoDB & Mongoose** – Flexible NoSQL data modeling.
* **JWT & BcryptJS** – Secure session management and encrypted authentication.
* **Cloudinary** – Cloud-based storage for resumes and profile images.

---

## ✨ Key Features

* **🤖 AI Resume Scoring:** Dynamically analyzes resumes against specific job descriptions using the **Groq LPU**.
* **📈 Smart Feedback:** Provides an optimization score and actionable advice to help candidates bypass ATS filters.
* **👥 Dual Dashboards:** Specialized, real-time interfaces for **Recruiters** (Job/Company management) and **Applicants**.
* **🔍 Advanced Filtering:** Multi-criteria search for jobs by location, industry, and salary range.
* **💼 Recruitment Suite:** Tools for recruiters to create company profiles and manage applicant status instantly.
* **🔐 Secure Infrastructure:** Protected routes and secure, cookie-based session handling.

---

## 📂 Project Structure

```text
JOB-PORTAL/
├── BACKEND/
│   ├── controllers/    # Business logic for Users, Jobs, and AI Analysis
│   ├── middlewares/    # Authentication & Multer file upload logic
│   ├── models/         # MongoDB Schemas (User, Job, Company, Application)
│   ├── routes/         # API Endpoints
│   └── utils/          # Database connection & Groq/Cloudinary config
├── FRONTEND/
│   ├── src/
│   │   ├── components/ # UI, Admin dashboards, and Auth components
│   │   ├── hooks/      # Custom hooks for modular data fetching
│   │   ├── redux/      # Global state management (slices & store)
│   │   └── App.jsx     # Routing and core application structure
├── index.js            # Main server entry point (Root)
└── README.md           # Project documentation


🤖 AI Integration Details
The AI Resume Feedback engine optimizes the hiring process by:
Parsing Data: Extracting key technical data from the student's uploaded profile.
Contextual Comparison: Sending the resume text and the Job Description to the Groq LPU (Language Processing Unit).
Intelligent Output: Generating a Match Score (%) and identifying specific skill gaps or missing keywords to improve candidate alignment with the role.