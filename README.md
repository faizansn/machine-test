readme_content = """
# 🚀 Task Management Backend

This is a full-featured backend service for managing users, roles, teams, projects, tasks, comments, categories, and notifications — with real-time capabilities via **Socket.IO**.

> **Branches:**
> - `development` – Main development branch  
> - `main` – Not actively maintained

## ✨ Core Features

- ✅ JWT-Based Authentication
- 🔐 Role-Based Access Control (RBAC)
- 💬 Real-Time Notifications with Socket.IO
- 🧠 Structured Project-Team-Task Workflow
- 🔁 Redis Integration for Token Blacklisting
- 📊 MongoDB Aggregation for Optimized Queries
- 🧰 Clean Architecture with Controllers & Services
- ✅ Validation with express-validator
- ❌ Centralized Error Handling

## 🛠️ Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- Socket.IO
- Redis
- JWT
- express-validator
- dotenv
- nodemailer

📁 Project Structure
.
├── bin/
├── config/
├── docs/
├── public/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── services/
├── utils/
├── validators/
├── app.js
└── README.md

## 🧠 System Overview

### 🔐 RBAC
Each user is assigned a role:
- Admin: Manage users and teams
- Team Lead: Manage tasks and projects
- Member: Work on assigned tasks

...

## 📌 Complete API List

### Auth
POST /api/auth/login – User login  
POST /api/auth/logout – User logout
POST /api/password-reset-email - Password Reset

### Users
GET /api/user 
POST /api/user  
GET /api/user/:id  
PUT /api/user/:id  
DELETE /api/user/:id

### Teams
GET /api/team 
POST /api/team  
PUT /api/team/:id  
DELETE /api/team/:id

### Projects
GET /api/project  
POST /api/project  
PUT /api/project/:id  
DELETE /api/project/:id
GET /api/project/progress

### Tasks
GET /api/task
POST /api/task  
GET /api/task/:id  
PUT /api/task/:id  
DELETE /api/task/:id
PUT /api/task/:id/start
GET /api/task/report
POST /api/task/:id/complete

### Notifications
GET /api/notification  
POST /api/notification  
PUT /api/notification/:id  
DELETE /api/notification/:id

### Categories
GET /api/category
POST /api/category  
PUT /api/category/:id  
DELETE /api/category/:id

---

To test your APIs, use the included Postman collection under `docs/postman_collection.json`.

"""
