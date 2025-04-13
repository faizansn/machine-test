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
POST /api/auth/register – Register user  
POST /api/auth/login – User login  
POST /api/auth/logout – User logout

### Users
GET /api/users  
POST /api/users  
GET /api/users/:id  
PUT /api/users/:id  
DELETE /api/users/:id

### Teams
GET /api/teams  
POST /api/teams  
PUT /api/teams/:id  
DELETE /api/teams/:id

### Projects
GET /api/projects  
POST /api/projects  
PUT /api/projects/:id  
DELETE /api/projects/:id
GET /api/projects/progress

### Tasks
GET /api/tasks  
POST /api/tasks  
GET /api/tasks/:id  
PUT /api/tasks/:id  
DELETE /api/tasks/:id
PUT /api/tasks/:id/start
GET /api/tasks/report
POST /api/tasks/:id/complete

### Comments
POST /api/tasks/:taskId/comments  
GET /api/tasks/:taskId/comments

### Notifications
GET /api/notifications  
POST /api/notifications  
PUT /api/notifications/:id  
DELETE /api/notifications/:id

### Categories
GET /api/categories  
POST /api/categories  
PUT /api/categories/:id  
DELETE /api/categories/:id

---

To test your APIs, use the included Postman collection under `docs/postman_collection.json`.

"""
