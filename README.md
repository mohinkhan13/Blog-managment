# 📝 Blog Management System (Full Stack Django + React)

This is a full-featured blog management application built with Django REST Framework (backend) and React (frontend). It supports blog creation, editing, category & comment management, user authentication, analytics, and admin control.

![Project Screenshot](https://github.com/mohinkhan13/Blog-managment/blob/main/Project%20Screenshot/Home%20page%2001.png)
![Project Screenshot](https://github.com/mohinkhan13/Blog-managment/blob/main/Project%20Screenshot/home%20page%2003.png)
![Project Screenshot](https://github.com/mohinkhan13/Blog-managment/blob/main/Project%20Screenshot/post%20detail%20page.png)
![Project Screenshot](https://github.com/mohinkhan13/Blog-managment/blob/main/Project%20Screenshot/Admin%20Panel.png)
![Project Screenshot](https://github.com/mohinkhan13/Blog-managment/blob/main/Project%20Screenshot/Admin%20Posts.png)

## 🚀 Features

### Backend (Django REST Framework)
- JWT Authentication (Login, Logout, Role-based Access)
- Blog CRUD with image upload
- Category, Comment & Reply System
- Post Statistics (views, likes, comments, shares)
- Contact Form & Newsletter Subscription
- Secure API with role-based permissions

### Frontend (React)
- Admin Dashboard (Posts, Users, Categories, Stats)
- User Blog Interface (Home, All Posts, Post Details)
- Login/Signup, Newsletter, Contact
- Protected Routes & AuthContext
- State Management with Redux
- Tailwind CSS for responsive UI

## 🔁 Data Flow
- React fetches data via REST API (with JWT token)
- Real-time updates for likes, views, comments
- Admin and user roles handled via tokens

## 👥 User Roles
- **Admin**: Full access to dashboard & moderation
- **User**: Browse, comment, like, subscribe

## 📦 Tech Stack
- **Backend**: Django, DRF, JWT, SQLite/PostgreSQL
- **Frontend**: React, Redux, Tailwind, React Router

## ✅ Highlights
- Secure & scalable architecture
- Responsive design for mobile & desktop
- Ideal for blog creators, CMS learners, portfolio projects

## 📌 Folder Structure
```
MyBlog/
├── MyBlog-Api-main/     # Django backend
└── MyBlog-main/         # React frontend
```


