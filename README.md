# 📝 To-Do List App

A role-based task management app built with Next.js (Frontend), Golang Gin (Backend), and PostgreSQL (Database). This app allows `assigner` to create, assign, edit, and delete tasks, while `user` can only view and update the status of their assigned tasks.

---

## Features

- ✅ JWT-based Authentication
- 🧑‍💼 Role-based Access (`assigner` & `user`)
- 🧾 Task Management (CRUD)
- 🎨 Responsive UI with TailwindCSS
- 🔔 SweetAlert notifications
- 📦 RESTful API built with Golang Gin

---

## Project Structure
project-root/
│
├── backend/ # Golang Gin API
│ └── main.go # Main entry point
│
├── frontend/ # Next.js app
│ ├── pages/
│ └── components/
│
├── database/ # SQL schema and config
│ └── init.sql
│
├── README.md
└── .env


---

## 🛠️ Tech Stack

| Frontend | Backend | Database |
|----------|---------|----------|
| Next.js  | Golang Gin | PostgreSQL |

---

## Installation

### 1. Clone this repository

```bash
git clone https://github.com/username/todo-role-app.git
cd todo-role-app



### Setup Backend
cd backend
go mod tidy
go run main.go


## Setup Frontend
cd frontend
npm install
npm run dev


Assigner:
- Can create, edit, delete todos
- Can assign to users
- Can see all todos

User:
- Can only view assigned todos
- Can update their status (e.g., done/not done)
